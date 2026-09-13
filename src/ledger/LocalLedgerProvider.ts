import { createLedgerEvent, verifyLedgerEvents } from "./hashChain";
import type { ChainVerificationResult, LedgerEvent, LedgerProvider, UnsignedTransition } from "./types";

const STORAGE_KEY = "bureaucracy-as-code:ledger:v1";

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
    const events = requestId ? await this.getRequestTrail(requestId) : await this.listEvents();
    const firstInvalidEvent = await verifyLedgerEvents(events);

    return {
      valid: firstInvalidEvent === null,
      checkedEvents: events.length,
      firstInvalidEvent: firstInvalidEvent ?? undefined,
    };
  }

  async reset(): Promise<void> {
    localStorage.removeItem(STORAGE_KEY);
  }
}
