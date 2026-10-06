# Localization portal deployment

The localization portal uses Cloudflare Access email-code login. The existing
admin login is not involved. Express validates the signed Access application
token before serving the page, session metadata, WebGL files.
Missing Cloudflare configuration denies access; there is no development bypass.

## Cloudflare

1. Finish the Cloudflare Zero Trust Free setup. The free plan currently supports
   up to 50 users. Review any checkout terms yourself before confirming.
2. Add `floraliagames.com` to your Cloudflare account. Before changing nameservers
   at GoDaddy, export the existing DNS zone and preserve all website and email
   records, including MX, SPF, DKIM, and DMARC. Keep the domain registration at
   GoDaddy and the website hosted on Render.
3. Configure proxied Render DNS records using Render's custom-domain instructions.
   The existing canonical website is `www.floraliagames.com`; the apex redirects
   there. Check HTTPS and the existing public site after the DNS change.
4. Create a self-hosted Access application covering the localization path on
   `www.floraliagames.com`, including `/localization` and all its descendants.
   Include the apex localization path if it can serve content instead of redirecting.
5. Enable One-time PIN as its login method. Leave the application with no Allow
   policies until localizer emails are ready. Do not add an Everyone policy or
   allow every user of the One-time PIN login method.
6. When ready, add one Allow policy containing the exact approved email addresses.
   Use a one-day session duration. All build paths belong to the same application.
7. Copy the team's `https://<team>.cloudflareaccess.com` URL and this application's
   AUD tag into the Render settings described below. These are configuration
   identifiers, not API tokens. No Cloudflare API key is required by the server.

## Render

Use Node.js 22 or another supported Node.js version compatible with `jose` 6
(Node.js 20 or newer). Deploy this repository with the existing build and start
commands. Set the variables from `server/.env.localization.example` in Render's
environment settings; do not put secrets or account settings into client code.

- `CLOUDFLARE_ACCESS_TEAM_DOMAIN`: the exact Cloudflare team URL.
- `CLOUDFLARE_ACCESS_AUD`: the localization application's audience tag.
- `LOCALIZATION_WEBGL_DIR`: absolute path to the uploaded Unity WebGL directory.

Store game builds in private storage outside `client/public` and `client/dist`.
For a persistent Render disk mounted at `/var/data`, a suitable build directory is
`/var/data/localization/webgl`. Confirm the service's
disk plan and upload process before provisioning paid storage. Render's normal
filesystem is ephemeral, so an upload there can disappear during a deployment.
The repository's `.private/` folder is ignored and only stages the local build;
it is not automatically uploaded or deployed to Render.

All game files are served through `/localization/play/` after token verification.
The public `onrender.com` address cannot serve protected content without a valid
signed application token.

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
Keep the JSON behind the same Access protection as the player.

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
- An approved address receives its email code and can play the game in the browser.
- Direct WebGL URLs require the same login.
- Direct requests to `floralia-mern.onrender.com/localization` without a token fail.
- Missing or expired tokens fail, and responses do not use public caching.
- With no uploaded WebGL build, the page shows the unavailable-build state.
- Without a configured build, `/localization/play/` and its assets return 404.

Cloudflare Access controls who obtains the build; it does not prevent an approved
tester from saving or redistributing downloaded game files.

References: [Access email codes](https://developers.cloudflare.com/cloudflare-one/integrations/identity-providers/one-time-pin/),
[Access token verification](https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/authorization-cookie/validating-json/),
[Render Cloudflare DNS](https://render.com/docs/configure-cloudflare-dns),
[Render persistent disks](https://render.com/docs/disks).
