# Hardhat Ledger Devnet

This repo includes a local Ethereum devnet path for anchoring Law 544/2001
audit events in `contracts/Law544Ledger.sol`.

The browser demo can still run without a chain. The Hardhat path is a
developer-facing proof that the same hashed transition records can be compiled,
deployed, tested, and appended to an append-only ledger.

## What Runs Locally

- `contracts/Law544Ledger.sol`: append-only Solidity event ledger.
- `hardhat.config.ts`: Hardhat 3 config using the viem toolbox.
- `test/hardhat/Law544Ledger.ts`: contract tests against the in-process Hardhat
  network.
- `test/hardhat/Law544LedgerIndexer.ts`: indexes real emitted contract events
  into public request projections and a local chain head anchor.
- `scripts/deploy-law544-ledger.ts`: deploy script for either the in-process
  network or a running local node.

## Commands

Install dependencies first:

```sh
pnpm install
```

Compile the contract:

```sh
pnpm ledger:compile
```

Run the contract tests:

```sh
pnpm ledger:test
```

Deploy to an in-process Hardhat network:

```sh
pnpm ledger:deploy
```

Run a persistent local node in one terminal:

```sh
pnpm ledger:node
```

Deploy to that node from another terminal:

```sh
pnpm exec hardhat run scripts/deploy-law544-ledger.ts --network localhost
```

## Contract Shape

`Law544Ledger` stores only public audit anchors:

- request id hash
- payload hash
- optional document hash
- signer DID hash
- signer credential hash
- previous state hash
- new state hash
- event index
- action and status names
- signer role
- signed transition timestamp
- optional metadata URI

No PII and no raw documents belong on-chain.

The contract enforces append-only ordering:

- `eventIndex` must equal the current contract `eventCount`.
- `previousStateHash` must equal the current contract `headHash`.
- `stateHash` must be non-empty.

The Law 544 legal workflow checks remain in the TypeScript state machine and API
ingestion layer. The contract is intentionally narrow: it anchors accepted state
transitions and makes skipped or rewritten history visible.

## Adapter Boundary

`src/ledger/ethereum/Law544EthereumAdapter.ts` implements the app-level
`LedgerProvider` interface against an `EthereumLedgerContractClient`.

That keeps Hardhat, viem, and RPC-specific code out of the browser bundle. A
production client can later implement the same small interface with viem or a
Cloudflare Worker RPC bridge:

```ts
interface EthereumLedgerContractClient {
  appendTransition(record: EthereumTransitionRecord): Promise<EthereumTransactionReceipt>;
  listEvents(): Promise<LedgerEvent[]>;
}
```

## Event Indexing

`src/ledger/ethereum/Law544EventIndexer.ts` is the local-chain indexer scaffold.
It reads `TransitionRecorded` logs through a viem-compatible event source and
builds:

- ordered indexed transitions
- public request projections keyed by `requestIdHash`
- a `local-ethereum` head anchor over the indexed chain head

The indexer intentionally does not reconstruct private request ids, raw DID
values, signatures, or documents. The contract event stores only hashes and
public workflow labels, so the public projection keeps the same privacy
boundary:

```ts
import {
  Law544EventIndexer,
  ViemLaw544TransitionLogSource,
} from "./src/ledger/ethereum/Law544EventIndexer";

const indexer = new Law544EventIndexer(new ViemLaw544TransitionLogSource(contract));
const snapshot = await indexer.index({ fromBlock: 0n });

console.log(snapshot.projections);
console.log(snapshot.headAnchor);
```

Use `{ fromBlock: 0n }` for a full local backfill. Later incremental indexers can
store the last processed block/log cursor and resume from there.

The projection is deliberately small:

- current status
- event count
- first and last timestamps
- latest action and signer role
- response document hash, when resolved
- current chain state hash

If a private operator needs to join a projection back to an internal registry
number or raw request id, that lookup belongs in the off-chain registry/storage
layer, not in the public chain event.

## Production Notes

This devnet is not the production deployment plan. For production, use a
permissioned chain or a managed RPC endpoint, publish deployment addresses per
environment, and route writes through the signed API ingestion boundary.

Cloudflare Pages cannot rely on a private local Hardhat node in production. The
production path should be:

1. Browser signs or presents a transition command.
2. API/Worker verifies identity, credential presentation, signature, and Law 544
   state-machine legality.
3. API/Worker appends the accepted transition to the configured ledger.
4. Public dashboard reads a projection plus ledger anchors.
