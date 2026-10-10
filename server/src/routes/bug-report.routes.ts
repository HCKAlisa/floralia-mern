import express, { type NextFunction, type Request, type RequestHandler, type Response } from 'express';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'node:crypto';
import BugReportModel from '../models/bugReport.model.ts';
import UserModel from '../models/user.model.ts';
import { validateBugReport, type BugReportContextInput, type ValidatedBugReport } from '../utils/bugReportValidation.ts';

const ADMIN_EMAIL = 'floraliagames@gmail.com';
const RETENTION_MS = 90 * 24 * 60 * 60 * 1000;
const MAX_STORED_REPORTS = 500;
const MAX_STORED_SCREENSHOT_BYTES = 64 * 1024 * 1024;
const ALLOWED_ORIGINS = new Set(['https://floraliagames.com', 'https://www.floraliagames.com']);

export interface StoredBugReport {
    reportId: string;
    description: string;
    context: BugReportContextInput;
    hasScreenshot: boolean;
    screenshot?: Buffer;
    createdAt: Date;
    updatedAt: Date;
    expiresAt: Date;
}

export interface BugReportRepository {
    create(report: ValidatedBugReport & { reportId: string; expiresAt: Date }): Promise<void>;
    storageUsage(): Promise<{ reports: number; screenshotBytes: number }>;
    list(page: number, limit: number): Promise<{ reports: StoredBugReport[]; total: number }>;
    find(reportId: string): Promise<StoredBugReport | null>;
    findImage(reportId: string): Promise<Buffer | null>;
}

export interface BugReportRouterOptions {
    repository?: BugReportRepository;
    readerAuth?: RequestHandler;
    now?: () => number;
    submissionLimitPerHour?: number;
    globalSubmissionLimitPerHour?: number;
    requestLimitPerSocketPerMinute?: number;
    globalRequestLimitPerMinute?: number;
}

function cleanRecord(value: any): StoredBugReport {
    return {
        reportId: value.reportId,
        description: value.description,
        context: value.context,
        hasScreenshot: value.hasScreenshot,
        createdAt: value.createdAt,
        updatedAt: value.updatedAt,
        expiresAt: value.expiresAt,
    };
}

export const mongoBugReportRepository: BugReportRepository = {
    async create(report) {
        await BugReportModel.create({
            ...report,
            hasScreenshot: Boolean(report.screenshot),
            screenshotBytes: report.screenshot?.length ?? 0,
            ...(report.screenshot ? { screenshotContentType: 'image/jpeg' } : {}),
        });
    },
    async storageUsage() {
        const [usage] = await BugReportModel.aggregate<{ reports: number; screenshotBytes: number }>([
            { $group: {
                _id: null,
                reports: { $sum: 1 },
                screenshotBytes: { $sum: { $ifNull: ['$screenshotBytes', 0] } },
            } },
        ]);
        return usage ?? { reports: 0, screenshotBytes: 0 };
    },
    async list(page, limit) {
        const [values, total] = await Promise.all([
            BugReportModel.find().sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
            BugReportModel.countDocuments(),
        ]);
        return { reports: values.map(cleanRecord), total };
    },
    async find(reportId) {
        const value = await BugReportModel.findOne({ reportId }).lean();
        return value ? cleanRecord(value) : null;
    },
    async findImage(reportId) {
        const value = await BugReportModel.findOne({ reportId }).select('+screenshot');
        return value?.screenshot ?? null;
    },
};

interface ReaderAuthDependencies {
    jwtSecret?: string;
    findUserEmail?: (id: string) => Promise<string | null>;
}

export function createBugReportReaderAuth(dependencies: ReaderAuthDependencies = {}): RequestHandler {
    const findUserEmail = dependencies.findUserEmail ?? (async id => {
        const user = await UserModel.findById(id).select('email').lean() as { email?: string } | null;
        return user?.email ?? null;
    });
    return async (req, res, next) => {
        const secret = dependencies.jwtSecret ?? process.env.JWT_SECRET;
        const token = req.cookies?.access_token;
        if (!secret || typeof token !== 'string') {
            res.status(401).json({ code: 'access_required' });
            return;
        }
        try {
            const payload = jwt.verify(token, secret, { algorithms: ['HS256'] });
            if (typeof payload !== 'object' || typeof payload.id !== 'string'
                || payload.authProvider !== 'google' || payload.email !== ADMIN_EMAIL) {
                res.status(403).json({ code: 'access_denied' });
                return;
            }
            const email = await findUserEmail(payload.id);
            if (email !== ADMIN_EMAIL) {
                res.status(403).json({ code: 'access_denied' });
                return;
            }
            next();
        } catch {
            res.status(401).json({ code: 'access_required' });
        }
    };
}

function createFixedWindowLimiter(now: () => number, windowMilliseconds: number, perSocketLimit: number,
    globalLimit: number, retryAfter: string): RequestHandler {
    const connections = new Map<string, { window: number; count: number }>();
    let global = { window: 0, count: 0 };
    return (req, res, next) => {
        const current = now();
        const globalWindow = Math.floor(current / windowMilliseconds);
        if (global.window !== globalWindow) global = { window: globalWindow, count: 0 };
        if (global.count >= globalLimit) {
            res.set('Retry-After', retryAfter).status(429).json({ code: 'rate_limited' });
            return;
        }

        const connection = req.socket.remoteAddress ?? 'unknown';
        const entry = connections.get(connection);
        const nextEntry = entry?.window === globalWindow ? entry : { window: globalWindow, count: 0 };
        if (nextEntry.count >= perSocketLimit) {
            res.set('Retry-After', retryAfter).status(429).json({ code: 'rate_limited' });
            return;
        }

        global.count += 1;
        nextEntry.count += 1;
        connections.set(connection, nextEntry);
        if (connections.size > 10_000) {
            for (const [key, value] of connections) if (value.window !== globalWindow) connections.delete(key);
        }
        next();
    };
}

function requireAllowedOrigin(req: Request, res: Response, next: NextFunction): void {
    const origin = req.get('Origin');
    if (origin === undefined || ALLOWED_ORIGINS.has(origin)) {
        next();
        return;
    }
    res.status(403).json({ code: 'invalid_origin' });
}

function positiveQueryInteger(value: unknown, fallback: number, maximum: number): number | null {
    if (value === undefined) return fallback;
    if (typeof value !== 'string' || !/^[1-9]\d*$/.test(value)) return null;
    const parsed = Number(value);
    return Number.isSafeInteger(parsed) && parsed <= maximum ? parsed : null;
}

export function createBugReportRouter(options: BugReportRouterOptions = {}): express.Router {
    const router = express.Router();
    router.use((_req, res, next) => {
        res.set('Cache-Control', 'private, no-store');
        next();
    });
    const repository = options.repository ?? mongoBugReportRepository;
    const now = options.now ?? Date.now;
    const readerAuth = options.readerAuth ?? createBugReportReaderAuth();
    const requestBurstLimiter = createFixedWindowLimiter(now, 60_000,
        options.requestLimitPerSocketPerMinute ?? 30, options.globalRequestLimitPerMinute ?? 100, '60');
    const acceptedReportLimiter = createFixedWindowLimiter(now, 3_600_000,
        options.submissionLimitPerHour ?? 50, options.globalSubmissionLimitPerHour ?? 200, '3600');
    const reportJson = express.json({ limit: '3mb', type: 'application/json' });
    let capacityQueue = Promise.resolve();

    const storeWithinCapacity = async (report: ValidatedBugReport & { reportId: string; expiresAt: Date }) => {
        let release = () => {};
        const previous = capacityQueue;
        capacityQueue = new Promise<void>(resolve => { release = resolve; });
        await previous;
        try {
            const usage = await repository.storageUsage();
            if (usage.reports >= MAX_STORED_REPORTS
                || usage.screenshotBytes + (report.screenshot?.length ?? 0) > MAX_STORED_SCREENSHOT_BYTES) return false;
            await repository.create(report);
            return true;
        } finally {
            release();
        }
    };

    router.post('/', requestBurstLimiter, requireAllowedOrigin, reportJson, async (req, res) => {
        const report = validateBugReport(req.body);
        if (!report) {
            res.status(400).json({ code: 'invalid_report' });
            return;
        }
        let accepted = false;
        acceptedReportLimiter(req, res, () => { accepted = true; });
        if (!accepted) return;
        const reportId = randomUUID();
        try {
            const stored = await storeWithinCapacity({ ...report, reportId, expiresAt: new Date(now() + RETENTION_MS) });
            if (!stored) {
                res.status(503).json({ code: 'report_storage_full' });
                return;
            }
            res.status(201).json({ reportId });
        } catch {
            res.status(500).json({ code: 'submission_failed' });
        }
    });

    router.get('/', readerAuth, async (req, res) => {
        const page = positiveQueryInteger(req.query.page, 1, 1_000_000);
        const limit = positiveQueryInteger(req.query.limit, 25, 100);
        if (page === null || limit === null) {
            res.status(400).json({ code: 'invalid_pagination' });
            return;
        }
        try {
            const result = await repository.list(page, limit);
            res.json({ ...result, page, limit, pages: Math.ceil(result.total / limit) });
        } catch {
            res.status(500).json({ code: 'read_failed' });
        }
    });

    router.get('/:reportId/image', readerAuth, async (req, res) => {
        try {
            const image = await repository.findImage(req.params.reportId);
            if (!image) {
                res.status(404).json({ code: 'not_found' });
                return;
            }
            res.set({
                'Cache-Control': 'private, no-store',
                'Content-Type': 'image/jpeg',
                'X-Content-Type-Options': 'nosniff',
            }).send(image);
        } catch {
            res.status(500).json({ code: 'read_failed' });
        }
    });

    router.get('/:reportId', readerAuth, async (req, res) => {
        try {
            const report = await repository.find(req.params.reportId);
            if (!report) {
                res.status(404).json({ code: 'not_found' });
                return;
            }
            res.json({ report });
        } catch {
            res.status(500).json({ code: 'read_failed' });
        }
    });

    router.use((error: any, _req: Request, res: Response, next: NextFunction) => {
        if (error?.type === 'entity.too.large') {
            res.status(413).json({ code: 'payload_too_large' });
            return;
        }
        if (error instanceof SyntaxError && 'body' in error) {
            res.status(400).json({ code: 'invalid_json' });
            return;
        }
        next(error);
    });

    return router;
}
