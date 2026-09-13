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

## Standalone Pages project

Create a Cloudflare Pages project named:

```txt
bureaucracy-as-code
```

Build settings:

```txt
Framework preset: Vite
Build command: pnpm build
Build output directory: dist
Root directory: /
Node version: 22
```

Wrangler config is intentionally minimal:

```txt
wrangler.toml
name = "bureaucracy-as-code"
pages_build_output_dir = "dist"
```

No GitHub Actions deploy workflow is included. Use Cloudflare Pages Git
integration or run a manual deploy later when credentials and routing are
ready.

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

## Local verification

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm preview
```

Open the preview URL and check the page at `/bureaucracy-as-code/`.
