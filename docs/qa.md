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
- the public receipt export is available
- Romanian/English presentation mode works
- the guided Law 544 scenario reaches resolution
- the tamper demo rejects an edited export
- the public page does not render obvious demo PII patterns

## Screenshot Guidance

Use screenshots as product evidence, not implementation proof. A useful public
demo set is:

- public explorer with several seeded requests visible
- selected request detail plus machinery graph
- signed audit trail for a resolved request
- response hash verifier with a final response hash visible
- Romanian mode on a narrow/mobile viewport

Keep screenshots free of browser extensions, local file paths, terminal panes,
and any real citizen data.
