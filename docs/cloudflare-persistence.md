# Cloudflare Persistence Scaffold

Phase 18 adds Cloudflare-ready persistence boundaries without requiring live
Cloudflare credentials for local development.

## Bindings

The scaffold expects these future Pages/Workers bindings:

| Binding | Cloudflare service | Purpose |
| --- | --- | --- |
| `REQUESTS_DB` | D1 | Public Law 544 request projection |
| `LEDGER_EVENTS_KV` | KV | Append-only demo event records and head pointer |
| `DOCUMENTS_R2` | R2 | Encrypted document envelopes |

The local test suite uses in-memory fakes for all three. No account ID, API
token, bucket, namespace, or database is required to run the repo.

## Request Projections In D1

`D1RequestRepository` implements the existing `RequestRepository` interface.
It stores only the public projection:

- request id
- institution
- subject
- citizen DID hash
- status
- dates
- registry number
- assigned public-servant DID hash
- response document hash

It does not store raw documents or direct personal data.

Schema:

```sql
CREATE TABLE IF NOT EXISTS law544_requests (
  id TEXT PRIMARY KEY,
  institution TEXT NOT NULL,
  subject TEXT NOT NULL,
  citizen_did_hash TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL,
  deadline_at TEXT NOT NULL,
  registry_number TEXT,
  assigned_to_did_hash TEXT,
  response_document_hash TEXT,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

## Ledger Events In KV

`KVLedgerProvider` implements the existing `LedgerProvider` interface over a
KV-like namespace.

Keys:

```txt
ledger:event:000000000000
ledger:event:000000000001
ledger:request:<requestId>:000000000001
ledger:head
```

KV is not the production legal ledger. It is a Cloudflare persistence scaffold
for demo projections, local replay, and future indexer output. The immutable
source of truth remains the blockchain/event-log adapter selected by the
runtime.

## Documents In R2

The existing `R2DocumentStorageBackend` stores encrypted document envelopes in
an R2-like bucket. The encrypted envelope includes the document hash and key
reference metadata, but never plaintext document bytes.

The higher-level `EncryptedDocumentStore` still handles encryption and hashing;
R2 only stores ciphertext envelopes.

## Local Development

Run the persistence tests:

```bash
pnpm test -- src/cloudflare/persistence.test.ts
```

Run full verification:

```bash
pnpm verify
```

## Future Wiring

`functions/_shared/runtime.ts` can later choose durable bindings when available:

```ts
const requests = env.REQUESTS_DB
  ? new D1RequestRepository(env.REQUESTS_DB)
  : new InMemoryRequestRepository();

const ledger = env.LEDGER_EVENTS_KV
  ? new KVLedgerProvider(env.LEDGER_EVENTS_KV)
  : new InMemoryLedgerProvider();
```

That switch should happen in a runtime-composition phase, together with replay
protection and deployment migration commands. Phase 18 intentionally leaves the
current in-memory Functions runtime unchanged.

