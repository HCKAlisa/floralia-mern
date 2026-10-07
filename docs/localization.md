# Localization portal deployment

The localization portal uses the existing Firebase project's Google sign-in.
Express verifies the Firebase ID token and the exact server-side email whitelist,
then issues a separate 24-hour localization session. Admin sessions do not grant
localization access. The login shell is public; session metadata and every WebGL
file require a valid localization session and current whitelist membership.
Missing configuration denies protected access; there is no development bypass.

## Cloudflare transition

Keep Cloudflare DNS and the existing Render hosting. Keep the localization
Access gate during deployment until Google login and private game loading pass.
Then remove only the localization Access application; preserve Ace Dispatch's
application, shared organization settings, and website DNS records.

## Firebase

Enable the existing Google sign-in provider and authorize the canonical domain
`www.floraliagames.com` and apex `floraliagames.com` in Firebase Authentication.
No service-account credentials are required for public-key ID-token validation.
The server verifies project issuer/audience, signature, expiry, verified email,
and the Google sign-in provider. The admin Google endpoint also verifies tokens
and still requires an existing admin account.

## Render

Use Node.js 22 or another supported Node.js version compatible with `jose` 6
(Node.js 20 or newer). Deploy this repository with the existing build and start
commands. Set the variables from `server/.env.localization.example` in Render's
environment settings; do not put secrets or account settings into client code.

- `FIREBASE_PROJECT_ID`: existing Firebase project ID (defaults to `mern-web-a3109`).
- `JWT_SECRET`: existing server secret used to sign sessions.
- `LOCALIZATION_ALLOWED_EMAILS`: comma-separated exact approved addresses. Keep
  the real list in Render configuration, not in client code or the repository.
- `LOCALIZATION_WEBGL_DIR`: absolute path to the uploaded Unity WebGL directory.

Store game builds in private storage outside `client/public` and `client/dist`.
For a persistent Render disk mounted at `/var/data`, a suitable build directory is
`/var/data/localization/webgl`. Confirm the service's
disk plan and upload process before provisioning paid storage. Render's normal
filesystem is ephemeral, so an upload there can disappear during a deployment.
The repository's `.private/` folder is ignored and only stages the local build;
it is not automatically uploaded or deployed to Render.

All game files are served through `/localization/play/` after session verification.
The public `onrender.com` address can serve the login shell but cannot serve
session metadata or game files without a valid whitelisted session.

## WebGL upload

Upload Unity's complete WebGL output, including `index.html`, `Build/`,
`TemplateData/`, and `StreamingAssets/` when present. Preserve the directory layout.
Set `LOCALIZATION_WEBGL_DIR` to the directory containing `index.html`.
The page embeds the WebGL player when that file is present.
The server supports compressed Brotli/gzip assets with the required MIME and
Content-Encoding headers. All requests remain authenticated with private caching.
Validate browser loading, audio, fonts, language switching, and UI before inviting
localizers. The local Unity WebGL player has loaded in desktop Edge and opened the phone and Flowerdex after language switches. Deployment, email verification, audio, other browsers, and complete screen coverage still require validation.

## Manual translation updates

Refresh translations only when Kirby requests it. Do not poll or automatically
read the private sheets. Export the current language sheets as XLSX files, then
run the local BloomTale importer:

```powershell
& 'C:\Users\kirby\BloomTale-Alpha\.codex\localizer-refresh\import.ps1' -Exports '<export folder>'
```

Review `report.json` under `.codex/localizer-refresh/current` for missing entries
and changed English source text. The importer writes `manifest.json`; copy that
file to the build's `StreamingAssets/localizer-translations.json`. The wrapper
can perform this copy with `-PublishPath '<build>/StreamingAssets' -PublishBuild`.
Keep the JSON behind the same session protection as the player.

The player reads this snapshot when it starts. Translation changes and new keys
with English source text do not require recompiling WebGL; testers reload the
page after the file is replaced. Changed source text is skipped until the game's
source is updated. New UI screens or code still require a new Unity build.
Rebuilding the localizer scene also packages the current snapshot for Unity
Play Mode. These local tools and exports remain ignored by Git.

## Verification

Run `npm run test:localization --prefix server`, then build server and client.
Before inviting localizers, verify all of these against the deployed service:

- The homepage and admin routes still work.
- An unapproved address cannot enter the localization page.
- An approved Google account can sign in and play the game in the browser.
- Direct WebGL URLs require the same login.
- Direct origin session and game requests without a session fail.
- Missing or expired tokens fail, and responses do not use public caching.
- With no uploaded WebGL build, the page shows the unavailable-build state.
- Without a configured build, `/localization/play/` and its assets return 404.

The whitelist controls who obtains the build; it does not prevent an approved
tester from saving or redistributing downloaded game files.

References: [Firebase ID token verification](https://firebase.google.com/docs/auth/admin/verify-id-tokens),
[Google sign-in](https://firebase.google.com/docs/auth/web/google-signin),
[Render Cloudflare DNS](https://render.com/docs/configure-cloudflare-dns),
[Render persistent disks](https://render.com/docs/disks).
