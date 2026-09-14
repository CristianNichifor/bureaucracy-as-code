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

For a focused browser-only release gate, use:

```bash
pnpm demo:verify
```

That builds the Vite app and runs the Playwright demo suite against the local
preview server. It does not require Cloudflare, external identity services,
wallets, ROeID, secrets, or networked storage.

For Civic UI alignment and responsive layout checks, use:

```bash
pnpm ui:verify
```

That builds the app and runs the `@ui` Playwright viewport matrix at 320, 375,
768, 1024, 1440, and 1728px. The test checks key panels, body/root horizontal
overflow, and panel/graph/feed bounds. Screenshots are attached as Playwright
artifacts.

If Playwright browsers are not installed but a system Chromium is available,
point Playwright at it:

```bash
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/home/cristianvn/.local/bin/chromium pnpm verify:e2e
```

The e2e suite checks:

- the app loads at the Cloudflare Pages base path
- important landmarks and controls are present
- the public demo renders on desktop Chromium and a mobile Chromium viewport
- the Civic UI layout remains stable across the target viewport matrix
- the public receipt export is available
- Romanian/English presentation mode works
- the guided Law 544 scenario reaches resolution
- the signed audit trail shows the final `Request_Resolved` transition
- the local response verifier rejects an edited file and accepts the exact
  browser-generated final response bytes
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
