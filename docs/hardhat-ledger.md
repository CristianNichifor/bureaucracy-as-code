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
