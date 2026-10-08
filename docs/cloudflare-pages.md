# Cloudflare Pages

This repo is a static Vite app served, mounted into the projects hub, at:

```txt
https://projects.cristian-nichifor.com/bureaucracy-as-code/
```

## Deployment model

The hub (`digital-public-administration-lab`) copies this repo's build into its
own output at `/bureaucracy-as-code/` at build time; Cloudflare custom domains
attach at the hostname level, so the path belongs to the hub. This repo also
deploys its own Pages project, which the deploy smoke test and previews use.

| Mode | URL shape | Build base | Owner |
| --- | --- | --- | --- |
| Standalone production and previews | `https://bureaucracy-as-code-<random>.pages.dev/` | `/` | this repo |
| Mounted in the hub | `https://projects.cristian-nichifor.com/bureaucracy-as-code/` | `/bureaucracy-as-code/` | `digital-public-administration-lab` |

The app sets the Vite public base to `/bureaucracy-as-code/` in `vite.config.ts`, so copied assets
resolve once the build is served from that path.

## Standalone Pages project

The project lives on the **CN Webify Customers** Cloudflare account,
`5d5a0c8a05e5d8292065cd0c0cf60291`, with the `cristian-nichifor.com` zone and the hub.

Create it once, from a shell that has the token (see below):

```bash
wrangler pages project create bureaucracy-as-code --production-branch main
```

Name and build output directory come from `wrangler.toml`, so the deploy command needs neither:

```toml
name = "bureaucracy-as-code"
pages_build_output_dir = "dist"
```

The plain `bureaucracy-as-code.pages.dev` name belongs to the old project in the CN Webify Core
account until that is deleted, so the new project gets a suffixed `pages.dev` host. Nobody links to
it; set it as the `DEPLOY_SMOKE_URL` repository variable so the deploy can smoke-test it. No custom
domain is attached to this project, so no DNS record and no zone change is involved.

The standalone deploy builds with `VITE_APP_BASE=/`. The default base is `/bureaucracy-as-code/`,
which is correct for the mounted build and wrong here — served from the root of a `pages.dev`
host it would ask for `/bureaucracy-as-code/assets/...` and get a 404 for every one of them.

`public/_redirects` contains the standalone SPA fallback:

```txt
/* /index.html 200
```

It also documents the mounted fallback, but that rule only takes effect when it
is copied into the hub's root `_redirects` file.

## Credentials

The API token is a CN Webify Customers account token, kept in 1Password. It needs one scope:

```txt
Account · Cloudflare Pages · Edit
```

`wrangler login`'s OAuth scope is not enough for project creation, and the Cloudflare MCP
connection is read-only.

The token is never pasted into a shell for routine work. It is stored as repository secrets and
used only by CI:

```txt
CLOUDFLARE_API_TOKEN     the scoped token
CLOUDFLARE_ACCOUNT_ID    5d5a0c8a05e5d8292065cd0c0cf60291
```

```bash
gh secret set CLOUDFLARE_API_TOKEN --repo CristianNichifor/bureaucracy-as-code
gh secret set CLOUDFLARE_ACCOUNT_ID --repo CristianNichifor/bureaucracy-as-code
gh variable set DEPLOY_SMOKE_URL --repo CristianNichifor/bureaucracy-as-code --body https://bureaucracy-as-code-<random>.pages.dev/
```

Without `DEPLOY_SMOKE_URL` the workflow still deploys and warns that it did not smoke-test.

## Deploy workflow

`.github/workflows/deploy.yml` builds and deploys on every push to `main`, and deploys a preview
for each pull request raised from this repository. Pull requests from forks are skipped rather
than failed: secrets are not available to them, so the deploy step could not succeed. They still
get the full CI workflow.

Deployment is wired in the repository, not clicked together in the dashboard — the same rule the
rest of this fleet's infrastructure follows. Cloudflare's Pages Git integration is deliberately
not used; it would put the build configuration somewhere that is not this repository.

The workflow deploys the Vite app together with the lightweight Pages Functions
scaffold under `functions/`. The public dashboard remains static; Functions are
reserved for server-side edges:

- `/api/health` for preview and production smoke checks
- `/api/transitions` for signed Law 544 transition ingress
- `/api/requests` and `/api/requests/:requestId` for public read projections

The Functions runtime is binding-aware. Without Cloudflare data bindings it uses
in-memory demo state; with `REQUESTS_DB`, `LEDGER_EVENTS_KV`, and optionally
`NONCES_KV`, it can switch to durable D1/KV persistence. This is optional for
the browser-only demo. See
`docs/cloudflare-persistence.md`.

Public read endpoints:

- `GET /api/health`
- `GET /api/requests`
- `GET /api/requests/:requestId`
- `GET /api/ledger/anchor`
- `GET /api/ledger/anchor?requestId=<id>`
- `GET /api/metrics`

## Hub integration

The hub's build copies this app's production output under its Pages output directory:

```txt
<hub-output>/
  bureaucracy-as-code/
    index.html
    assets/
```

The hub then handles SPA fallback for the route:

```txt
/bureaucracy-as-code/* -> /bureaucracy-as-code/index.html
```

Required parent-host checklist:

- build this repo without overriding `VITE_APP_BASE`
- copy `dist/*` into `<hub-output>/bureaucracy-as-code/`
- add `/bureaucracy-as-code/* /bureaucracy-as-code/index.html 200` to the parent root `_redirects`
- keep the headers in `public/_headers`, or merge equivalent rules into the parent root `_headers`
- smoke-test `/bureaucracy-as-code/`, `/bureaucracy-as-code/assets/*`, and one deep SPA path

Do not attach `projects.cristian-nichifor.com/bureaucracy-as-code` as a custom
domain to this standalone Pages project. Cloudflare custom domains are
hostname-level bindings; the path belongs to the hub.

## Local verification

```bash
pnpm install
pnpm verify
pnpm preview
```

Open the preview URL and check the page at `/bureaucracy-as-code/`.

For a standalone Pages-equivalent local run, build with the root base:

```bash
VITE_APP_BASE=/ pnpm build
pnpm preview
```
