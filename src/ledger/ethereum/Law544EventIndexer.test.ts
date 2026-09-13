import { describe, expect, it } from "vitest";
import {
  Law544EventIndexer,
  ViemLaw544TransitionLogSource,
  buildPublicRequestProjections,
  createEthereumHeadAnchor,
  normalizeTransitionLogs,
  type Law544TransitionLog,
} from "./Law544EventIndexer";

const ZERO = `0x${"0".repeat(64)}` as const;

function bytes32(char: string) {
  return `0x${char.repeat(64)}` as const;
}

function log(overrides: Partial<Law544TransitionLog["args"]> = {}): Law544TransitionLog {
  return {
    args: {
      eventIndex: 0n,
      requestIdHash: bytes32("1"),
      stateHash: bytes32("2"),
      previousStateHash: ZERO,
      payloadHash: bytes32("3"),
      documentHash: ZERO,
      signerDidHash: bytes32("4"),
      credentialHash: bytes32("5"),
      action: "Request_Created",
      fromStatus: "Draft",
      toStatus: "Created",
      signerRole: "Citizen",
      occurredAt: "2026-09-14T00:00:00.000Z",
      metadataUri: "",
      ...overrides,
    },
    blockNumber: 12n,
    transactionHash: bytes32("6"),
    logIndex: 0,
  };
}

describe("Law544 event indexing", () => {
  it("normalizes chain logs without exposing raw request ids", () => {
    const events = normalizeTransitionLogs([log()]);

    expect(events).toEqual([
      expect.objectContaining({
        index: 0,
        requestIdHash: "1".repeat(64),
        action: "Request_Created",
        fromStatus: "Draft",
        toStatus: "Created",
        signerRole: "Citizen",
        documentHash: undefined,
        blockNumber: "12",
        transactionHash: bytes32("6"),
      }),
    ]);
  });

  it("builds public request projections from ordered chain events", () => {
    const events = normalizeTransitionLogs([
      log(),
      log({
        eventIndex: 1n,
        previousStateHash: bytes32("2"),
        stateHash: bytes32("7"),
        action: "Registry_Assigned",
        fromStatus: "Created",
        toStatus: "Registered",
        signerRole: "RegistryBot",
        occurredAt: "2026-09-14T00:01:00.000Z",
      }),
      log({
        eventIndex: 2n,
        previousStateHash: bytes32("7"),
        stateHash: bytes32("8"),
        documentHash: bytes32("9"),
        action: "Request_Resolved",
        fromStatus: "InProgress",
        toStatus: "Resolved",
        signerRole: "PublicServant",
        occurredAt: "2026-09-14T00:02:00.000Z",
      }),
    ]);

    expect(buildPublicRequestProjections(events)).toEqual([
      {
        requestIdHash: "1".repeat(64),
        status: "Resolved",
        eventCount: 3,
        firstSeenAt: "2026-09-14T00:00:00.000Z",
        lastUpdatedAt: "2026-09-14T00:02:00.000Z",
        lastAction: "Request_Resolved",
        lastSignerRole: "PublicServant",
        responseDocumentHash: "9".repeat(64),
        currentStateHash: "8".repeat(64),
      },
    ]);
  });

  it("creates local ethereum head anchors for indexed snapshots", async () => {
    const events = normalizeTransitionLogs([log()]);

    await expect(createEthereumHeadAnchor(events, "2026-09-14T00:03:00.000Z")).resolves.toMatchObject({
      ledgerProvider: "local-ethereum",
      eventCount: 1,
      headHash: "2".repeat(64),
      anchoredAt: "2026-09-14T00:03:00.000Z",
    });
  });

  it("indexes logs through a viem-compatible event source", async () => {
    const source = new ViemLaw544TransitionLogSource({
      getEvents: {
        TransitionRecorded: async (_filter, range) => {
          expect(range).toEqual({ fromBlock: 1n, toBlock: 2n });
          return [log()];
        },
      },
    });
    const indexer = new Law544EventIndexer(source);

    await expect(indexer.index({ fromBlock: 1n, toBlock: 2n })).resolves.toMatchObject({
      events: [expect.objectContaining({ index: 0 })],
      projections: [expect.objectContaining({ status: "Created" })],
      headAnchor: expect.objectContaining({ ledgerProvider: "local-ethereum" }),
    });
  });
});
