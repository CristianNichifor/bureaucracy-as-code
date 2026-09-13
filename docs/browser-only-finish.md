# Browser-only Demo Finish

This milestone treats the demo app as complete when the citizen-facing browser
experience is convincing without external services.

## Finish Criteria

- The dashboard opens with seeded anonymized Law 544 requests.
- A presenter can run a complete request from submission to resolution.
- Alternate request states are visible: extension, overdue, rejected, and
  in-progress.
- Every visible administrative action has a signer role, signer DID hash,
  timestamp, previous state hash, current state hash, and payload hash.
- The final response verifier compares a local file hash with the ledger hash.
- Export/import refuses tampered state and never exports private signing keys.
- Audit receipt export works for seeded and live browser-created requests.
- Romanian and English modes remain usable on desktop and mobile.
- `pnpm verify` and `pnpm verify:e2e` are green before release.

## Explicit Non-goals

- ROeID integration.
- Real identity-service integration.
- Real Cloudflare resource creation.
- Legal, DPIA, procurement, or institutional sign-off.
- Production retention, appeal, or incident-response operations.

Those are production-program concerns, not blockers for the local browser demo.
