# Demo Capture Guide

Use this guide when recording a short walkthrough, README GIF, or screenshots
for the public demo.

## Automated Capture Pack

Generate the standard screenshot pack from a production build:

```bash
pnpm demo:capture
```

The command builds the app, starts a local Vite preview server, opens Chromium,
captures the demo frames, and writes PNGs to `artifacts/demo-captures/`.

Generated frames:

- `01-public-explorer-desktop.png`: initial public dashboard with seeded cases.
- `02-resolved-request-desktop.png`: guided Law 544 request after resolution.
- `03-proof-report-ready-desktop.png`: public proof report export control ready.
- `04-romanian-mobile.png`: Romanian presentation mode on a narrow viewport.
- `05-ultrawide-centered-layout.png`: centered 1920px layout on an ultrawide
  viewport.

To capture an already-running deployment or preview, set:

```bash
CAPTURE_START_SERVER=0 CAPTURE_BASE_URL=https://digital.cristian-nichifor.com/bureaucracy-as-code/ pnpm demo:capture
```

## Recommended Storyboard

1. Start on the public explorer and show that multiple anonymized Law 544
   requests are already visible.
2. Select the Ministry of Environment extension scenario to show legal
   deadlines and non-final states.
3. Select the overdue cadastral-data scenario to show accountability when a file
   misses the 30-day window.
4. Run the guided request from submission through resolution.
5. Export the public audit receipt and show the schema, summary, privacy block,
   verification steps, and evidence sequence.
6. End on the response hash verifier, explaining that the document itself stays
   off-ledger while its hash can be checked locally.

## Capture Checklist

- Use English for the technical walkthrough and Romanian for the civic/public
  stakeholder version.
- Capture at least one desktop viewport and one mobile/narrow viewport.
- Keep the address bar visible only when showing the deployment URL.
- Do not include terminals, account menus, extension toolbars, or real files.
- Use seeded demo data or the browser-generated request only.

## Suggested Assets

- `01-public-explorer-desktop.png`: seeded feed with filters visible.
- `02-resolved-request-desktop.png`: resolved request with signed events.
- `03-proof-report-ready-desktop.png`: proof report export path visible.
- `04-romanian-mobile.png`: Romanian mode on a narrow viewport.
- `05-ultrawide-centered-layout.png`: large-screen layout bound to 1920px.
