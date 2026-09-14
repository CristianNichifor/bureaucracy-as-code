# v0.1.0 Release Notes

`v0.1.0` is the first browser-only release candidate for the Romanian
bureaucracy-as-code demo.

## Release Goal

Show, from a static browser app, how Law 544/2001 public-information requests
can be represented as signed, trackable, tamper-evident administrative state
changes without putting personal data or raw documents on a public ledger.

## Release Checklist

- `pnpm install`
- `pnpm demo:release`
- Review `artifacts/demo-release/report.md`
- Review `artifacts/demo-captures/*.png`
- Confirm the Cloudflare Pages preview deploy is green on the release PR
- Confirm signed commits and required repository checks are green
- Create a signed `v0.1.0` tag only after the release PR is merged

## Demo URLs

- Standalone Pages: `https://bureaucracy-as-code.pages.dev/`
- Digital mount: `https://digital.cristian-nichifor.com/bureaucracy-as-code/`

## Acceptance

- The dashboard opens with seeded anonymized Law 544 requests.
- The guided request can run from submission to resolution.
- The machinery graph shows current responsibility.
- The signed audit trail exposes role, DID hash, credential hash, payload hash,
  previous state hash, current state hash, timestamp, and signature.
- The response verifier compares a local file hash with the recorded hash.
- Audit receipt and public proof report exports work.
- Romanian and English modes are usable on desktop and mobile.
- Offline refresh works after a successful online load.

## Non-goals

- ROeID integration.
- Real custom identity service integration.
- Durable Cloudflare D1/KV/R2 runtime dependencies.
- Legal validation, DPIA sign-off, procurement sign-off, or institutional
  approval.
- Real Law 544 personal data processing.
