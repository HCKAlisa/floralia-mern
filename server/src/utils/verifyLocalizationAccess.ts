import type { RequestHandler } from 'express';
import { SignJWT, jwtVerify } from 'jose';
import { createHmac } from 'node:crypto';

export const LOCALIZATION_COOKIE = 'localization_session';
const SESSION_ISSUER = 'floralia-localization';
const SESSION_AUDIENCE = 'floralia-localization';
const SESSION_SECONDS = 24 * 60 * 60;

export interface LocalizationAccessConfig {
    jwtSecret?: string;
    allowedEmails?: string | (() => string | undefined);
}

function currentAllowedEmails(config: LocalizationAccessConfig): Set<string> {
    const source = typeof config.allowedEmails === 'function'
        ? config.allowedEmails()
        : config.allowedEmails ?? process.env.LOCALIZATION_ALLOWED_EMAILS;
    return new Set((source ?? '').split(',').map(email => email.trim().toLowerCase()).filter(Boolean));
}

export function isLocalizationEmailAllowed(email: string, config: LocalizationAccessConfig): boolean {
    return currentAllowedEmails(config).has(email.trim().toLowerCase());
}

function secretKey(config: LocalizationAccessConfig): Uint8Array | undefined {
    const secret = config.jwtSecret ?? process.env.JWT_SECRET;
    return secret
        ? createHmac('sha256', secret).update('floralia-localization-session-v1').digest()
        : undefined;
}

export async function createLocalizationSession(email: string, config: LocalizationAccessConfig): Promise<string> {
    const key = secretKey(config);
    if (!key) throw new Error('access_not_configured');
    return new SignJWT({ email: email.trim().toLowerCase(), type: 'localization' })
        .setProtectedHeader({ alg: 'HS256' })
        .setSubject(email.trim().toLowerCase())
        .setIssuer(SESSION_ISSUER).setAudience(SESSION_AUDIENCE)
        .setIssuedAt().setExpirationTime(`${SESSION_SECONDS}s`).sign(key);
}

export function createLocalizationAccess(config: LocalizationAccessConfig): RequestHandler {
    return async (req, res, next) => {
        const key = secretKey(config);
        if (!key) {
            res.status(503).json({ code: 'access_not_configured' });
            return;
        }
        const token = req.cookies?.[LOCALIZATION_COOKIE];
        if (typeof token !== 'string') {
            res.status(401).json({ code: 'access_required' });
            return;
        }
        try {
            const { payload } = await jwtVerify(token, key, {
                algorithms: ['HS256'], issuer: SESSION_ISSUER, audience: SESSION_AUDIENCE,
                requiredClaims: ['exp', 'iat', 'sub', 'email'],
            });
            if (payload.type !== 'localization' || typeof payload.email !== 'string'
                || payload.sub !== payload.email || !isLocalizationEmailAllowed(payload.email, config)) {
                throw new Error('access_required');
            }
            res.locals.localizationEmail = payload.email;
            next();
        } catch {
            res.status(401).json({ code: 'access_required' });
        }
    };
}

export const requireSameOrigin: RequestHandler = (req, res, next) => {
    const origin = req.get('Origin');
    const host = req.get('Host');
    try {
        const expectedProtocol = (req.get('X-Forwarded-Proto')?.split(',')[0].trim() || req.protocol) + ':';
        const parsedOrigin = new URL(origin!);
        if (!origin || !host || parsedOrigin.host !== host || parsedOrigin.protocol !== expectedProtocol) throw new Error('csrf');
        next();
    } catch {
        res.status(403).json({ code: 'invalid_origin' });
    }
};

export const localizationCookieOptions = {
    httpOnly: true, secure: true, sameSite: 'strict' as const,
    path: '/localization', maxAge: SESSION_SECONDS * 1000,
};
