import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import { createLocalizationSession } from '../src/utils/verifyLocalizationAccess.ts';
import {
    createBugReportReaderAuth,
    createBugReportRouter,
    type BugReportRepository,
    type StoredBugReport,
} from '../src/routes/bug-report.routes.ts';
import BugReportModel from '../src/models/bugReport.model.ts';

const validContext = {
    capturedAt: '2026-10-09T12:34:56.000Z',
    buildVersion: '0.4.2',
    platform: 'WindowsPlayer',
    language: 'en-CA',
    scene: 'FlowerShop',
    page: '',
    room: 'Main Room',
    day: 12,
    season: 'Spring',
    dayPhase: 'Afternoon',
    timelineDay: 12,
    timelinePosition: ['Lumi 2', 'WaitForPackage'],
    conversation: 'Lumi 2',
    nodeId: 'node-17',
    sessionPlaySeconds: 123.5,
};
const jpeg = Buffer.from([
    0xff, 0xd8,
    0xff, 0xdb, 0x00, 0x43, 0x00, ...new Array(64).fill(1),
    0xff, 0xc0, 0x00, 0x0b, 0x08, 0x00, 0x01, 0x00, 0x01, 0x01, 0x01, 0x11, 0x00,
    0xff, 0xc4, 0x00, 0x14, 0x00, 0x01, ...new Array(15).fill(0), 0x00,
    0xff, 0xda, 0x00, 0x08, 0x01, 0x01, 0x00, 0x00, 0x3f, 0x00,
    0x01, 0xff, 0xd9,
]);
const tinyFakeJpeg = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x02, 0xff, 0xd9]);
const jpegWithDimensions = (width: number, height: number) => {
    const value = Buffer.from(jpeg);
    const frame = value.indexOf(Buffer.from([0xff, 0xc0]));
    assert.notEqual(frame, -1);
    value.writeUInt16BE(height, frame + 5);
    value.writeUInt16BE(width, frame + 7);
    return value;
};

class MemoryRepository implements BugReportRepository {
    reports: StoredBugReport[] = [];
    images = new Map<string, Buffer>();

    async create(value: Parameters<BugReportRepository['create']>[0]): Promise<void> {
        const timestamp = new Date('2026-10-09T13:00:00.000Z');
        this.reports.push({
            reportId: value.reportId,
            description: value.description,
            context: value.context,
            hasScreenshot: Boolean(value.screenshot),
            createdAt: timestamp,
            updatedAt: timestamp,
            expiresAt: value.expiresAt,
        });
        if (value.screenshot) this.images.set(value.reportId, value.screenshot);
    }

    async storageUsage(): Promise<{ reports: number; screenshotBytes: number }> {
        return {
            reports: this.reports.length,
            screenshotBytes: [...this.images.values()].reduce((total, image) => total + image.length, 0),
        };
    }

    async list(page: number, limit: number): Promise<{ reports: StoredBugReport[]; total: number }> {
        return { reports: this.reports.slice((page - 1) * limit, page * limit), total: this.reports.length };
    }

    async find(reportId: string): Promise<StoredBugReport | null> {
        return this.reports.find(report => report.reportId === reportId) ?? null;
    }

    async findImage(reportId: string): Promise<Buffer | null> {
        return this.images.get(reportId) ?? null;
    }
}

async function startApp(repository: BugReportRepository, options: Parameters<typeof createBugReportRouter>[0] = {}) {
    const app = express();
    app.use(cookieParser());
    app.use('/api/bug-reports', createBugReportRouter({ repository, ...options }));
    // This deliberately tiny global parser proves the report parser handled its route first.
    app.use(express.json({ limit: '1b' }));
    const server = app.listen(0, '127.0.0.1');
    await new Promise<void>(resolve => server.once('listening', resolve));
    const address = server.address();
    assert(address && typeof address !== 'string');
    return {
        origin: `http://127.0.0.1:${address.port}`,
        close: () => new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve())),
    };
}

test('bug report submission validates, limits, and stores bounded reports', async t => {
    const repository = new MemoryRepository();
    let now = Date.parse('2026-10-09T13:00:00.000Z');
    const running = await startApp(repository, { now: () => now, submissionLimitPerHour: 100 });
    const post = (body: unknown, headers: Record<string, string> = {}) => fetch(running.origin + '/api/bug-reports', {
        method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body),
    });

    try {
        await t.test('accepts native requests and valid JPEG data only when submitted', async () => {
            assert.equal(repository.reports.length, 0);
            const response = await post({ description: 'The package did not open.', context: validContext, screenshot: jpeg.toString('base64') });
            assert.equal(response.status, 201);
            const result = await response.json() as { reportId: string };
            assert.match(result.reportId, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
            assert.equal(repository.reports.length, 1);
            assert.deepEqual(repository.images.get(result.reportId), jpeg);
            assert.equal(repository.reports[0].expiresAt.toISOString(), '2027-01-07T13:00:00.000Z');
        });

        await t.test('treats Unity null and empty screenshot values as no attachment', async () => {
            for (const screenshot of [null, '']) {
                const response = await post({ description: 'No screenshot', context: validContext, screenshot });
                assert.equal(response.status, 201);
                const result = await response.json() as { reportId: string };
                assert.equal(repository.reports.find(report => report.reportId === result.reportId)?.hasScreenshot, false);
                assert.equal(repository.images.has(result.reportId), false);
            }
        });

        await t.test('allows only the production website when a browser Origin is present', async () => {
            assert.equal((await post({ description: 'Browser report', context: validContext }, { Origin: 'https://floraliagames.com' })).status, 201);
            assert.equal((await post({ description: 'Browser report', context: validContext }, { Origin: 'https://www.floraliagames.com' })).status, 201);
            assert.equal((await post({ description: 'Browser report', context: validContext }, { Origin: 'https://attacker.example' })).status, 403);
            assert.equal((await post({ description: 'Browser report', context: validContext }, { Origin: 'null' })).status, 403);
        });

        await t.test('rejects extra fields, invalid types, and forged image content', async () => {
            const invalidReports = [
                { description: '', context: validContext },
                { description: 'x'.repeat(4001), context: validContext },
                { description: 'Extra', context: validContext, extra: true },
                { description: 'Extra context', context: { ...validContext, privateData: 'no' } },
                { description: 'Bad date', context: { ...validContext, capturedAt: 'today' } },
                { description: 'Bad day', context: { ...validContext, day: 1.5 } },
                { description: 'Bad page', context: { ...validContext, page: 'x'.repeat(201) } },
                { description: 'Bad position', context: { ...validContext, timelinePosition: [12] } },
                { description: 'Bad duration', context: { ...validContext, sessionPlaySeconds: -1 } },
                { description: 'Forged JPEG', context: validContext, screenshot: Buffer.from('not jpeg').toString('base64') },
                { description: 'Tiny fake JPEG', context: validContext, screenshot: tinyFakeJpeg.toString('base64') },
                { description: 'Wide JPEG header', context: validContext, screenshot: jpegWithDimensions(4097, 1).toString('base64') },
                { description: 'Pixel bomb header', context: validContext, screenshot: jpegWithDimensions(3000, 3000).toString('base64') },
                { description: 'Data URI', context: validContext, screenshot: `data:image/jpeg;base64,${jpeg.toString('base64')}` },
            ];
            for (const report of invalidReports) {
                const response = await post(report);
                assert.equal(response.status, 400, JSON.stringify(report).slice(0, 100));
                assert.deepEqual(await response.json(), { code: 'invalid_report' });
            }
        });

        await t.test('rejects malformed and oversized JSON with stable errors', async () => {
            const malformed = await fetch(running.origin + '/api/bug-reports', {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{',
            });
            assert.equal(malformed.status, 400);
            assert.deepEqual(await malformed.json(), { code: 'invalid_json' });
            const oversized = await post({ description: 'x', context: validContext, padding: 'x'.repeat(3 * 1024 * 1024) });
            assert.equal(oversized.status, 413);
            assert.deepEqual(await oversized.json(), { code: 'payload_too_large' });
        });

        now += 3_600_000;
    } finally {
        await running.close();
    }
});

test('accepted-report limits use the actual connection and ignore proxy identity headers', async () => {
    const repository = new MemoryRepository();
    const running = await startApp(repository, {
        submissionLimitPerHour: 2, globalSubmissionLimitPerHour: 10,
        requestLimitPerSocketPerMinute: 10, globalRequestLimitPerMinute: 20,
    });
    const body = JSON.stringify({ description: 'Rate test', context: validContext });
    try {
        for (const forwarded of ['198.51.100.1', '198.51.100.2']) {
            const response = await fetch(running.origin + '/api/bug-reports', {
                method: 'POST', headers: {
                    'Content-Type': 'application/json', 'X-Forwarded-For': forwarded,
                    'CF-Connecting-IP': forwarded,
                }, body,
            });
            assert.equal(response.status, 201);
        }
        const limited = await fetch(running.origin + '/api/bug-reports', {
            method: 'POST', headers: {
                'Content-Type': 'application/json', 'X-Forwarded-For': '203.0.113.10',
                'CF-Connecting-IP': '203.0.113.10',
            }, body,
        });
        assert.equal(limited.status, 429);
        assert.equal(limited.headers.get('retry-after'), '3600');
    } finally {
        await running.close();
    }
});

test('invalid reports do not consume accepted-report quotas', async () => {
    const repository = new MemoryRepository();
    const running = await startApp(repository, {
        submissionLimitPerHour: 1, globalSubmissionLimitPerHour: 10,
        requestLimitPerSocketPerMinute: 10, globalRequestLimitPerMinute: 20,
    });
    const body = JSON.stringify({ description: 'Rate test', context: validContext });
    const submit = (headers: Record<string, string> = {}) => fetch(running.origin + '/api/bug-reports', {
        method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body,
    });
    try {
        const invalid = await fetch(running.origin + '/api/bug-reports', {
            method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Forwarded-For': '198.51.100.1' },
            body: JSON.stringify({ description: '', context: validContext }),
        });
        assert.equal(invalid.status, 400);
        assert.equal((await submit({ 'CF-Connecting-IP': '198.51.100.1' })).status, 201);
        assert.equal((await submit({ 'CF-Connecting-IP': '198.51.100.2' })).status, 429);
    } finally {
        await running.close();
    }
});

test('the global burst limit applies before request body parsing', async () => {
    const repository = new MemoryRepository();
    const running = await startApp(repository, {
        submissionLimitPerHour: 10, requestLimitPerSocketPerMinute: 10, globalRequestLimitPerMinute: 2,
    });
    const body = JSON.stringify({ description: 'Global rate test', context: validContext });
    try {
        for (let index = 0; index < 2; index += 1) {
            assert.equal((await fetch(running.origin + '/api/bug-reports', {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body,
            })).status, 201);
        }
        const limited = await fetch(running.origin + '/api/bug-reports', {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{',
        });
        assert.equal(limited.status, 429);
        assert.equal(limited.headers.get('retry-after'), '60');
    } finally {
        await running.close();
    }
});

test('storage guard reserves database capacity before accepting a report', async () => {
    const repository = new MemoryRepository();
    let usage = { reports: 500, screenshotBytes: 0 };
    repository.storageUsage = async () => usage;
    const running = await startApp(repository, { submissionLimitPerHour: 10 });
    const submit = (screenshot?: string) => fetch(running.origin + '/api/bug-reports', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: 'Capacity test', context: validContext, ...(screenshot ? { screenshot } : {}) }),
    });
    try {
        const reportCap = await submit();
        assert.equal(reportCap.status, 503);
        assert.deepEqual(await reportCap.json(), { code: 'report_storage_full' });
        assert.equal(repository.reports.length, 0);

        usage = { reports: 10, screenshotBytes: 64 * 1024 * 1024 };
        const byteCap = await submit(jpeg.toString('base64'));
        assert.equal(byteCap.status, 503);
        assert.deepEqual(await byteCap.json(), { code: 'report_storage_full' });
        assert.equal(repository.reports.length, 0);
    } finally {
        await running.close();
    }
});

test('private readers require the existing admin account and never expose image bytes in JSON', async () => {
    const repository = new MemoryRepository();
    const secret = 'existing-admin-secret';
    const emails = new Map([
        ['admin-id', 'floraliagames@gmail.com'],
        ['case-id', 'FloraliaGames@gmail.com'],
        ['user-id', 'player@example.test'],
    ]);
    const readerAuth = createBugReportReaderAuth({ jwtSecret: secret, findUserEmail: async id => emails.get(id) ?? null });
    const running = await startApp(repository, { readerAuth, submissionLimitPerHour: 20 });
    const submit = await fetch(running.origin + '/api/bug-reports', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: 'Private screenshot', context: validContext, screenshot: jpeg.toString('base64') }),
    });
    const { reportId } = await submit.json() as { reportId: string };
    const googleOwnerCookie = `access_token=${jwt.sign({
        id: 'admin-id', authProvider: 'google', email: 'floraliagames@gmail.com',
    }, secret, { expiresIn: '1h' })}`;
    const oldOwnerCookie = `access_token=${jwt.sign({ id: 'admin-id' }, secret, { expiresIn: '1h' })}`;
    const passwordOwnerCookie = `access_token=${jwt.sign({
        id: 'admin-id', authProvider: 'password', email: 'floraliagames@gmail.com',
    }, secret, { expiresIn: '1h' })}`;
    const caseVariantCookie = `access_token=${jwt.sign({
        id: 'case-id', authProvider: 'google', email: 'FloraliaGames@gmail.com',
    }, secret, { expiresIn: '1h' })}`;
    const genericUserCookie = `access_token=${jwt.sign({
        id: 'user-id', authProvider: 'google', email: 'floraliagames@gmail.com',
    }, secret, { expiresIn: '1h' })}`;
    const localizationSession = await createLocalizationSession('floraliagames@gmail.com', { jwtSecret: secret });
    const localizationCookie = `localization_session=${localizationSession}`;
    const localizationAsAccessCookie = `access_token=${localizationSession}`;
    const get = (route: string, cookie?: string) => fetch(running.origin + route, { headers: cookie ? { Cookie: cookie } : {} });

    try {
        assert.equal((await get('/api/bug-reports')).status, 401);
        assert.equal((await get('/api/bug-reports', localizationCookie)).status, 401);
        assert.equal((await get('/api/bug-reports', localizationAsAccessCookie)).status, 401);
        assert.equal((await get('/api/bug-reports', oldOwnerCookie)).status, 403);
        assert.equal((await get('/api/bug-reports', passwordOwnerCookie)).status, 403);
        assert.equal((await get('/api/bug-reports', caseVariantCookie)).status, 403);
        assert.equal((await get('/api/bug-reports', genericUserCookie)).status, 403);

        const listResponse = await get('/api/bug-reports?page=1&limit=10', googleOwnerCookie);
        assert.equal(listResponse.status, 200);
        assert.equal(listResponse.headers.get('cache-control'), 'private, no-store');
        const list = await listResponse.json() as any;
        assert.equal(list.total, 1);
        assert.equal(list.pages, 1);
        assert.equal(list.reports[0].hasScreenshot, true);
        assert.equal('screenshot' in list.reports[0], false);

        const detailResponse = await get(`/api/bug-reports/${reportId}`, googleOwnerCookie);
        assert.equal(detailResponse.headers.get('cache-control'), 'private, no-store');
        assert.equal(detailResponse.status, 200);
        const detail = await detailResponse.json() as any;
        assert.equal(detail.report.reportId, reportId);
        assert.equal('screenshot' in detail.report, false);

        const imageResponse = await get(`/api/bug-reports/${reportId}/image`, googleOwnerCookie);
        assert.equal(imageResponse.status, 200);
        assert.equal(imageResponse.headers.get('content-type'), 'image/jpeg');
        assert.equal(imageResponse.headers.get('cache-control'), 'private, no-store');
        assert.equal(imageResponse.headers.get('x-content-type-options'), 'nosniff');
        assert.deepEqual(Buffer.from(await imageResponse.arrayBuffer()), jpeg);
        assert.equal((await get('/api/bug-reports/missing/image', googleOwnerCookie)).status, 404);
        assert.equal((await get('/api/bug-reports?page=0', googleOwnerCookie)).status, 400);
        assert.equal((await get('/api/bug-reports?limit=101', googleOwnerCookie)).status, 400);
    } finally {
        await running.close();
    }
});

test('Mongo schema keeps screenshot bytes private and expires reports after their retention date', () => {
    assert.equal(BugReportModel.schema.path('screenshot').options.select, false);
    assert.equal(BugReportModel.schema.path('screenshotBytes').options.select, false);
    const ttlIndex = BugReportModel.schema.indexes().find(([fields]) => fields.expiresAt === 1);
    assert(ttlIndex);
    assert.equal(ttlIndex[1].expireAfterSeconds, 0);
});

test('Mongo schema accepts blank optional game context from web fallback and localizer scenes', async () => {
    const report = new BugReportModel({
        reportId: '00000000-0000-4000-8000-000000000000',
        description: 'Model validation fixture',
        context: {
            capturedAt: '2026-10-09T12:34:56.000Z',
            buildVersion: '',
            platform: '',
            language: '',
            scene: '',
            page: '',
            room: '',
            day: 0,
            season: '',
            dayPhase: '',
            timelineDay: 0,
            timelinePosition: [],
            conversation: '',
            nodeId: '',
            sessionPlaySeconds: 0,
        },
        hasScreenshot: false,
        screenshotBytes: 0,
        expiresAt: new Date('2027-01-07T12:34:56.000Z'),
    });

    await assert.doesNotReject(report.validate());
    assert.equal(report.context.room, '');
    assert.equal(report.context.season, '');
    assert.equal(report.context.dayPhase, '');
});
