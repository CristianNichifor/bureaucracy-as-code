import { describe, expect, it } from "vitest";
import {
  createLedgerEvent,
  createLedgerHeadAnchor,
  GENESIS_HASH,
  verifyLedgerEvents,
  verifyLedgerHeadAnchor,
} from "./hashChain";
import { LEDGER_EVENT_SCHEMA_VERSION } from "./types";
import type { LedgerEvent, UnsignedTransition } from "./types";

function transition(overrides: Partial<UnsignedTransition> = {}): UnsignedTransition {
  return {
    requestId: "REQ-2026-0001",
    action: "Request_Created",
    fromStatus: "Draft",
    toStatus: "Created",
    payloadHash: "payload-hash",
    signerDidHash: "signer-hash",
    signerRole: "Citizen",
    credentialHash: "credential-hash",
    signature: "signature",
    timestamp: "2026-09-13T00:00:00.000Z",
    ...overrides,
  };
}

async function chainOf(...events: UnsignedTransition[]): Promise<LedgerEvent[]> {
  const chain: LedgerEvent[] = [];

  for (const event of events) {
    chain.push(await createLedgerEvent({ event, previous: chain.at(-1) }));
  }

  return chain;
}

describe("createLedgerEvent", () => {
  it("starts at index 0 from the genesis hash", async () => {
    const [first] = await chainOf(transition());

    expect(first.index).toBe(0);
    expect(first.schemaVersion).toBe(LEDGER_EVENT_SCHEMA_VERSION);
    expect(first.eventType).toBe("law544.transition");
    expect(first.previousStateHash).toBe(GENESIS_HASH);
    expect(first.stateHash).toHaveLength(64);
  });

  it("links each event to the hash of the one before it", async () => {
    const [first, second] = await chainOf(
      transition(),
      transition({ action: "Registry_Assigned", fromStatus: "Created", toStatus: "Registered" }),
    );

    expect(second.index).toBe(1);
    expect(second.previousStateHash).toBe(first.stateHash);
  });
});

describe("verifyLedgerEvents", () => {
  it("accepts an untouched chain", async () => {
    const chain = await chainOf(
      transition(),
      transition({ action: "Registry_Assigned", fromStatus: "Created", toStatus: "Registered" }),
    );

    expect(await verifyLedgerEvents(chain)).toBeNull();
  });

  it("accepts the empty chain", async () => {
    expect(await verifyLedgerEvents([])).toBeNull();
  });

  it("rejects an event with an unsupported schema", async () => {
    const [event] = await chainOf(transition());
    const forged = { ...event, schemaVersion: "law544-ledger-event/v999" };

    expect(await verifyLedgerEvents([forged as LedgerEvent])).toBe(event.stateHash);
  });

  it("names the event whose content was edited after the fact", async () => {
    const chain = await chainOf(
      transition(),
      transition({ action: "Registry_Assigned", fromStatus: "Created", toStatus: "Registered" }),
    );
    const forged: LedgerEvent[] = [chain[0], { ...chain[1], toStatus: "Resolved" }];

    expect(await verifyLedgerEvents(forged)).toBe(chain[1].stateHash);
  });

  it("catches an event quietly removed from the middle", async () => {
    const chain = await chainOf(
      transition(),
      transition({ action: "Registry_Assigned", fromStatus: "Created", toStatus: "Registered" }),
      transition({ action: "Task_Routed", fromStatus: "Registered", toStatus: "Routed" }),
    );

    expect(await verifyLedgerEvents([chain[0], chain[2]])).toBe(chain[2].stateHash);
  });

  it("catches a reordered chain", async () => {
    const chain = await chainOf(
      transition(),
      transition({ action: "Registry_Assigned", fromStatus: "Created", toStatus: "Registered" }),
    );

    expect(await verifyLedgerEvents([chain[1], chain[0]])).toBe(chain[1].stateHash);
  });

  it("does NOT catch a chain truncated at the end — a known limit of an unanchored chain", async () => {
    const chain = await chainOf(
      transition(),
      transition({ action: "Registry_Assigned", fromStatus: "Created", toStatus: "Registered" }),
    );

    // Dropping trailing events leaves a shorter, internally consistent chain. Detecting this
    // needs an anchor the chain cannot supply itself — a published head, a countersignature,
    // or an external timestamp. The demo says so rather than implying it is tamper-proof.
    expect(await verifyLedgerEvents([chain[0]])).toBeNull();
  });
});

describe("ledger head anchors", () => {
  it("anchors the current head hash and event count", async () => {
    const chain = await chainOf(
      transition(),
      transition({ action: "Registry_Assigned", fromStatus: "Created", toStatus: "Registered" }),
    );
    const anchor = await createLedgerHeadAnchor({
      events: chain,
      anchoredAt: "2026-09-13T00:00:00.000Z",
    });

    expect(anchor.headHash).toBe(chain[1].stateHash);
    expect(anchor.eventCount).toBe(2);
    expect(anchor.anchorHash).toHaveLength(64);
    expect(await verifyLedgerHeadAnchor({ events: chain, anchor })).toBe(true);
  });

  it("detects a trailing event removed after anchoring", async () => {
    const chain = await chainOf(
      transition(),
      transition({ action: "Registry_Assigned", fromStatus: "Created", toStatus: "Registered" }),
    );
    const anchor = await createLedgerHeadAnchor({ events: chain });

    expect(await verifyLedgerEvents([chain[0]])).toBeNull();
    expect(await verifyLedgerHeadAnchor({ events: [chain[0]], anchor })).toBe(false);
  });
});
