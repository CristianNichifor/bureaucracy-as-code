import {
  createLedgerEvent,
  createLedgerHeadAnchor,
  getLedgerHeadHash,
  verifyLedgerEvents,
  verifyLedgerHeadAnchor,
} from "../../src/ledger/hashChain";
import type { ChainVerificationResult, LedgerEvent, LedgerHeadAnchor, LedgerProvider, UnsignedTransition } from "../../src/ledger/types";

export class InMemoryLedgerProvider implements LedgerProvider {
  private events: LedgerEvent[] = [];

  async appendTransition(event: UnsignedTransition): Promise<LedgerEvent> {
    const next = await createLedgerEvent({
      event,
      previous: this.events.at(-1),
    });
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
    const events = await this.eventsForVerification(requestId);
    return createLedgerHeadAnchor({
      events,
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

