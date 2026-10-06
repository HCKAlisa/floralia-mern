import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import express from 'express';
import { createLocalJWKSet, exportJWK, generateKeyPair, SignJWT } from 'jose';
import { createLocalizationRouter } from '../src/routes/localization.routes.ts';

test('localization page and files require a valid Cloudflare application identity', async t => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'floralia-localization-'));
    const clientDirectory = path.join(root, 'client', 'dist');
    const webglDirectory = path.join(root, 'private', 'webgl');
    await mkdir(clientDirectory, { recursive: true });
    await mkdir(webglDirectory, { recursive: true });
    await writeFile(path.join(clientDirectory, 'index.html'), '<main>portal fixture</main>');
    await writeFile(path.join(webglDirectory, 'index.html'), '<main>webgl fixture</main>');
    await writeFile(path.join(webglDirectory, 'game.wasm.br'), 'compressed fixture');
    await writeFile(path.join(root, 'private', 'outside.txt'), 'private outside fixture');
    const keyPair = await generateKeyPair('RS256');
    const jwk = { ...await exportJWK(keyPair.publicKey), kid: 'test-key', alg: 'RS256' };
    const keys = createLocalJWKSet({ keys: [jwk] });
    const config = { clientDirectory, webglDirectory,
        teamDomain: 'https://localization-test.cloudflareaccess.com', audience: 'localization-test-audience' };
    const app = express();
    app.use('/localization', createLocalizationRouter(config, keys));
    app.use('/unconfigured', createLocalizationRouter({ clientDirectory }));
    app.use('/no-build', createLocalizationRouter({ clientDirectory, teamDomain: config.teamDomain, audience: config.audience }, keys));
    app.get('*', (_req, res) => { res.send('public fixture'); });
    const server = app.listen(0, '127.0.0.1');
    await new Promise<void>(resolve => server.once('listening', resolve));
    const address = server.address();
    assert(address && typeof address !== 'string');
    const origin = `http://127.0.0.1:${address.port}`;
    const token = (payload = { email: 'tester@example.test' }, audience = config.audience, issuer = config.teamDomain,
        expiration: number | string = '10m', signingKey = keyPair.privateKey) => new SignJWT(payload)
        .setProtectedHeader({ alg: 'RS256', kid: 'test-key' }).setSubject('test-identity')
        .setIssuedAt().setIssuer(issuer).setAudience(audience).setExpirationTime(expiration).sign(signingKey);
    const validToken = await token();
    const get = (url: string, jwt?: string) => fetch(origin + url, { redirect: 'manual',
        headers: jwt ? { 'Cf-Access-Jwt-Assertion': jwt } : {} });
    try {
        await t.test('public site works and an unconfigured portal fails closed', async () => {
            assert.equal((await get('/')).status, 200);
            assert.equal((await get('/unconfigured')).status, 503);
            assert.equal((await get('/unconfigured/play/index.html', validToken)).status, 503);
        });
        await t.test('page, session, WebGL and unknown paths cannot bypass authentication', async () => {
            for (const route of ['', '/api/session', '/play/index.html', '/play/game.wasm.br', '/unknown.js']) {
                const response = await get('/localization' + route);
                assert.equal(response.status, 403, route);
                assert.equal(response.headers.get('cache-control'), 'private, no-store');
            }
        });
        await t.test('rejects forged signatures, wrong issuer/audience, expired tokens and non-user tokens', async () => {
            const otherKeys = await generateKeyPair('RS256');
            const noExpiry = await new SignJWT({ email: 'tester@example.test' })
                .setProtectedHeader({ alg: 'RS256', kid: 'test-key' }).setSubject('test-identity')
                .setIssuedAt().setIssuer(config.teamDomain).setAudience(config.audience).sign(keyPair.privateKey);
            const serviceToken = await new SignJWT({ type: 'app' })
                .setProtectedHeader({ alg: 'RS256', kid: 'test-key' }).setSubject('service-identity')
                .setIssuedAt().setIssuer(config.teamDomain).setAudience(config.audience).setExpirationTime('10m').sign(keyPair.privateKey);
            for (const invalid of ['forged', await token({ email: 'tester@example.test' }, 'other'),
                await token({ email: 'tester@example.test' }, config.audience, 'https://other.cloudflareaccess.com'),
                await token({ email: 'tester@example.test' }, config.audience, config.teamDomain, 1),
                await token({ email: '' }), noExpiry, serviceToken,
                await token({ email: 'tester@example.test' }, config.audience, config.teamDomain, '10m', otherKeys.privateKey)]) {
                assert.equal((await get('/localization/play/index.html', invalid)).status, 403);
            }
        });
        await t.test('encoded traversal cannot return files outside the WebGL directory', async () => {
            const response = await get('/localization/play/%2e%2e%2foutside.txt', validToken);
            assert.notEqual(response.status, 200);
            assert.doesNotMatch(await response.text(), /private outside fixture/);
        });
        await t.test('valid identity gets private page, metadata and WebGL', async () => {
            const page = await get('/localization', validToken);
            assert.equal(page.status, 200);
            assert.match(await page.text(), /portal fixture/);
            assert.equal(page.headers.get('cache-control'), 'private, no-store');
            const metadata = await get('/localization/api/session', validToken);
            assert.deepEqual(await metadata.json(), { email: 'tester@example.test', webglAvailable: true });
            const game = await get('/localization/play/index.html', validToken);
            assert.equal(game.status, 200);
            assert.equal(game.headers.get('cache-control'), 'private, no-store');
            assert.match(await game.text(), /webgl fixture/);
        });
        await t.test('WebGL compression headers and private caching are correct', async () => {
            const asset = await get('/localization/play/game.wasm.br', validToken);
            assert.equal(asset.status, 200);
            assert.equal(asset.headers.get('content-encoding'), 'br');
            assert.equal(asset.headers.get('content-type'), 'application/wasm');
            assert.equal(asset.headers.get('cache-control'), 'private, no-store');
            // Do not decode this deliberately synthetic compressed fixture.
            await asset.body?.cancel();
            assert.equal((await get('/localization/play/missing.wasm', validToken)).status, 404);
        });
        await t.test('unuploaded WebGL stays unavailable', async () => {
            assert.equal((await get('/no-build/play/index.html', validToken)).status, 404);
            assert.deepEqual(await (await get('/no-build/api/session', validToken)).json(), {
                email: 'tester@example.test', webglAvailable: false });
            assert.equal((await get('/localization/unknown.js', validToken)).status, 404);
        });
        await t.test('rejects build storage inside public website folders', () => {
            assert.throws(() => createLocalizationRouter({ ...config, webglDirectory: path.join(clientDirectory, 'webgl') }), /outside/);
            assert.throws(() => createLocalizationRouter({ ...config, webglDirectory: path.join(root, 'client', 'public', 'webgl') }), /outside/);
            assert.throws(() => createLocalizationRouter({ ...config, webglDirectory: 'relative/webgl' }), /absolute/);
        });
    } finally {
        await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
        await rm(root, { recursive: true, force: true });
    }
});
