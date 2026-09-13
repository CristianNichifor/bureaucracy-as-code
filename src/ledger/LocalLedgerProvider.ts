import { createLedgerEvent, verifyLedgerEvents } from "./hashChain";
import type { ChainVerificationResult, LedgerEvent, LedgerProvider, UnsignedTransition } from "./types";

export const STORAGE_KEY = "bureaucracy-as-code:ledger:v1";

function result(firstInvalidEvent: string | null, checkedEvents: number): ChainVerificationResult {
  return {
    valid: firstInvalidEvent === null,
    checkedEvents,
    firstInvalidEvent: firstInvalidEvent ?? undefined,
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

  async getRequestTrail(requestId: string): Promise<LedgerEvent[]> {
    return (await this.listEvents()).filter((event) => event.requestId === requestId);
  }

  async verifyChain(requestId?: string): Promise<ChainVerificationResult> {
    const events = await this.listEvents();

    if (!requestId) {
      return result(await verifyLedgerEvents(events), events.length);
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

    const upToTrail = events.slice(0, lastIndex + 1);
    const trailLength = upToTrail.filter((event) => event.requestId === requestId).length;

    return result(await verifyLedgerEvents(upToTrail), trailLength);
  }

  async reset(): Promise<void> {
    localStorage.removeItem(STORAGE_KEY);
  }
}
