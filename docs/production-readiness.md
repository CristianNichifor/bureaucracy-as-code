# Production Readiness Checklist

The current repository is a public demonstrator with a browser runtime and a
Cloudflare Pages Functions runtime. The codebase includes durable D1/KV
adapters, replay-protected transition ingestion, signed canonical envelopes,
public anchor reads, and basic operational metrics.

Before handling real requests or personal data, the following items still need
institutional, legal, or account-level decisions outside this repository.

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
- Cloudflare resource creation and binding IDs in the owner account.
- DPIA sign-off, retention policy, appeal/correction procedures, and incident
  response ownership.

## Operations

- Uptime and backup plan.
- Disaster recovery testing.
- Observability for failed submissions and overdue cases.
- Accessibility testing.
- Cross-browser testing.
- Change management and public changelog.

## Legal And Governance

- Formal Law 544/2001 workflow validation.
- Institution onboarding agreement.
- Record retention schedule.
- Appeal and correction processes.
- Open-source contribution governance.
- Public documentation for citizens.
