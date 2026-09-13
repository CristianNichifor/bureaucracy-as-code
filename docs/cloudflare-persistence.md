# Cloudflare Persistence Scaffold

Phase 18 added Cloudflare-ready persistence boundaries without requiring live
Cloudflare credentials for local development. The runtime now uses those
bindings automatically when they are present.

## Bindings

The scaffold expects these future Pages/Workers bindings:

| Binding | Cloudflare service | Purpose |
| --- | --- | --- |
| `REQUESTS_DB` | D1 | Public Law 544 request projection |
| `LEDGER_EVENTS_KV` | KV | Append-only demo event records and head pointer |
| `NONCES_KV` | KV | Replay-protection nonce records |
| `DOCUMENTS_R2` | R2 | Encrypted document envelopes |

The local test suite uses in-memory fakes for all three. No account ID, API
token, bucket, namespace, or database is required to run the repo.

If `REQUESTS_DB` and `LEDGER_EVENTS_KV` are present, Pages Functions run in
`cloudflare-durable` mode. If either is missing, they run in `demo-memory` mode.
If `NONCES_KV` is missing, nonces are stored in `LEDGER_EVENTS_KV`.

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

```bash
wrangler d1 migrations apply bureaucracy_as_code_requests
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

## Cloudflare Setup

Create the resources once:

```bash
wrangler d1 create bureaucracy_as_code_requests
wrangler kv namespace create LEDGER_EVENTS_KV
wrangler kv namespace create NONCES_KV
```

Then bind the returned IDs in the Pages project:

```toml
[[d1_databases]]
binding = "REQUESTS_DB"
database_name = "bureaucracy_as_code_requests"
database_id = "<cloudflare-d1-id>"

[[kv_namespaces]]
binding = "LEDGER_EVENTS_KV"
id = "<cloudflare-kv-id>"

[[kv_namespaces]]
binding = "NONCES_KV"
id = "<cloudflare-kv-id>"
```

Do not commit real Cloudflare resource IDs unless this repo is intended to be
the canonical infrastructure record for the production account.
