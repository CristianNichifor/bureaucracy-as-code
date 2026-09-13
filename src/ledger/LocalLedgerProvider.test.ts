import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LocalLedgerProvider, STORAGE_KEY } from "./LocalLedgerProvider";
import type { LedgerEvent, UnsignedTransition } from "./types";

function memoryStorage(): Storage {
  const entries = new Map<string, string>();

  return {
    get length() {
      return entries.size;
    },
    clear: () => entries.clear(),
    getItem: (key: string) => entries.get(key) ?? null,
    key: (index: number) => [...entries.keys()][index] ?? null,
    removeItem: (key: string) => {
      entries.delete(key);
    },
    setItem: (key: string, value: string) => {
      entries.set(key, value);
    },
  };
}

function transition(overrides: Partial<UnsignedTransition> = {}): UnsignedTransition {
  return {
    requestId: "REQ-A",
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

function storedEvents(): LedgerEvent[] {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as LedgerEvent[];
}

function overwriteStoredEvents(events: LedgerEvent[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

describe("LocalLedgerProvider", () => {
  let ledger: LocalLedgerProvider;

  beforeEach(() => {
    vi.stubGlobal("localStorage", memoryStorage());
    ledger = new LocalLedgerProvider();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("appends events in order and verifies the chain it wrote", async () => {
    await ledger.appendTransition(transition());
    await ledger.appendTransition(
      transition({ action: "Registry_Assigned", fromStatus: "Created", toStatus: "Registered" }),
    );

    const events = await ledger.listEvents();
    expect(events.map((event) => event.index)).toEqual([0, 1]);
    expect(await ledger.verifyChain()).toEqual({ valid: true, checkedEvents: 2, firstInvalidEvent: undefined });
  });

  it("keeps a request's trail verifiable once a second request shares the ledger", async () => {
    // The hashes link across every request. Verifying a filtered trail on its own used to
    // report tampering here, on a ledger nobody had touched.
    await ledger.appendTransition(transition({ requestId: "REQ-A" }));
    await ledger.appendTransition(transition({ requestId: "REQ-B" }));
    await ledger.appendTransition(
      transition({
        requestId: "REQ-A",
        action: "Registry_Assigned",
        fromStatus: "Created",
        toStatus: "Registered",
      }),
    );

    const verified = await ledger.verifyChain("REQ-A");
    expect(verified.valid).toBe(true);
    expect(verified.checkedEvents).toBe(2);
    expect((await ledger.verifyChain("REQ-B")).valid).toBe(true);
  });

  it("returns only the events belonging to the request asked for", async () => {
    await ledger.appendTransition(transition({ requestId: "REQ-A" }));
    await ledger.appendTransition(transition({ requestId: "REQ-B" }));

    const trail = await ledger.getRequestTrail("REQ-B");
    expect(trail).toHaveLength(1);
    expect(trail[0].requestId).toBe("REQ-B");
  });

  it("reports the event someone edited in storage", async () => {
    await ledger.appendTransition(transition());
    await ledger.appendTransition(
      transition({ action: "Registry_Assigned", fromStatus: "Created", toStatus: "Registered" }),
    );

    const events = storedEvents();
    overwriteStoredEvents([events[0], { ...events[1], toStatus: "Resolved" }]);

    const verified = await ledger.verifyChain();
    expect(verified.valid).toBe(false);
    expect(verified.firstInvalidEvent).toBe(events[1].stateHash);
  });

  it("fails a trail whose chain was broken by another request's forged event", async () => {
    // A shared chain shares its fate: an edit before this request's last event breaks the
    // link it stands on, even though its own events were left alone.
    await ledger.appendTransition(transition({ requestId: "REQ-A" }));
    await ledger.appendTransition(transition({ requestId: "REQ-B" }));
    await ledger.appendTransition(
      transition({
        requestId: "REQ-A",
        action: "Registry_Assigned",
        fromStatus: "Created",
        toStatus: "Registered",
      }),
    );

    const events = storedEvents();
    overwriteStoredEvents([events[0], { ...events[1], signerRole: "Director" }, events[2]]);

    expect((await ledger.verifyChain("REQ-A")).valid).toBe(false);
  });

  it("forgets everything on reset", async () => {
    await ledger.appendTransition(transition());
    await ledger.reset();

    expect(await ledger.listEvents()).toEqual([]);
    expect(await ledger.verifyChain()).toEqual({ valid: true, checkedEvents: 0, firstInvalidEvent: undefined });
  });
});
