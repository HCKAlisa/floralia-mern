import express from 'express';
import path from 'node:path';
import { stat } from 'node:fs/promises';
import { createLocalizationAccess } from '../utils/verifyLocalizationAccess.ts';
import type { LocalizationAccessConfig } from '../utils/verifyLocalizationAccess.ts';
import type { JWTVerifyGetKey } from 'jose';

interface LocalizationConfig extends LocalizationAccessConfig {
    clientDirectory: string;
    webglDirectory?: string;
}

async function isFile(file?: string): Promise<boolean> {
    if (!file || !path.isAbsolute(file)) return false;
    try { return (await stat(file)).isFile(); } catch { return false; }
}

export function createLocalizationRouter(config: LocalizationConfig, keys?: JWTVerifyGetKey) {
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
    router.use(createLocalizationAccess(config, keys));
    const webglAvailable = () => config.webglDirectory
        ? isFile(path.join(config.webglDirectory, 'index.html')) : Promise.resolve(false);

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
    router.get('/', (_req, res) => {
        res.sendFile(path.join(config.clientDirectory, 'index.html'), { cacheControl: false });
    });
    router.use((_req, res) => { res.sendStatus(404); });
    router.use((error: { status?: number }, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
        if (!res.headersSent) res.status(error.status === 404 ? 404 : 500).json({ code: 'build_unavailable' });
    });
    return router;
}
