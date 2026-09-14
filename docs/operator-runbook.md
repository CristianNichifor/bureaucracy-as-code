# Operator Runbook

Use this runbook before a live browser-only demo.

## Local setup

```bash
pnpm install
pnpm dev
```

Open the local URL printed by Vite. The app is static and browser-local.

## Release check

Run the complete local release gate:

```bash
pnpm demo:release
```

Expected artifacts:

- `artifacts/demo-release/report.md`
- `artifacts/demo-release/report.json`
- `artifacts/demo-captures/*.png`

All artifact paths above are ignored by git and can be regenerated.

## Screenshot review

Review the generated capture pack before sharing the demo:

- `01-public-explorer-desktop.png`
- `02-resolved-request-desktop.png`
- `03-proof-report-ready-desktop.png`
- `04-romanian-mobile.png`
- `05-ultrawide-centered-layout.png`

## Browser walkthrough

1. Start on the public explorer.
2. Click **Run full scenario**.
3. Show request detail, machinery graph, audit trail, and ledger integrity.
4. Click **Export receipt**.
5. Click **Export proof report**.
6. Use the response hash verifier after a resolved request exists.
7. Switch language to **RO** for the Romanian civic walkthrough.

## Reset

Use **Reset** in the toolbar to clear the live guided request. Seeded public
requests stay available so the explorer still looks populated.

For a clean browser profile, clear site data for the local or deployed origin.

## Capture

```bash
pnpm demo:capture
```

Capture a running deployment instead of local preview:

```bash
CAPTURE_START_SERVER=0 CAPTURE_BASE_URL=https://digital.cristian-nichifor.com/bureaucracy-as-code/ pnpm demo:capture
```

## Deployment smoke

After Cloudflare Pages deploys, open:

```txt
https://digital.cristian-nichifor.com/bureaucracy-as-code/
```

Confirm:

- the app loads without authentication
- the release readiness panel shows build metadata
- the full guided scenario completes
- export receipt and proof report download JSON
- refresh works after one online load

## Release tag

After the final release PR is merged and `pnpm demo:release` passes on `main`,
create a signed `v0.1.0` tag. Do not tag an unmerged branch.
