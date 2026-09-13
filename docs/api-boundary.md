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

## Future Cloudflare Shape

A Pages Function can deserialize an HTTP `POST /api/transitions` body into the
same command type, call the service, and return the appended event plus updated
request projection. Durable Objects, D1, or R2 can replace the in-memory request
repository without changing the ingestion contract.
