# Changelog

## v0.1.0 - Browser-only demo candidate

- Browser-only Law 544/2001 public explorer.
- DID-like local demo identities and verifiable credential-shaped role claims.
- Signed state transitions for request creation, registry assignment, routing,
  processing, evidence attachment, extension, rejection, overdue marking, and
  resolution.
- Local append-only hash-chain ledger with import tamper refusal.
- IndexedDB-backed local document hashing and response verification.
- Public audit receipt export and receipt verifier.
- Public proof report export across visible requests.
- Seeded national-dashboard scenarios for resolved, registered, in-progress,
  extension, overdue, rejected, redirected, and partial-disclosure cases.
- Romanian and English presentation modes.
- Offline presentation cache for built browser app shell.
- Presenter checklist, public walkthrough, operator runbook, capture pack, and
  release report command.
- CI, E2E, CodeQL, dependency review, gitleaks, and Cloudflare Pages deployment
  workflows.

## Notes

This release is intentionally a civic browser demo. It does not integrate ROeID,
does not use a production public ledger, and does not process real personal
data.
