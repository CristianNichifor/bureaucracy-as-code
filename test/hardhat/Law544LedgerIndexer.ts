import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { network } from "hardhat";

import { Law544EventIndexer, ViemLaw544TransitionLogSource } from "../../src/ledger/ethereum/Law544EventIndexer";

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
    documentHash: ZERO_BYTES32,
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
    metadataUri: "",
    ...overrides,
  };
}

describe("Law544Ledger event indexing", function () {
  it("indexes emitted contract events into public request projections and head anchors", async function () {
    const ledger = await viem.deployContract("Law544Ledger");

    await ledger.write.appendTransition([transitionInput()]);
    await ledger.write.appendTransition([
      transitionInput({
        documentHash: DOCUMENT_HASH,
        previousStateHash: FIRST_STATE_HASH,
        stateHash: SECOND_STATE_HASH,
        eventIndex: 1n,
        action: "Request_Resolved",
        fromStatus: "InProgress",
        toStatus: "Resolved",
        signerRole: "PublicServant",
        occurredAt: "2026-09-14T00:02:00.000Z",
        metadataUri: "r2://law544/response.json",
      }),
    ]);

    const indexer = new Law544EventIndexer(new ViemLaw544TransitionLogSource(ledger));
    const snapshot = await indexer.index({ fromBlock: 0n });

    assert.equal(snapshot.events.length, 2);
    assert.equal(snapshot.events[0].requestIdHash, "1".repeat(64));
    assert.equal(snapshot.events[0].action, "Request_Created");
    assert.equal(snapshot.events[1].documentHash, "3".repeat(64));

    assert.deepEqual(snapshot.projections, [
      {
        requestIdHash: "1".repeat(64),
        status: "Resolved",
        eventCount: 2,
        firstSeenAt: "2026-09-14T00:00:00.000Z",
        lastUpdatedAt: "2026-09-14T00:02:00.000Z",
        lastAction: "Request_Resolved",
        lastSignerRole: "PublicServant",
        responseDocumentHash: "3".repeat(64),
        currentStateHash: "7".repeat(64),
      },
    ]);

    assert.equal(snapshot.headAnchor.ledgerProvider, "local-ethereum");
    assert.equal(snapshot.headAnchor.eventCount, 2);
    assert.equal(snapshot.headAnchor.headHash, "7".repeat(64));
  });
});
