import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import express from 'express';
import cookieParser from 'cookie-parser';
import { createLocalJWKSet, exportJWK, generateKeyPair, SignJWT } from 'jose';
import { createLocalizationRouter } from '../src/routes/localization.routes.ts';
import { verifyToken } from '../src/utils/verifyUser.ts';

test('localization uses verified Google identities and a revocable private session', async t => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'floralia-localization-'));
    const clientDirectory = path.join(root, 'client', 'dist');
    const webglDirectory = path.join(root, 'private', 'webgl');
    await mkdir(clientDirectory, { recursive: true });
    await mkdir(webglDirectory, { recursive: true });
    await writeFile(path.join(clientDirectory, 'index.html'), '<main>portal fixture</main>');
    await writeFile(path.join(webglDirectory, 'index.html'), '<main>webgl fixture</main>');
    await writeFile(path.join(webglDirectory, 'game.wasm.br'), 'compressed fixture');
    await writeFile(path.join(root, 'private', 'outside.txt'), 'private outside fixture');

    const projectId = 'test-firebase-project';
    const issuer = `https://securetoken.google.com/${projectId}`;
    const keyPair = await generateKeyPair('RS256');
    const jwk = { ...await exportJWK(keyPair.publicKey), kid: 'firebase-test-key', alg: 'RS256' };
    const keys = createLocalJWKSet({ keys: [jwk] });
    let allowedEmails = 'tester@example.test, second@example.test';
    const config = {
        clientDirectory, webglDirectory, firebaseProjectId: projectId,
        jwtSecret: 'localization-session-test-secret', allowedEmails: () => allowedEmails,
    };
    const app = express();
    app.use(express.json());
    app.use(cookieParser());
    app.use('/localization', createLocalizationRouter(config, keys));
    app.use('/other', createLocalizationRouter({ ...config, jwtSecret: 'different-secret' }, keys));
    app.use('/unconfigured', createLocalizationRouter({ clientDirectory, firebaseProjectId: projectId,
        allowedEmails: () => allowedEmails }, keys));
    let adminHandlerCalls = 0;
    app.get('/admin-probe', verifyToken, (_req, res) => {
        adminHandlerCalls += 1;
        res.sendStatus(204);
    });
    app.get('*', (_req, res) => { res.send('public fixture'); });
    app.use((error: { statusCode?: string }, _req: express.Request, res: express.Response,
        _next: express.NextFunction) => {
        res.status(Number(error.statusCode) || 500).json({ code: 'request_failed' });
    });
    const server = app.listen(0, '127.0.0.1');
    await new Promise<void>(resolve => server.once('listening', resolve));
    const address = server.address();
    assert(address && typeof address !== 'string');
    const origin = `http://127.0.0.1:${address.port}`;
    const now = Math.floor(Date.now() / 1000);
    const token = (claims: Record<string, unknown> = {}, audience = projectId, tokenIssuer = issuer,
        expiration: number | string = '10m', signingKey = keyPair.privateKey,
        subject = 'firebase-user', issuedAt = now) => new SignJWT({
            email: 'tester@example.test', email_verified: true,
            firebase: { sign_in_provider: 'google.com' }, auth_time: now, ...claims,
        }).setProtectedHeader({ alg: 'RS256', kid: 'firebase-test-key' })
        .setSubject(subject).setIssuedAt(issuedAt).setIssuer(tokenIssuer).setAudience(audience)
        .setExpirationTime(expiration).sign(signingKey);
    const request = (route: string, init: RequestInit = {}) => fetch(origin + route, { redirect: 'manual', ...init });
    const login = async (idToken: string, requestOrigin = origin) => request('/localization/api/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json', Origin: requestOrigin },
        body: JSON.stringify({ idToken }),
    });
    const cookieFrom = (response: Response) => {
        const value = response.headers.get('set-cookie');
        assert(value);
        return value.split(';', 1)[0];
    };

    try {
        await t.test('only the login shell is public', async () => {
            const page = await request('/localization');
            assert.equal(page.status, 200);
            assert.match(await page.text(), /portal fixture/);
            for (const route of ['/api/session', '/play/index.html', '/play/game.wasm.br', '/unknown.js']) {
                const response = await request('/localization' + route);
                assert.equal(response.status, 401, route);
                assert.equal(response.headers.get('cache-control'), 'private, no-store');
            }
        });

        await t.test('rejects forged, expired, wrong-project, unverified and non-Google tokens', async () => {
            const otherKeys = await generateKeyPair('RS256');
            const invalidTokens = [
                'forged',
                await token({}, 'wrong-project'),
                await token({}, projectId, 'https://securetoken.google.com/wrong-project'),
                await token({}, projectId, issuer, 1),
                await token({ email_verified: false }),
                await token({ firebase: { sign_in_provider: 'password' } }),
                await token({ auth_time: now + 3600 }),
                await token({}, projectId, issuer, '10m', keyPair.privateKey, 'firebase-user', now + 3600),
                await token({}, projectId, issuer, '10m', keyPair.privateKey, 'x'.repeat(129)),
                await token({ auth_time: undefined }),
                await token({ email: '' }),
                await token({}, projectId, issuer, '10m', otherKeys.privateKey),
            ];
            for (const invalid of invalidTokens) assert.equal((await login(invalid)).status, 401);
            assert.equal((await login(await token({ email: 'outsider@example.test' }))).status, 403);
        });

        await t.test('same-origin login creates a scoped secure 24-hour session', async () => {
            assert.equal((await login(await token(), 'https://attacker.example')).status, 403);
            assert.equal((await login(await token(), origin.replace('http:', 'https:'))).status, 403);
            assert.equal((await request('/localization/api/login', { method: 'POST' })).status, 403);
            const response = await login(await token());
            assert.equal(response.status, 204);
            const setCookie = response.headers.get('set-cookie')!;
            assert.match(setCookie, /^localization_session=/);
            assert.match(setCookie, /Max-Age=86400/i);
            assert.match(setCookie, /Path=\/localization/i);
            assert.match(setCookie, /HttpOnly/i);
            assert.match(setCookie, /Secure/i);
            assert.match(setCookie, /SameSite=Strict/i);
        });

        await t.test('valid sessions protect metadata and private WebGL files', async () => {
            const cookie = cookieFrom(await login(await token()));
            const headers = { Cookie: cookie };
            const metadata = await request('/localization/api/session', { headers });
            assert.deepEqual(await metadata.json(), { email: 'tester@example.test', webglAvailable: true });
            const game = await request('/localization/play/index.html', { headers });
            assert.equal(game.status, 200);
            assert.match(await game.text(), /webgl fixture/);
            const asset = await request('/localization/play/game.wasm.br', { headers });
            assert.equal(asset.status, 200);
            assert.equal(asset.headers.get('content-encoding'), 'br');
            assert.equal(asset.headers.get('content-type'), 'application/wasm');
            await asset.body?.cancel();
        });

        await t.test('tampering, cross-secret replay and whitelist removal revoke a session', async () => {
            const cookie = cookieFrom(await login(await token()));
            const [name, value] = cookie.split('=');
            const tampered = `${name}=${value.slice(0, -2)}xx`;
            assert.equal((await request('/localization/api/session', { headers: { Cookie: tampered } })).status, 401);
            assert.equal((await request('/other/api/session', { headers: { Cookie: cookie } })).status, 401);
            allowedEmails = 'second@example.test';
            assert.equal((await request('/localization/api/session', { headers: { Cookie: cookie } })).status, 401);
            allowedEmails = 'tester@example.test, second@example.test';
        });

        await t.test('a localization session cannot authorize an admin route', async () => {
            const cookie = cookieFrom(await login(await token()));
            const session = cookie.slice(cookie.indexOf('=') + 1);
            const response = await request('/admin-probe', { headers: { Cookie: `access_token=${session}` } });
            assert.equal(response.status, 401);
            assert.equal(adminHandlerCalls, 0);
        });

        await t.test('logout requires same origin and clears the scoped cookie', async () => {
            assert.equal((await request('/localization/api/logout', {
                method: 'POST', headers: { Origin: 'https://attacker.example' },
            })).status, 403);
            const response = await request('/localization/api/logout', { method: 'POST', headers: { Origin: origin } });
            assert.equal(response.status, 204);
            assert.match(response.headers.get('set-cookie')!, /^localization_session=;/);
            assert.match(response.headers.get('set-cookie')!, /Path=\/localization/i);
        });

        await t.test('storage traversal and unsafe build locations remain unavailable', async () => {
            const cookie = cookieFrom(await login(await token()));
            const response = await request('/localization/play/%2e%2e%2foutside.txt', { headers: { Cookie: cookie } });
            assert.notEqual(response.status, 200);
            assert.doesNotMatch(await response.text(), /private outside fixture/);
            assert.throws(() => createLocalizationRouter({ ...config, webglDirectory: path.join(clientDirectory, 'webgl') }), /outside/);
            assert.throws(() => createLocalizationRouter({ ...config, webglDirectory: path.join(root, 'client', 'public', 'webgl') }), /outside/);
            assert.throws(() => createLocalizationRouter({ ...config, webglDirectory: 'relative/webgl' }), /absolute/);
        });

        await t.test('missing session signing configuration fails closed', async () => {
            assert.equal((await request('/unconfigured/api/session')).status, 503);
            assert.equal((await request('/unconfigured/api/login', {
                method: 'POST', headers: { 'Content-Type': 'application/json', Origin: origin },
                body: JSON.stringify({ idToken: await token() }),
            })).status, 503);
        });
    } finally {
        await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
        await rm(root, { recursive: true, force: true });
    }
});
