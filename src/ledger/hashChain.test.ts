import { describe, expect, it } from "vitest";
import { createLedgerEvent, GENESIS_HASH, verifyLedgerEvents } from "./hashChain";
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
