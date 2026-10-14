# Production Readiness Checklist

The current repository is a public browser demonstrator with optional
Cloudflare Pages Functions scaffolding. The codebase includes D1/KV adapter
boundaries, replay-protected transition ingestion, signed canonical envelopes,
public anchor reads, and basic operational metrics.

Before handling real requests or personal data, the following items still need
institutional, legal, or account-level decisions outside this repository.

## Open Items: Owner And Review Date

Every item below blocks real use, not the public demo. The owner decides or
commissions the work; the review date is when the item is next looked at, not a
delivery promise. Owners and dates were set on 2026-10-14 and need the
maintainer's confirmation.

| ID | Area | Open item | Owner | Review by | Blocks |
|---|---|---|---|---|---|
| PR-L1 | Legal | Formal Law 544/2001 workflow validation by Romanian public-law counsel ([caveat](law-544-legal-caveat.md)) | Cristian Nichifor (maintainer), to commission counsel | 2027-01-15 | Any use with real requests |
| PR-L2 | Legal | Record retention schedule, appeal and correction procedures | Cristian Nichifor (maintainer), with the onboarding institution | 2027-01-15 | Any use with real requests |
| PR-L3 | Legal | Institution onboarding agreement | Cristian Nichifor (maintainer) | 2027-01-15 | Any institutional pilot |
| PR-I1 | Identity | Real issuer governance for citizen, public-servant, director, registry-bot and institution credentials ([adapter](identity-adapter.md)) | Cristian Nichifor (maintainer), with the issuing institution | 2027-01-15 | Signatures with legal weight |
| PR-I2 | Identity | Custom DID/VC identity repository integration, revocation, key rotation and recovery | Cristian Nichifor (maintainer) | 2027-01-15 | Signatures with legal weight |
| PR-D1 | DPIA | Completed DPIA with sign-off ([notes](dpia-notes.md)) | Cristian Nichifor (maintainer), with a data protection officer | 2027-01-15 | Processing any personal data |
| PR-D2 | DPIA | Incident response and breach notification ownership | Cristian Nichifor (maintainer) | 2027-01-15 | Processing any personal data |
| PR-O1 | Operations | Durable Cloudflare data resources and binding IDs in the owner account | Cristian Nichifor (maintainer) | 2027-01-15 | Server-side persistence |

The browser-only demo needs none of these: it keeps everything in the reader's
browser and handles no real personal data (see the in-app privacy notice and
[privacy model](privacy-model.md)).

## Identity And Authorization

- Institution-controlled issuer model.
- Verifiable credential revocation.
- Key rotation and recovery.
- Role proof verification on every transition in the demo API.
- Separation between citizen, official, registry bot, and system identities.

## Ledger And Integrity

- External ledger or timestamp anchor.
- Signature verification during chain verification.
- Head-hash publication and monitoring.
- Event schema versioning and migration policy.
- Replay protection in browser/API demo paths.

## Privacy And Security

- Completed DPIA.
- Threat model reviewed by security and legal counsel.
- Strict public/private data contract.
- Encrypted off-chain storage with access logging.
- Incident response and breach notification process.
- CSP tightened after removing inline style needs.

## Implemented Demo Controls

- Signed canonical transition envelopes.
- Credential presentations checked against transition roles and institutions.
- Replay nonce checks for in-memory and Cloudflare KV runtimes.
- D1 request projection adapter.
- KV append-only ledger adapter.
- Public ledger anchor endpoint.
- Public aggregate metrics endpoint.
- Local migration SQL for request projections.

## Still External Or Legal

These cannot honestly be completed inside the repo alone:

- Formal Law 544/2001 workflow validation by Romanian public-law counsel.
- Real issuer governance for citizen, public-servant, director, registry-bot,
  and institution credentials.
- Real custom DID/VC identity repository integration, once that repo exists or
  is identified.
- Durable Cloudflare data resources and binding IDs in the owner account.
- DPIA sign-off, retention policy, appeal/correction procedures, and incident
  response ownership.

## Operations

- Uptime and backup plan.
- Disaster recovery testing.
- Observability for failed submissions and overdue cases.
- Accessibility testing (automated axe checks, including colour contrast in both themes, run in CI; a manual screen-reader pass is still open).
- Cross-browser testing.
- Change management and public changelog.

## Legal And Governance

- Formal Law 544/2001 workflow validation.
- Institution onboarding agreement.
- Record retention schedule.
- Appeal and correction processes.
- Open-source contribution governance.
- Public documentation for citizens.
