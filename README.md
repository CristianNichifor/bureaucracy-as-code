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
- Export and import of the whole demo state as JSON, refused unless the chain still verifies.

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

## What it does not do yet

- It does not integrate ROeID.
- It does not run a backend API.
- It does not run a real blockchain node.
- It does not store raw personal data on a ledger.
- It does not publish ledger head anchors outside the browser. Local anchors can
  catch trailing deletion inside an exported state, but production still needs a
  public anchor, countersignature, or external timestamp.
- It does not yet enforce credential presentations inside every state-machine
  transition. The provider can prove roles and purposes; the next backend/API
  boundary should require those proofs before appending protected events.
- It does not export signing keys. An imported state can be read and re-verified; new
  transitions are signed by the identities of the browser doing the importing. Writing a
  private key into a shareable JSON file is the habit this demo argues against.
- Audit receipts are presentation artifacts. They package the selected request's public
  hashes and signed event evidence; they are not a substitute for a production ledger
  proof or external timestamp.

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
