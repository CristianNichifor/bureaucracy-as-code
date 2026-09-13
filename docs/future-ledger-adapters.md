# Future Ledger Adapters

The current implementation uses a browser `LocalLedgerProvider`. It is enough
for a self-contained demo, but the API should remain replaceable.

## Target Interface

```ts
export interface LedgerProvider {
  appendTransition(event: UnsignedTransition): Promise<LedgerEvent>;
  listRequests(): Promise<PublicRequestSummary[]>;
  getRequestTrail(requestId: string): Promise<LedgerEvent[]>;
  verifyChain(requestId?: string): Promise<ChainVerificationResult>;
}
```

## Adapter Options

### Local Browser Ledger

Best for demos, workshops, static hosting, and offline explanation.

Tradeoffs:

- no shared multi-user state
- no consensus
- no external timestamp
- trailing event deletion cannot be detected without an external anchor

### Hardhat or Local Ethereum

Best for proving smart contract shape and event indexing.

Tradeoffs:

- needs a backend or local node
- adds deployment complexity
- still not production governance

### Permissioned Ethereum

Best for a consortium of institutions that want Ethereum-compatible tooling.

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
2. Add an export format for ledger heads and request trails.
3. Add signature verification to full-chain verification.
4. Add optional head anchoring.
5. Build a Hardhat adapter only after the UI and domain model stop moving.
