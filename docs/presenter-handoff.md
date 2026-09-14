# Presenter Handoff

Use this as the short handoff for the completed browser-only demo.

## Demo Positioning

This is a static, browser-only civic demo for Law 544/2001 transparency. It
shows how public-information requests can become signed, trackable,
tamper-evident state changes without publishing personal data or raw documents.

## Run Before Presenting

```bash
pnpm install
pnpm demo:release
```

Review:

- `artifacts/demo-release/report.md`
- `artifacts/demo-release/report.json`
- `artifacts/demo-captures/*.png`

These files are generated locally and ignored by git.

## Five-minute Flow

1. Open the public explorer and show seeded anonymized Law 544 requests.
2. Show **Demo completeness** to set the browser-only scope.
3. Run the guided request from submission to resolution.
4. Open the accountability view: evidence brief, details, machinery graph, and
   signed audit trail.
5. Export the audit receipt and public proof report.
6. Use the response hash verifier to explain off-ledger documents.
7. Switch to Romanian mode and show the release readiness panel.

## What To Say

- Every bureaucratic action is a signed state transition.
- The ledger exposes public evidence: role, DID hash, credential hash, payload
  hash, state hashes, timestamp, and signature.
- Raw documents, personal data, and private signing keys stay out of the public
  ledger.
- Export/import demonstrates portability, but imported state cannot impersonate
  original actors for new transitions.
- The demo is complete without ROeID, external identity services, durable
  Cloudflare data resources, or legal sign-off.

## Do Not Claim

- This is not a production Law 544 platform.
- This is not ROeID integration.
- This is not legal validation, DPIA approval, procurement sign-off, or
  institutional approval.
- This does not process real citizen personal data.

## URLs

- Standalone Pages: `https://bureaucracy-as-code.pages.dev/`
- Digital mount: `https://digital.cristian-nichifor.com/bureaucracy-as-code/`

