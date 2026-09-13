# Hardhat Ledger Scaffold

This phase adds the local Ethereum shape without replacing the browser ledger.
The Vite demo still runs without chain tooling, while the contract and adapter
define how a Hardhat node can record the same Law 544 event hashes.

## Contract

`contracts/Law544Ledger.sol` is an append-only event ledger. It records:

- request id hash
- action and status names
- payload/document/signer/credential hashes
- previous state hash and new state hash
- signer role
- timestamp string from the signed transition
- optional metadata URI

The contract enforces only chain order:

- `eventIndex` must equal the current contract event count
- `previousStateHash` must equal the current contract head hash
- `stateHash` cannot be empty

The legal transition rules remain in the TypeScript Law 544 state machine for
now. A later phase can move those checks into Solidity or keep them in a
deterministic backend before anchoring accepted transitions on-chain.

## Adapter Boundary

`src/ledger/ethereum/Law544EthereumAdapter.ts` implements the existing
`LedgerProvider` contract against a small `EthereumLedgerContractClient`
interface. It intentionally avoids importing `ethers`, `viem`, or Hardhat into
the browser bundle.

A future client binding only needs to provide:

```ts
interface EthereumLedgerContractClient {
  appendTransition(record: EthereumTransitionRecord): Promise<EthereumTransactionReceipt>;
  listEvents(): Promise<LedgerEvent[]>;
}
```

The adapter computes the same canonical ledger event hash as the browser ledger,
maps it to Solidity-friendly `bytes32` fields, and asks the contract client to
append it. Destructive demo operations such as `replaceEvents` and `reset` throw
because a chain ledger is append-only.

## Local Hardhat Path

When we decide to wire the runnable local chain, add Hardhat dependencies in a
dedicated PR:

```sh
pnpm add -D hardhat @nomicfoundation/hardhat-toolbox
pnpm hardhat init
pnpm hardhat compile
pnpm hardhat node
```

Then add a deploy script for `Law544Ledger` and an ethers/viem client that
implements `EthereumLedgerContractClient`.

Keep this path optional until the browser demo has a backend boundary. A static
Cloudflare Pages app cannot talk to a private Hardhat node by itself in
production; it needs either a local demo node, a Worker/API bridge, or a
hosted RPC endpoint.
