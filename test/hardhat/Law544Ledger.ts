import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { network } from "hardhat";

const ZERO_BYTES32 = `0x${"0".repeat(64)}` as const;
const REQUEST_ID_HASH = `0x${"1".repeat(64)}` as const;
const PAYLOAD_HASH = `0x${"2".repeat(64)}` as const;
const DOCUMENT_HASH = `0x${"3".repeat(64)}` as const;
const SIGNER_DID_HASH = `0x${"4".repeat(64)}` as const;
const CREDENTIAL_HASH = `0x${"5".repeat(64)}` as const;
const FIRST_STATE_HASH = `0x${"6".repeat(64)}` as const;
const SECOND_STATE_HASH = `0x${"7".repeat(64)}` as const;

const { viem } = await network.create();

function transitionInput(overrides: Record<string, unknown> = {}) {
  return {
    requestIdHash: REQUEST_ID_HASH,
    payloadHash: PAYLOAD_HASH,
    documentHash: DOCUMENT_HASH,
    signerDidHash: SIGNER_DID_HASH,
    credentialHash: CREDENTIAL_HASH,
    previousStateHash: ZERO_BYTES32,
    stateHash: FIRST_STATE_HASH,
    eventIndex: 0n,
    action: "Request_Created",
    fromStatus: "Draft",
    toStatus: "Created",
    signerRole: "Citizen",
    occurredAt: "2026-09-14T00:00:00.000Z",
    metadataUri: "ipfs://metadata",
    ...overrides,
  };
}

describe("Law544Ledger", function () {
  it("deploys with an empty append-only head", async function () {
    const ledger = await viem.deployContract("Law544Ledger");

    assert.equal(await ledger.read.eventCount(), 0n);
    assert.equal(await ledger.read.headHash(), ZERO_BYTES32);
  });

  it("records transitions in order and emits the public audit event", async function () {
    const ledger = await viem.deployContract("Law544Ledger");

    await viem.assertions.emitWithArgs(
      ledger.write.appendTransition([transitionInput()]),
      ledger,
      "TransitionRecorded",
      [
        0n,
        REQUEST_ID_HASH,
        FIRST_STATE_HASH,
        ZERO_BYTES32,
        PAYLOAD_HASH,
        DOCUMENT_HASH,
        SIGNER_DID_HASH,
        CREDENTIAL_HASH,
        "Request_Created",
        "Draft",
        "Created",
        "Citizen",
        "2026-09-14T00:00:00.000Z",
        "ipfs://metadata",
      ],
    );

    assert.equal(await ledger.read.eventCount(), 1n);
    assert.equal(await ledger.read.headHash(), FIRST_STATE_HASH);

    await ledger.write.appendTransition([
      transitionInput({
        previousStateHash: FIRST_STATE_HASH,
        stateHash: SECOND_STATE_HASH,
        eventIndex: 1n,
        action: "Registry_Assigned",
        fromStatus: "Created",
        toStatus: "Registered",
        signerRole: "RegistryBot",
      }),
    ]);

    assert.equal(await ledger.read.eventCount(), 2n);
    assert.equal(await ledger.read.headHash(), SECOND_STATE_HASH);
  });

  it("rejects skipped event indexes", async function () {
    const ledger = await viem.deployContract("Law544Ledger");

    await assert.rejects(
      ledger.write.appendTransition([transitionInput({ eventIndex: 1n })]),
      /UnexpectedEventIndex/,
    );
  });

  it("rejects transitions that do not point at the current head", async function () {
    const ledger = await viem.deployContract("Law544Ledger");

    await ledger.write.appendTransition([transitionInput()]);

    await assert.rejects(
      ledger.write.appendTransition([
        transitionInput({
          eventIndex: 1n,
          previousStateHash: ZERO_BYTES32,
          stateHash: SECOND_STATE_HASH,
        }),
      ]),
      /BrokenHashChain/,
    );
  });

  it("rejects empty state hashes", async function () {
    const ledger = await viem.deployContract("Law544Ledger");

    await assert.rejects(
      ledger.write.appendTransition([transitionInput({ stateHash: ZERO_BYTES32 })]),
      /EmptyStateHash/,
    );
  });
});
