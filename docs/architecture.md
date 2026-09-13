# Architecture

This repository is a browser-only functional demo for "bureaucracy as code" in
Romanian public administration. It models a Law 544/2001 request as signed,
trackable state transitions recorded in a local tamper-evident ledger.

## Layers

### Identity

The browser identity layer creates demo DID-like subjects for citizens,
registry automation, directors, and public servants. It issues
credential-shaped role claims and signs payload hashes with browser crypto.

The demo does not integrate ROeID. A future identity adapter can implement the
same interface without changing the Law 544 workflow or dashboard.

The custom identity demo repo should implement the documented
[`IdentityProvider`](identity-adapter.md) boundary. This keeps this repository
focused on bureaucracy-as-code while allowing the identity implementation to
evolve independently.

### Logic

The Law 544 domain layer owns request states, legal workflow steps, deadlines,
and allowed transitions. It rejects impossible transitions before they reach the
ledger. This keeps the rules testable and visible.

### Ledger

The local ledger is an append-only hash chain stored in the browser. Every
event includes the previous state hash and a new state hash. Verification
rehashes events and checks the links.

This is not a production blockchain. It is a local proof of the state-transition
model. Future providers can replace it with a smart contract, permissioned
chain, or public anchoring service.

### Storage

Documents stay off-ledger. The storage adapter encrypts document bytes before
they reach a local backend, and exposes only document hashes to the ledger. The
ledger records hashes only, never raw request content or personal data.

See [Storage Adapter](storage-adapter.md).

## Public Surfaces

The app presents:

- a request feed
- a signed audit trail
- a public/private data distinction
- a machinery graph showing where the file sits
- export/import of demo state
- document hash verification

## Digital Host

The final intended route is:

```txt
https://digital.cristian-nichifor.com/bureaucracy-as-code
```

Until the future `apps/digital` workspace exists, this repo can deploy as a
standalone Cloudflare Pages project. See [Cloudflare Pages](cloudflare-pages.md).
