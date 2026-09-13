import { beforeEach, describe, expect, it } from "vitest";
import type { DemoIdentity } from "../identity/types";
import type { Law544Action } from "../law544/types";
import {
  createLedgerEvent,
  createLedgerHeadAnchor,
  getLedgerHeadHash,
  verifyLedgerEvents,
  verifyLedgerHeadAnchor,
} from "../ledger/hashChain";
import type { ChainVerificationResult, LedgerEvent, LedgerHeadAnchor, LedgerProvider, UnsignedTransition } from "../ledger/types";
import { DemoRuntime, createMemoryDemoRuntime } from "./DemoRuntime";

type DemoActorKey = "citizen" | "registryBot" | "director" | "publicServant";

const actorForAction: Record<Law544Action, DemoActorKey> = {
  Request_Created: "citizen",
  Registry_Assigned: "registryBot",
  Task_Routed: "director",
  Processing_Started: "publicServant",
  Extension_Requested: "publicServant",
  Document_Attached: "publicServant",
  Request_Resolved: "publicServant",
  Request_Rejected: "publicServant",
  Request_Marked_Overdue: "registryBot",
};

describe("DemoRuntime", () => {
  beforeEach(() => {
    memoryLedger = new TestMemoryLedgerProvider();
  });

  it("composes identity, ingestion, repository, storage, and ledger for the demo flow", async () => {
    const runtime = await createMemoryDemoRuntime({ ledger: memoryLedger });
    let context = await runtime.reset();

    context = await apply(runtime, context, "Request_Created");
    context = await apply(runtime, context, "Registry_Assigned", { registryNumber: "MF-544-2026-0001" });
    context = await apply(runtime, context, "Task_Routed", {
      assignedToDidHash: context.identities.publicServant.did.slice(0, 18),
    });
    context = await apply(runtime, context, "Processing_Started");
    const attachment = await runtime.applyTransition({
      request: context.request,
      actor: context.identities.publicServant,
      action: "Document_Attached",
      document: { name: "internal-note.pdf", type: "application/pdf" },
    });
    context = { ...context, request: attachment.request };
    const resolution = await runtime.applyTransition({
      request: context.request,
      actor: context.identities.publicServant,
      action: "Request_Resolved",
      document: { name: "final-response.pdf", type: "application/pdf" },
    });

    expect(resolution.request.status).toBe("Resolved");
    expect(resolution.request.responseDocumentHash).toBe(resolution.document?.hash);
    expect(await runtime.requests.get(context.request.id)).toMatchObject({ status: "Resolved" });
    expect(await runtime.documents.getMetadata(resolution.document?.id ?? "")).toMatchObject({
      hash: resolution.request.responseDocumentHash,
      requestId: context.request.id,
    });
    expect(await runtime.listEvents()).toHaveLength(6);
    await expect(runtime.verifyChain()).resolves.toMatchObject({ valid: true, checkedEvents: 6 });
  });

  it("keeps duplicate creations behind the shared ingestion boundary", async () => {
    const runtime = await createMemoryDemoRuntime({ ledger: memoryLedger });
    const context = await runtime.reset();
    const created = await apply(runtime, context, "Request_Created");

    await expect(apply(runtime, context, "Request_Created")).rejects.toThrow(
      `Request ${created.request.id} already exists.`,
    );
    await expect(runtime.requests.get(created.request.id)).resolves.toMatchObject({ status: "Created" });
  });
});

let memoryLedger: TestMemoryLedgerProvider;

class TestMemoryLedgerProvider implements LedgerProvider {
  private events: LedgerEvent[] = [];

  async appendTransition(event: UnsignedTransition): Promise<LedgerEvent> {
    const next = await createLedgerEvent({ event, previous: this.events.at(-1) });
    this.events = [...this.events, next];
    return next;
  }

  async listEvents(): Promise<LedgerEvent[]> {
    return this.events.map((event) => ({ ...event }));
  }

  async replaceEvents(events: LedgerEvent[]): Promise<void> {
    this.events = events.map((event) => ({ ...event }));
  }

  async getRequestTrail(requestId: string): Promise<LedgerEvent[]> {
    return (await this.listEvents()).filter((event) => event.requestId === requestId);
  }

  async getHeadAnchor(requestId?: string): Promise<LedgerHeadAnchor> {
    return createLedgerHeadAnchor({
      events: await this.eventsForVerification(requestId),
      requestId,
      ledgerProvider: "local-browser",
    });
  }

  async verifyChain(requestId?: string, anchor?: LedgerHeadAnchor): Promise<ChainVerificationResult> {
    const events = await this.eventsForVerification(requestId);
    const firstInvalidEvent = await verifyLedgerEvents(events);
    const anchorValid = anchor ? await verifyLedgerHeadAnchor({ events, anchor }) : true;
    const headHash = getLedgerHeadHash(events);

    return {
      valid: firstInvalidEvent === null && anchorValid,
      checkedEvents: requestId ? events.filter((event) => event.requestId === requestId).length : events.length,
      firstInvalidEvent: firstInvalidEvent ?? (anchorValid ? undefined : headHash),
      headHash,
      expectedHeadHash: anchor?.headHash,
    };
  }

  async reset(): Promise<void> {
    this.events = [];
  }

  private async eventsForVerification(requestId?: string): Promise<LedgerEvent[]> {
    if (!requestId) {
      return this.listEvents();
    }

    let lastIndex = -1;
    for (let index = 0; index < this.events.length; index += 1) {
      if (this.events[index].requestId === requestId) {
        lastIndex = index;
      }
    }

    return this.events.slice(0, lastIndex + 1).map((event) => ({ ...event }));
  }
}

async function apply(
  runtime: DemoRuntime,
  context: { request: Awaited<ReturnType<DemoRuntime["reset"]>>["request"]; identities: Record<DemoActorKey, DemoIdentity> },
  action: Law544Action,
  metadata?: Record<string, string>,
) {
  const result = await runtime.applyTransition({
    request: context.request,
    actor: context.identities[actorForAction[action]],
    action,
    metadata,
  });

  return { ...context, request: result.request };
}
