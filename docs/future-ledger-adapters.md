# Future Ledger Adapters

The current implementation uses a browser `LocalLedgerProvider`. It is enough
for a self-contained demo, but the API should remain replaceable.

## Target Interface

```ts
export interface LedgerProvider {
  appendTransition(event: UnsignedTransition): Promise<LedgerEvent>;
  listEvents(): Promise<LedgerEvent[]>;
  replaceEvents(events: LedgerEvent[]): Promise<void>;
  getRequestTrail(requestId: string): Promise<LedgerEvent[]>;
  getHeadAnchor(requestId?: string): Promise<LedgerHeadAnchor>;
  verifyChain(requestId?: string, anchor?: LedgerHeadAnchor): Promise<ChainVerificationResult>;
  reset(): Promise<void>;
}
```

Ledger events are versioned with `schemaVersion: "law544-ledger-event/v1"`
and `eventType: "law544.transition"`. Adapters should reject unsupported
schemas instead of silently accepting data from a future or incompatible event
format.

Head anchors use `schemaVersion: "law544-ledger-head-anchor/v1"` and capture:

- provider type
- event count
- current head hash
- anchor timestamp
- optional request id
- anchor hash over the anchor payload

Anchors do not make the browser ledger a blockchain. They give the demo a clear
boundary for proving that a previously observed head has not been shortened or
replaced.

## Adapter Options

### Local Browser Ledger

Best for demos, workshops, static hosting, and offline explanation.

Tradeoffs:

- no shared multi-user state
- no consensus
- no external timestamp
- trailing event deletion cannot be detected without an external anchor

The current helper can create a local head anchor. A local anchor catches
trailing deletion only while the anchor itself is trusted. A production adapter
would publish the anchor to a timestamping service, a public chain, or a
permissioned consortium ledger.

### External EVM Ledger

Best for a consortium of institutions that want EVM-compatible tooling after the
browser demo has stabilized.

Tradeoffs:

- governance and node operation matter more than contract code
- privacy must stay mostly off-chain

### Hyperledger Fabric

Best for permissioned public administration networks with explicit membership.

Tradeoffs:

- more operational complexity
- weaker fit for a browser-only demo

### Public Anchoring

Best as a pragmatic middle step. Keep the detailed ledger local or permissioned,
then periodically publish a head hash to an external timestamping or public
chain service.

Tradeoffs:

- proves existence and order of anchored heads
- does not by itself expose full state

## Recommended Path

1. Keep the browser demo stable.
2. Add signature verification to full-chain verification.
3. Export and import anchored request audit packages.
4. Publish optional head anchors outside the browser.
5. Add an external ledger adapter only after the UI and domain model stop moving.
