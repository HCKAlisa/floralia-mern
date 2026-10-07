import express from 'express';
import path from 'node:path';
import { stat } from 'node:fs/promises';
import cookieParser from 'cookie-parser';
import { createLocalizationAccess, createLocalizationSession, isLocalizationEmailAllowed,
    LOCALIZATION_COOKIE, localizationCookieOptions, requireSameOrigin } from '../utils/verifyLocalizationAccess.ts';
import type { LocalizationAccessConfig } from '../utils/verifyLocalizationAccess.ts';
import { verifyFirebaseGoogleToken } from '../utils/verifyFirebaseGoogleToken.ts';
import type { JWTVerifyGetKey } from 'jose';

interface LocalizationConfig extends LocalizationAccessConfig {
    clientDirectory: string;
    webglDirectory?: string;
    firebaseProjectId?: string;
}

async function isFile(file?: string): Promise<boolean> {
    if (!file || !path.isAbsolute(file)) return false;
    try { return (await stat(file)).isFile(); } catch { return false; }
}

export function createLocalizationRouter(config: LocalizationConfig, firebaseKeys?: JWTVerifyGetKey) {
    for (const buildPath of [config.webglDirectory]) {
        if (!buildPath) continue;
        if (!path.isAbsolute(buildPath)) throw new Error('Localization build paths must be absolute');
        for (const publicDirectory of [config.clientDirectory, path.resolve(config.clientDirectory, '../public')]) {
            const relative = path.relative(publicDirectory, buildPath);
            if (relative === '' || (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative))) {
                throw new Error('Localization builds must be outside client/dist and client/public');
            }
        }
    }
    const router = express.Router();
    router.use(cookieParser());
    router.use((_req, res, next) => {
        res.set('Cache-Control', 'private, no-store');
        res.set('X-Robots-Tag', 'noindex, nofollow');
        res.vary('Cookie');
        next();
    });
    const webglAvailable = () => config.webglDirectory
        ? isFile(path.join(config.webglDirectory, 'index.html')) : Promise.resolve(false);

    router.post('/api/login', requireSameOrigin, async (req, res) => {
        try {
            const identity = await verifyFirebaseGoogleToken(req.body?.idToken, config.firebaseProjectId, firebaseKeys);
            if (!isLocalizationEmailAllowed(identity.email, config)) {
                res.status(403).json({ code: 'access_denied' });
                return;
            }
            const session = await createLocalizationSession(identity.email, config);
            res.cookie(LOCALIZATION_COOKIE, session, localizationCookieOptions).status(204).end();
        } catch (error) {
            if (error instanceof Error && error.message === 'access_not_configured') {
                res.status(503).json({ code: 'access_not_configured' });
                return;
            }
            res.status(401).json({ code: 'invalid_token' });
        }
    });
    router.post('/api/logout', requireSameOrigin, (_req, res) => {
        res.clearCookie(LOCALIZATION_COOKIE, {
            httpOnly: localizationCookieOptions.httpOnly,
            secure: localizationCookieOptions.secure,
            sameSite: localizationCookieOptions.sameSite,
            path: localizationCookieOptions.path,
        }).status(204).end();
    });
    router.get('/', (_req, res) => {
        res.sendFile(path.join(config.clientDirectory, 'index.html'), { cacheControl: false });
    });

    router.use(createLocalizationAccess(config));
    router.get('/api/session', async (_req, res) => {
        res.json({ email: res.locals.localizationEmail,
            webglAvailable: await webglAvailable() });
    });
    router.use('/play', async (_req, res, next) => {
        if (!await webglAvailable()) { res.sendStatus(404); return; }
        next();
    }, express.static(config.webglDirectory || path.join(config.clientDirectory, '../unconfigured-webgl'), {
        cacheControl: false, dotfiles: 'deny', fallthrough: false,
        setHeaders: (res, file) => {
            const encoding = file.endsWith('.br') ? 'br' : file.endsWith('.gz') ? 'gzip' : undefined;
            if (!encoding) return;
            res.setHeader('Content-Encoding', encoding);
            const extension = path.extname(file.slice(0, -3));
            res.setHeader('Content-Type', extension === '.wasm' ? 'application/wasm'
                : extension === '.js' ? 'application/javascript' : 'application/octet-stream');
        },
    }));
    router.use((_req, res) => { res.sendStatus(404); });
    router.use((error: { status?: number }, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
        if (!res.headersSent) res.status(error.status === 404 ? 404 : 500).json({ code: 'build_unavailable' });
    });
    return router;
}
