# Cloudflare Pages

This repo is a static Vite app intended to live under:

```txt
https://digital.cristian-nichifor.com/bureaucracy-as-code
```

## Project

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

The app uses:

```txt
VITE_APP_BASE=/bureaucracy-as-code/
```

## GitHub Actions secrets

Add these repository secrets:

```txt
CLOUDFLARE_API_TOKEN
CLOUDFLARE_ACCOUNT_ID
```

The API token should be scoped to Cloudflare Pages edit/deploy permissions for the personal Cloudflare account.

## Custom domain

Final v3 target:

```txt
digital.cristian-nichifor.com/bureaucracy-as-code
```

If this standalone repo is deployed directly before `apps/digital` exists, use the Pages preview/custom domain as a temporary demo URL, then move the route under `apps/digital` during workspace intake.
