import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { memoryStorage } from "../shared/memoryStorage";
import type { Law544Request } from "../law544/types";
import { LocalLedgerProvider } from "../ledger/LocalLedgerProvider";
import type { LedgerEvent, UnsignedTransition } from "../ledger/types";
import {
  DEMO_STATE_FORMAT,
  exportDemoState,
  importDemoState,
  parseDemoState,
  serializeDemoState,
} from "./stateTransfer";

const request: Law544Request = {
  id: "REQ-2026-0001",
  institution: "Ministry of Finance",
  subject: "Public spending data",
  citizenDidHash: "citizen-hash",
  status: "Registered",
  createdAt: "2026-09-13T00:00:00.000Z",
  deadlineAt: "2026-10-13T00:00:00.000Z",
};

function transition(overrides: Partial<UnsignedTransition> = {}): UnsignedTransition {
  return {
    requestId: request.id,
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

async function ledgerWithTwoEvents(): Promise<LocalLedgerProvider> {
  const ledger = new LocalLedgerProvider();
  await ledger.appendTransition(transition());
  await ledger.appendTransition(
    transition({ action: "Registry_Assigned", fromStatus: "Created", toStatus: "Registered" }),
  );
  return ledger;
}

describe("demo state transfer", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", memoryStorage());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("carries the request and its whole chain across a round trip", async () => {
    const source = await ledgerWithTwoEvents();
    const exported = await exportDemoState({
      ledger: source,
      request,
      exportedAt: "2026-09-13T12:00:00.000Z",
    });

    expect(exported.format).toBe(DEMO_STATE_FORMAT);
    expect(exported.events).toHaveLength(2);

    const json = serializeDemoState(exported);
    await source.reset();

    const imported = await importDemoState({ ledger: source, json });
    expect(imported.request).toEqual(request);
    expect(await source.listEvents()).toEqual(exported.events);
    expect((await source.verifyChain()).valid).toBe(true);
  });

  it("replaces whatever was in the ledger instead of appending to it", async () => {
    const ledger = await ledgerWithTwoEvents();
    const json = serializeDemoState(await exportDemoState({ ledger, request }));

    await ledger.appendTransition(
      transition({ requestId: "REQ-OTHER", action: "Task_Routed", fromStatus: "Registered", toStatus: "Routed" }),
    );
    expect(await ledger.listEvents()).toHaveLength(3);

    await importDemoState({ ledger, json });

    const events = await ledger.listEvents();
    expect(events).toHaveLength(2);
    expect(events.every((event) => event.requestId === request.id)).toBe(true);
  });

  it("refuses an edited export without writing any of it", async () => {
    const ledger = await ledgerWithTwoEvents();
    const before = await ledger.listEvents();
    const exported = await exportDemoState({ ledger, request });
    const forged = {
      ...exported,
      events: [exported.events[0], { ...exported.events[1], toStatus: "Resolved" } as LedgerEvent],
    };

    await expect(importDemoState({ ledger, json: serializeDemoState(forged) })).rejects.toThrow(
      /does not verify/,
    );
    expect(await ledger.listEvents()).toEqual(before);
  });

  it("says so plainly when the file is not JSON", () => {
    expect(() => parseDemoState("not json at all")).toThrow("That file is not JSON.");
  });

  it("refuses a file written by something else", async () => {
    const source = await ledgerWithTwoEvents();
    const exported = await exportDemoState({ ledger: source, request });

    expect(() => parseDemoState(JSON.stringify({ ...exported, format: "something/else" }))).toThrow(
      /not a demo state export/,
    );
  });

  it("refuses a future version rather than guessing at it", async () => {
    const source = await ledgerWithTwoEvents();
    const exported = await exportDemoState({ ledger: source, request });

    expect(() => parseDemoState(JSON.stringify({ ...exported, version: 2 }))).toThrow(
      /not a demo state export/,
    );
  });

  it("names the field that is wrong", async () => {
    const source = await ledgerWithTwoEvents();
    const exported = await exportDemoState({ ledger: source, request });
    const broken = {
      ...exported,
      events: [{ ...exported.events[0], stateHash: "too-short" }, exported.events[1]],
    };

    expect(() => parseDemoState(JSON.stringify(broken))).toThrow(/events\.0\.stateHash/);
  });

  it("refuses an unknown status rather than importing a request nobody can act on", async () => {
    const source = await ledgerWithTwoEvents();
    const exported = await exportDemoState({ ledger: source, request });
    const broken = { ...exported, request: { ...request, status: "Archived" } };

    expect(() => parseDemoState(JSON.stringify(broken))).toThrow(/request\.status/);
  });
});
