# Security Hardening

Phase 21 adds API-level replay protection and a canonical signing envelope for
Law 544 transitions. This is still a demo boundary, but the command shape now
matches the production requirement: every state-changing transition must be
signed once, for one purpose, with one nonce.

## Canonical Signing Envelope

`POST /api/transitions` accepts an `IngestTransitionCommand` with three signed
parts:

- `payload`: the Law 544 transition request.
- `envelope`: canonical signing metadata for that payload.
- `proof`: the actor signature over the canonical envelope.

The envelope schema is `law544-signing-envelope/v1`:

```ts
{
  schemaVersion: "law544-signing-envelope/v1",
  context: "law544.transition",
  requestId: string,
  action: Law544Action,
  purpose: `law544.transition:${requestId}:${action}`,
  payloadHash: string,
  nonce: string,
  signedAt: string
}
```

The server verifies:

- the envelope is valid for the submitted payload;
- `payloadHash` equals the canonical hash of `payload`;
- `proof.payloadHash` equals the canonical hash of `envelope`;
- the proof signer matches the credential presentation subject;
- the nonce has not already been used by that signer.

Ledger events still record the transition payload hash, not the envelope hash.
The envelope proves freshness and signing intent; the ledger payload hash proves
the public transition body.

## Replay Protection

`NonceStore` records `signerDidHash + nonce`. A replayed envelope is rejected
with `REPLAY_REJECTED` before domain state errors can mask the replay.

The current demo has `InMemoryNonceStore` for tests and Pages isolate state. A
production Cloudflare runtime must replace this with an atomic store:

- Durable Object per signer or institution;
- D1 table with unique `(signer_did_hash, nonce)`;
- KV only with a compare-and-set pattern provided by a coordinating Durable
  Object.

Recommended retention is at least the maximum accepted signature age plus audit
buffer. When signature expiry is added, reject old `signedAt` values before
remembering the nonce.

## CORS

Functions now reflect only configured allowed origins:

- `https://bureaucracy-as-code.pages.dev`
- `https://digital.cristian-nichifor.com`

Unknown origins receive no `Access-Control-Allow-Origin`. The helper also sets
`Vary: Origin` so shared caches do not reuse an allowed-origin response for a
different origin.

## Rate Limiting

`InMemoryRateLimiter` is a lightweight helper for local demos/tests. Production
should enforce limits at the Cloudflare edge before ingestion work runs:

- per IP for anonymous reads;
- per signer DID hash for `POST /api/transitions`;
- tighter limits for failed signature, presentation, and replay attempts;
- separate alerts for repeated `REPLAY_REJECTED` responses.

The in-memory helper is not sufficient for production because Pages isolates do
not provide global, durable counters.
