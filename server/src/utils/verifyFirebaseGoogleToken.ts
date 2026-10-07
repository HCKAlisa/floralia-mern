import { createRemoteJWKSet, jwtVerify } from 'jose';
import type { JWTVerifyGetKey, JWTPayload } from 'jose';

const FIREBASE_KEYS = createRemoteJWKSet(new URL(
    'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com',
));

export interface FirebaseGoogleIdentity {
    subject: string;
    email: string;
}

export async function verifyFirebaseGoogleToken(
    idToken: unknown,
    projectId = process.env.FIREBASE_PROJECT_ID || 'mern-web-a3109',
    keys: JWTVerifyGetKey = FIREBASE_KEYS,
): Promise<FirebaseGoogleIdentity> {
    if (typeof idToken !== 'string' || !idToken) throw new Error('invalid_token');
    const issuer = `https://securetoken.google.com/${projectId}`;
    const { payload } = await jwtVerify(idToken, keys, {
        algorithms: ['RS256'], audience: projectId, issuer,
        requiredClaims: ['exp', 'iat', 'auth_time', 'sub', 'email', 'email_verified', 'firebase'],
    });
    validateClaims(payload);
    return { subject: payload.sub!, email: (payload.email as string).trim().toLowerCase() };
}

function validateClaims(payload: JWTPayload): void {
    const now = Math.floor(Date.now() / 1000);
    if (typeof payload.sub !== 'string' || !payload.sub || payload.sub.length > 128) throw new Error('invalid_token');
    if (typeof payload.iat !== 'number' || payload.iat > now) throw new Error('invalid_token');
    if (typeof payload.auth_time !== 'number' || payload.auth_time > now) throw new Error('invalid_token');
    if (typeof payload.email !== 'string' || !payload.email.trim()) throw new Error('invalid_token');
    if (payload.email_verified !== true) throw new Error('invalid_token');
    const firebase = payload.firebase;
    if (!firebase || typeof firebase !== 'object'
        || (firebase as Record<string, unknown>).sign_in_provider !== 'google.com') throw new Error('invalid_token');
}
