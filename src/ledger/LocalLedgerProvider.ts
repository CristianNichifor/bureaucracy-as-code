import {
  createLedgerEvent,
  createLedgerHeadAnchor,
  getLedgerHeadHash,
  verifyLedgerEvents,
  verifyLedgerHeadAnchor,
} from "./hashChain";
import { LEDGER_EVENT_SCHEMA_VERSION } from "./types";
import type { ChainVerificationResult, LedgerEvent, LedgerHeadAnchor, LedgerProvider, UnsignedTransition } from "./types";

export const STORAGE_KEY = "bureaucracy-as-code:ledger:v1";

function result(input: {
  firstInvalidEvent: string | null;
  checkedEvents: number;
  headHash?: string;
  expectedHeadHash?: string;
}): ChainVerificationResult {
  return {
    valid: input.firstInvalidEvent === null,
    checkedEvents: input.checkedEvents,
    firstInvalidEvent: input.firstInvalidEvent ?? undefined,
    headHash: input.headHash,
    expectedHeadHash: input.expectedHeadHash,
  };
}

export class LocalLedgerProvider implements LedgerProvider {
  async appendTransition(event: UnsignedTransition): Promise<LedgerEvent> {
    const events = await this.listEvents();
    const next = await createLedgerEvent({
      event,
      previous: events.at(-1),
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...events, next]));
    return next;
  }

  async listEvents(): Promise<LedgerEvent[]> {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as LedgerEvent[]) : [];
  }

  async replaceEvents(events: LedgerEvent[]): Promise<void> {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events.map(normalizeLedgerEvent)));
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
    const expectedHeadHash = anchor?.headHash;
    const headHash = getLedgerHeadHash(events);

    return result({
      firstInvalidEvent: firstInvalidEvent ?? (anchorValid ? null : headHash),
      checkedEvents: requestId ? events.filter((event) => event.requestId === requestId).length : events.length,
      headHash,
      expectedHeadHash,
    });
  }

  private async eventsForVerification(requestId?: string): Promise<LedgerEvent[]> {
    const events = await this.listEvents();

    if (!requestId) {
      return events;
    }

    // One request's events are not a chain of their own. Every event links to whatever was
    // appended before it, whichever request that belonged to, so verifying the filtered trail
    // in isolation reports tampering on an untouched ledger the moment a second request exists.
    // What makes a trail trustworthy is the chain up to and including its last event.
    let lastIndex = -1;
    for (let index = 0; index < events.length; index += 1) {
      if (events[index].requestId === requestId) {
        lastIndex = index;
      }
    }

    return events.slice(0, lastIndex + 1);
  }

  async reset(): Promise<void> {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function normalizeLedgerEvent(event: LedgerEvent): LedgerEvent {
  return {
    schemaVersion: LEDGER_EVENT_SCHEMA_VERSION,
    eventType: "law544.transition",
    ...event,
  };
}
