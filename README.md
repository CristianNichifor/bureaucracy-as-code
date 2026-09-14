# Bureaucracy as Code

Browser-only demo for a Romanian public administration transparency system.

The demo models Law 544/2001 requests as signed, trackable state transitions. It uses a local append-only hash-chain ledger rather than a production blockchain, so it can run as a static site under:

```txt
https://digital.cristian-nichifor.com/bureaucracy-as-code
```

## What it demonstrates

- DID-like browser identities for citizens and public servants.
- Verifiable credential-shaped role claims.
- Law 544 request states and allowed transitions.
- Cryptographically signed administrative actions.
- Tamper-evident local ledger with previous-state hashes.
- IndexedDB document storage and document hash verification.
- Public dashboard with anonymized request feed, audit trail, and machinery graph.
- Romanian/English presentation toggle for live demos.
- Public audit receipt export for the selected request.
- Export and import of the whole demo state as JSON, refused unless the hash chain still verifies.
- Offline presentation cache for the built browser app shell.

## Demo Scenarios

The public explorer opens with representative seeded requests so the dashboard
looks like a national transparency view before the guided browser run begins:

- resolved Ministry of Finance request with a final response hash
- in-progress Ministry of Health procurement request with attached evidence
- registered City Hall request waiting for director routing
- Ministry of Environment request with a legally visible extension
- overdue cadastral-data request that shows deadline accountability

Use the guided run to create a fresh local request, then export a public audit
receipt for either the live request or any seeded scenario.

## Browser-only milestone boundary

This milestone intentionally finishes the app as a browser-only civic demo.
Cloudflare Pages Functions and D1/KV adapters remain useful engineering
references, but the public experience must work without accounts, secrets,
network calls, or external infrastructure.

For this milestone:

- ROeID integration is out of scope.
- A real custom identity service is out of scope.
- Durable Cloudflare data resources are out of scope for the browser demo.
- Legal, DPIA, procurement, and institutional sign-off are out of scope.
- Raw personal data is never written to the ledger.
- Signing keys are never exported. Imported state can be read and re-verified;
  new transitions are signed by the browser doing the importing.
- Audit receipts are presentation artifacts. They package public hashes and
  signed event evidence for the selected request.

Future ledger providers can implement the same interface as the browser `LocalLedgerProvider`.

## Local setup

```bash
pnpm install
pnpm dev
```

Build:

```bash
pnpm build
```

Full local verification:

```bash
pnpm verify
```

Browser smoke checks:

```bash
pnpm verify:e2e
```

Demo capture pack:

```bash
pnpm demo:capture
```

This writes the standard README/presentation screenshots to
`artifacts/demo-captures/`. See [docs/demo-capture.md](docs/demo-capture.md).

Complete demo release check:

```bash
pnpm demo:release
```

This runs the local verifier, browser demo verifier, and capture pack, then
writes ignored operator reports to `artifacts/demo-release/report.md` and
`artifacts/demo-release/report.json`.

Offline demo mode:

- production builds register a service worker
- the app shell and already visited same-origin assets are cached
- browser-local demo data stays local and is not synced
- refresh/deep links keep working after the first successful online load

Deployment:

- standalone demo: `https://bureaucracy-as-code.pages.dev/`
- intended digital mount: `https://digital.cristian-nichifor.com/bureaucracy-as-code`
- Cloudflare Pages notes: [docs/cloudflare-pages.md](docs/cloudflare-pages.md)

## Documentation

- [Architecture](docs/architecture.md)
- [Privacy model](docs/privacy-model.md)
- [Threat model](docs/threat-model.md)
- [Law 544 legal caveat](docs/law-544-legal-caveat.md)
- [DPIA notes](docs/dpia-notes.md)
- [Production readiness](docs/production-readiness.md)
- [QA](docs/qa.md)
- [Demo script](docs/demo-script.md)
- [Demo capture guide](docs/demo-capture.md)
- [Offline demo mode](docs/offline-demo.md)
- [Future ledger adapters](docs/future-ledger-adapters.md)
- [Cloudflare Pages](docs/cloudflare-pages.md)
- [GitHub security setup](docs/github-security-setup.md)

## GitHub setup

The repository is public and maintained as a single-maintainer project. `main`
is protected by required signed commits, required CI/CodeQL checks, admin
enforcement, and blocked force-push/delete. Reviewer approval is intentionally
not required because the maintainer is currently the only GitHub account on the
project.

Operational setup details are kept in
[docs/github-security-setup.md](docs/github-security-setup.md).

Do not auto-merge PRs.
