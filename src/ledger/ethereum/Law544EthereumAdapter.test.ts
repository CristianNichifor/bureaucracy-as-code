import { describe, expect, it } from "vitest";
import { Law544EthereumAdapter, hexHashToBytes32, toEthereumTransitionRecord } from "./Law544EthereumAdapter";
import { createLedgerEvent } from "../hashChain";
import type { EthereumLedgerContractClient, EthereumTransitionRecord } from "./Law544EthereumAdapter";
import type { LedgerEvent, UnsignedTransition } from "../types";

const HASH = "a".repeat(64);

function transition(overrides: Partial<UnsignedTransition> = {}): UnsignedTransition {
  return {
    requestId: "REQ-2026-0001",
    action: "Request_Created",
    fromStatus: "Draft",
    toStatus: "Created",
    payloadHash: HASH,
    signerDidHash: "b".repeat(64),
    signerRole: "Citizen",
    credentialHash: "c".repeat(64),
    signature: "signature",
    timestamp: "2026-09-13T00:00:00.000Z",
    ...overrides,
  };
}

class MemoryContractClient implements EthereumLedgerContractClient {
  readonly records: EthereumTransitionRecord[] = [];
  readonly events: LedgerEvent[] = [];

  async appendTransition(record: EthereumTransitionRecord): Promise<{ transactionHash: string }> {
    this.records.push(record);
    return { transactionHash: `0x${"1".repeat(64)}` };
  }

  async listEvents(): Promise<LedgerEvent[]> {
    return this.events;
  }
}

describe("Ethereum ledger transition mapping", () => {
  it("maps ledger events to the contract input shape without exposing raw request ids", async () => {
    const event = await createLedgerEvent({ event: transition({ documentHash: "d".repeat(64) }) });
    const record = await toEthereumTransitionRecord(event);

    expect(record.requestIdHash).toMatch(/^0x[a-f0-9]{64}$/);
    expect(record.requestIdHash).not.toContain(event.requestId);
    expect(record.payloadHash).toBe(`0x${HASH}`);
    expect(record.documentHash).toBe(`0x${"d".repeat(64)}`);
    expect(record.eventIndex).toBe(0n);
    expect(record.action).toBe("Request_Created");
  });

  it("uses an empty bytes32 value when an event has no document hash", async () => {
    const event = await createLedgerEvent({ event: transition() });
    const record = await toEthereumTransitionRecord(event);

    expect(record.documentHash).toBe(`0x${"0".repeat(64)}`);
  });

  it("rejects non-hash inputs before they reach the contract client", () => {
    expect(() => hexHashToBytes32("not-a-hash")).toThrow("Expected a 32-byte hex hash.");
  });
});

describe("Law544EthereumAdapter", () => {
  it("implements the LedgerProvider append path against a contract client", async () => {
    const client = new MemoryContractClient();
    const adapter = new Law544EthereumAdapter(client);

    const event = await adapter.appendTransition(transition());

    expect(event.index).toBe(0);
    expect(client.records).toHaveLength(1);
    expect(client.records[0].stateHash).toBe(`0x${event.stateHash}`);
  });

  it("creates local-ethereum anchors for chain heads", async () => {
    const client = new MemoryContractClient();
    const event = await createLedgerEvent({ event: transition() });
    client.events.push(event);
    const adapter = new Law544EthereumAdapter(client);

    await expect(adapter.getHeadAnchor()).resolves.toMatchObject({
      ledgerProvider: "local-ethereum",
      eventCount: 1,
      headHash: event.stateHash,
    });
  });

  it("keeps destructive browser-ledger operations unavailable", async () => {
    const adapter = new Law544EthereumAdapter(new MemoryContractClient());

    await expect(adapter.replaceEvents([])).rejects.toThrow("append-only");
    await expect(adapter.reset()).rejects.toThrow("append-only");
  });
});
