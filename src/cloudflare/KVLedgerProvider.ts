import { createLedgerEvent } from "../ledger/hashChain";
import type { ChainVerificationResult, LedgerEvent, LedgerHeadAnchor, LedgerProvider, UnsignedTransition } from "../ledger/types";
import type { KVNamespaceLike } from "./bindings";
import { KVLedgerEventStore } from "./KVLedgerEventStore";

export class KVLedgerProvider implements LedgerProvider {
  private readonly store: KVLedgerEventStore;

  constructor(kv: KVNamespaceLike) {
    this.store = new KVLedgerEventStore(kv);
  }

  async appendTransition(event: UnsignedTransition): Promise<LedgerEvent> {
    const events = await this.store.listEvents();
    const next = await createLedgerEvent({ event, previous: events.at(-1) });
    await this.store.append(next);
    return next;
  }

  async listEvents(): Promise<LedgerEvent[]> {
    return this.store.listEvents();
  }

  async replaceEvents(events: LedgerEvent[]): Promise<void> {
    if ((await this.store.listEvents()).length > 0) {
      throw new Error("KV ledger storage is append-only; reset the local namespace before replaying fixtures.");
    }

    for (const event of events.sort((left, right) => left.index - right.index)) {
      await this.store.append(event);
    }
  }

  async getRequestTrail(requestId: string): Promise<LedgerEvent[]> {
    return this.store.getRequestTrail(requestId);
  }

  async getHeadAnchor(requestId?: string): Promise<LedgerHeadAnchor> {
    return this.store.getHeadAnchor(requestId);
  }

  async verifyChain(requestId?: string, anchor?: LedgerHeadAnchor): Promise<ChainVerificationResult> {
    return this.store.verify(requestId, anchor);
  }

  async reset(): Promise<void> {
    throw new Error("KV ledger storage cannot be reset through the production adapter.");
  }
}

