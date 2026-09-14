# Browser-only Demo Finish

This milestone treats the demo app as complete when the citizen-facing browser
experience is convincing without external services.

## Closeout Roadmap

PR80: Demo completeness and plan visibility.

- Add an in-app release panel that maps the current browser demo to the finish
  criteria.
- Keep this document as the source of truth for remaining closeout work.
- Cover the panel in Playwright.

PR81: Documentation/script alignment.

- Update the README, demo script, capture guide, and QA guide to match the
  current UI panels and verification commands.
- Remove stale references to older gates where `pnpm demo:verify` or
  `pnpm demo:release` is now the canonical demo check.

PR82: Final UX/copy/spacing pass.

- Tighten repeated text, section rhythm, mobile order, and compact-panel
  spacing.
- Keep behavior unchanged; this is polish only.

PR83: Release evidence package.

- Add a concise presenter handoff for the completed browser-only demo.
- Link release notes and operator docs to the evidence package.
- Keep `pnpm demo:release` as the final readiness command.

Closeout status: PR80 through PR83 complete the browser-only demo plan. Future
work should be tracked as productionization or post-demo enhancement, not as a
blocker for this milestone.

## Finish Criteria Status

- Done: The dashboard opens with seeded anonymized Law 544 requests.
- Done: A presenter can run a complete request from submission to resolution.
- Done: Alternate request states are visible: extension, overdue, rejected, and
  in-progress.
- Done: Rich seeded cases are visible: redirected, partial disclosure, extension
  near deadline, rejected, resolved, registered, and overdue.
- Done: Key panels explain what citizens are seeing without exposing
  implementation details.
- Done: Every visible administrative action has a signer role, signer DID hash,
  timestamp, previous state hash, current state hash, and payload hash.
- Done: The final response verifier compares a local file hash with the ledger
  hash.
- Done: Export/import refuses tampered state and never exports private signing
  keys.
- Done: Audit receipt export works for seeded and live browser-created requests.
- Done: Romanian and English modes remain usable on desktop and mobile.
- Done: `pnpm demo:release` is green before release.
- Done: The release report exists at `artifacts/demo-release/report.md`.
- Done: The standard capture pack exists at `artifacts/demo-captures/`.

## Operator Release Command

Run the complete local release gate with:

```bash
pnpm demo:release
```

The command runs `pnpm verify`, `pnpm demo:verify`, and `pnpm demo:capture` in
sequence. It writes ignored local reports to:

- `artifacts/demo-release/report.md`
- `artifacts/demo-release/report.json`

The report records the branch, commit, check status, runtime, and screenshot
filenames. A passing report means the browser-only demo is ready for a local or
Cloudflare Pages presentation run.

## Release Tag Readiness

Before creating `v0.1.0`:

- merge the final release PR
- run `pnpm demo:release` on the merged branch
- review `artifacts/demo-release/report.md`
- confirm the Cloudflare Pages deployment check is green
- create the tag with signing enabled

Release notes are maintained in [v0.1.0 release notes](release-v0.1.0.md).

## Explicit Non-goals

- ROeID integration.
- Real identity-service integration.
- Durable Cloudflare data resource creation.
- Legal, DPIA, procurement, or institutional sign-off.
- Production retention, appeal, or incident-response operations.

Those are production-program concerns, not blockers for the local browser demo.
