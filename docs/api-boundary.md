# API Boundary

The Phase 6 boundary is a small ingestion service around the existing identity,
Law 544, and ledger interfaces. It is intentionally framework-neutral so it can
run today in local tests and later be wrapped by Cloudflare Pages Functions or a
Worker route.

## Ingestion Contract

`TransitionIngestionService.ingest()` accepts:

- a canonical transition payload
- the actor's signed payload proof
- a credential presentation for the same actor
- request creation metadata only for `Request_Created`

The service validates the command, loads the current request from a repository,
checks the Law 544 state machine, verifies the role credential presentation,
verifies the payload signature, appends one ledger event, then updates the
request projection.

No raw documents or personal data are required. Document bodies remain off-ledger
and outside this boundary; only hashes pass through the API.

## Cloudflare Pages Functions Shape

The Phase 12 scaffold wraps the same service with Cloudflare Pages Functions:

- `GET /api/health` returns a small deployment probe.
- `POST /api/transitions` accepts an `IngestTransitionCommand`, verifies it
  through `TransitionIngestionService`, appends one ledger event, and returns
  the updated request projection plus the current head anchor.
- `GET /api/requests` returns the public request projection, event feed, and
  current head anchor.
- `GET /api/requests/:requestId` returns one request, its public audit trail,
  integrity verification, and a request-scoped head anchor.

The scaffold uses module-level in-memory state inside the Pages isolate. That is
intentional for this PR-sized phase: it proves the HTTP/runtime boundary without
introducing Durable Objects, D1, R2, or a production ledger dependency. Durable
storage can replace `functions/_shared/runtime.ts` without changing the public
route contract or the framework-neutral ingestion service.
