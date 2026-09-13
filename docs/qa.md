# QA

Use the local verification script before opening a PR:

```bash
pnpm verify
```

That runs linting, type checking, the privacy fixture scan, unit tests, and the
production build.

Run the browser smoke suite separately:

```bash
pnpm verify:e2e
```

If Playwright browsers are not installed but a system Chromium is available,
point Playwright at it:

```bash
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/home/cristianvn/.local/bin/chromium pnpm verify:e2e
```

The e2e suite checks:

- the app loads at the Cloudflare Pages base path
- important landmarks and controls are present
- the guided Law 544 scenario reaches resolution
- the tamper demo rejects an edited export
- the public page does not render obvious demo PII patterns
