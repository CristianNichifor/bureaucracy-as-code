# Cloudflare Pages

This repo is a static Vite app intended to live under:

```txt
https://digital.cristian-nichifor.com/bureaucracy-as-code
```

## Deployment model

Cloudflare Pages custom domains attach at the hostname level, not to a
subpath of an existing hostname. The final v3 target therefore needs one of
these shapes:

- preferred: the future `apps/digital` Pages app mounts this static build at
  `/bureaucracy-as-code`
- temporary: this standalone repo deploys to its own Pages preview URL or
  temporary hostname until workspace intake

The app already sets the Vite public base to `/bureaucracy-as-code/` in
`vite.config.ts`, so copied assets resolve correctly once the build output is
served from that path.

This repository is deployable in two modes:

| Mode | URL shape | Build base | Owner |
| --- | --- | --- | --- |
| Standalone preview/production | `https://bureaucracy-as-code.pages.dev/` | `/` | this repo |
| Mounted digital workspace | `https://digital.cristian-nichifor.com/bureaucracy-as-code/` | `/bureaucracy-as-code/` | future `apps/digital` host |

## Standalone Pages project

The project lives on the **CN Webify** Cloudflare account, `432316a05c0d6000c6e196fe32e47dd7`.
That is not an arbitrary choice: the `cristian-nichifor.com` zone is managed there, and a Pages
project can only attach a custom domain from a zone in its own account. Deploying anywhere else
would mean the eventual `digital.cristian-nichifor.com` mount could never point here.

Create it once, from a shell that has the token (see below):

```bash
wrangler pages project create bureaucracy-as-code --production-branch main
```

Name and build output directory come from `wrangler.toml`, so the deploy command needs neither:

```toml
name = "bureaucracy-as-code"
pages_build_output_dir = "dist"
```

Until `apps/digital` exists, the site answers on `bureaucracy-as-code.pages.dev`, and the
repository `homepage` should point there. No custom domain is attached at this stage, so no DNS
record and no zone change is involved.

The standalone deploy builds with `VITE_APP_BASE=/`. The default base is `/bureaucracy-as-code/`,
which is correct for the mounted build and wrong here — served from the root of a `pages.dev`
host it would ask for `/bureaucracy-as-code/assets/...` and get a 404 for every one of them.

`public/_redirects` contains the standalone SPA fallback:

```txt
/* /index.html 200
```

It also documents the future mounted fallback, but that rule only takes effect
when it is copied into the root `_redirects` file of the `apps/digital` Pages
project.

## Credentials

The API token lives in 1Password under the CN Webify account. It needs one scope:

```txt
Account · Cloudflare Pages · Edit
```

`wrangler login`'s OAuth scope is not enough for project creation, and the Cloudflare MCP
connection is read-only.

The token is never pasted into a shell for routine work. It is stored as repository secrets and
used only by CI:

```txt
CLOUDFLARE_API_TOKEN     the scoped token
CLOUDFLARE_ACCOUNT_ID    432316a05c0d6000c6e196fe32e47dd7
```

```bash
gh secret set CLOUDFLARE_API_TOKEN --repo CristianNichifor/bureaucracy-as-code
gh secret set CLOUDFLARE_ACCOUNT_ID --repo CristianNichifor/bureaucracy-as-code
```

## Deploy workflow

`.github/workflows/deploy.yml` builds and deploys on every push to `main`, and deploys a preview
for each pull request raised from this repository. Pull requests from forks are skipped rather
than failed: secrets are not available to them, so the deploy step could not succeed. They still
get the full CI workflow.

Deployment is wired in the repository, not clicked together in the dashboard — the same rule the
rest of this fleet's infrastructure follows. Cloudflare's Pages Git integration is deliberately
not used; it would put the build configuration somewhere that is not this repository.

The workflow currently deploys a static Pages site only. No Pages Functions are
required for the demo. If a future phase adds Functions, keep the public
dashboard static and use Functions only for explicit server-side edges such as
preview health probes, signed API ingress, or external ledger anchoring.

## Digital host integration

When `apps/digital` exists, its build should copy this app's production output
under the digital app's Pages output directory:

```txt
<digital-output>/
  bureaucracy-as-code/
    index.html
    assets/
```

The digital app should then handle SPA fallback for the route:

```txt
/bureaucracy-as-code/* -> /bureaucracy-as-code/index.html
```

Required parent-host checklist:

- build this repo without overriding `VITE_APP_BASE`
- copy `dist/*` into `<digital-output>/bureaucracy-as-code/`
- add `/bureaucracy-as-code/* /bureaucracy-as-code/index.html 200` to the parent root `_redirects`
- keep the headers in `public/_headers`, or merge equivalent rules into the parent root `_headers`
- smoke-test `/bureaucracy-as-code/`, `/bureaucracy-as-code/assets/*`, and one deep SPA path

Do not attach `digital.cristian-nichifor.com/bureaucracy-as-code` as a custom
domain to this standalone Pages project. Cloudflare custom domains are
hostname-level bindings; the path belongs to the digital host.

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
