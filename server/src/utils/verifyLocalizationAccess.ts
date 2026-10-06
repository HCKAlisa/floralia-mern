import type { RequestHandler } from 'express';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import type { JWTVerifyGetKey } from 'jose';

export interface LocalizationAccessConfig {
    teamDomain?: string;
    audience?: string;
}

export function createLocalizationAccess(config: LocalizationAccessConfig, keys?: JWTVerifyGetKey): RequestHandler {
    const issuer = config.teamDomain?.replace(/\/$/, '');
    const audience = config.audience?.trim();
    const configured = issuer && /^https:\/\/[a-z0-9-]+\.cloudflareaccess\.com$/i.test(issuer) && audience;
    const keySet = configured ? keys ?? createRemoteJWKSet(new URL(`${issuer}/cdn-cgi/access/certs`)) : undefined;

    return async (req, res, next) => {
        res.set('Cache-Control', 'private, no-store');
        res.set('X-Robots-Tag', 'noindex, nofollow');
        res.vary('Cookie');
        res.vary('Cf-Access-Jwt-Assertion');
        if (!keySet || !issuer || !audience) {
            res.status(503).json({ code: 'access_not_configured' });
            return;
        }
        const token = req.get('Cf-Access-Jwt-Assertion');
        if (!token) {
            res.status(403).json({ code: 'access_required' });
            return;
        }
        try {
            const { payload } = await jwtVerify(token, keySet, {
                issuer, audience, algorithms: ['RS256'],
                requiredClaims: ['exp', 'iat', 'sub', 'email'],
            });
            if (typeof payload.email !== 'string' || !payload.email.trim()) throw new Error('Human identity required');
            res.locals.localizationEmail = payload.email;
        } catch {
            res.status(403).json({ code: 'access_required' });
            return;
        }
        next();
    };
}
