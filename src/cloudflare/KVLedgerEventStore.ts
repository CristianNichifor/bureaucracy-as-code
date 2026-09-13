import {
  createLedgerHeadAnchor,
  getLedgerHeadHash,
  verifyLedgerEvents,
  verifyLedgerHeadAnchor,
} from "../ledger/hashChain";
import type { ChainVerificationResult, LedgerEvent, LedgerHeadAnchor } from "../ledger/types";
import type { KVNamespaceLike } from "./bindings";

const EVENT_PREFIX = "ledger:event:";
const REQUEST_PREFIX = "ledger:request:";
const HEAD_KEY = "ledger:head";

export class KVLedgerEventStore {
  constructor(private readonly kv: KVNamespaceLike) {}

  async append(event: LedgerEvent): Promise<void> {
    const eventKey = keyForEvent(event.index);
    const existing = await this.kv.get(eventKey);
    if (existing) {
      throw new Error(`Ledger event index ${event.index} already exists.`);
    }

    await this.kv.put(eventKey, JSON.stringify(event), {
      metadata: {
        requestId: event.requestId,
        stateHash: event.stateHash,
        action: event.action,
      },
    });

    await this.kv.put(keyForRequestEvent(event.requestId, event.index), String(event.index));
    await this.kv.put(HEAD_KEY, JSON.stringify({ index: event.index, stateHash: event.stateHash }));
  }

  async listEvents(): Promise<LedgerEvent[]> {
    const keys = await listAllKeys(this.kv, EVENT_PREFIX);
    const events = await Promise.all(
      keys.map(async (key) => {
        const raw = await this.kv.get(key);
        return raw ? (JSON.parse(raw) as LedgerEvent) : undefined;
      }),
    );

    return events
      .filter((event): event is LedgerEvent => event !== undefined)
      .sort((left, right) => left.index - right.index);
  }

  async getRequestTrail(requestId: string): Promise<LedgerEvent[]> {
    const keys = await listAllKeys(this.kv, `${REQUEST_PREFIX}${requestId}:`);
    const indexes = await Promise.all(keys.map((key) => this.kv.get(key)));
    const events = await Promise.all(
      indexes
        .filter((index): index is string => index !== null)
        .map(async (index) => {
          const raw = await this.kv.get(keyForEvent(Number(index)));
          return raw ? (JSON.parse(raw) as LedgerEvent) : undefined;
        }),
    );

    return events
      .filter((event): event is LedgerEvent => event !== undefined)
      .sort((left, right) => left.index - right.index);
  }

  async getHeadAnchor(requestId?: string): Promise<LedgerHeadAnchor> {
    const events = await this.eventsForVerification(requestId);
    return createLedgerHeadAnchor({
      events,
      requestId,
      ledgerProvider: "local-browser",
    });
  }

  async verify(requestId?: string, anchor?: LedgerHeadAnchor): Promise<ChainVerificationResult> {
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

  private async eventsForVerification(requestId?: string): Promise<LedgerEvent[]> {
    const events = await this.listEvents();
    if (!requestId) {
      return events;
    }

    let lastIndex = -1;
    for (let index = 0; index < events.length; index += 1) {
      if (events[index].requestId === requestId) {
        lastIndex = index;
      }
    }

    return events.slice(0, lastIndex + 1);
  }
}

async function listAllKeys(kv: KVNamespaceLike, prefix: string): Promise<string[]> {
  const keys: string[] = [];
  let cursor: string | undefined;

  do {
    const page = await kv.list({ prefix, cursor });
    keys.push(...page.keys.map((key) => key.name));
    cursor = page.list_complete ? undefined : page.cursor;
  } while (cursor);

  return keys;
}

function keyForEvent(index: number): string {
  return `${EVENT_PREFIX}${String(index).padStart(12, "0")}`;
}

function keyForRequestEvent(requestId: string, index: number): string {
  return `${REQUEST_PREFIX}${requestId}:${String(index).padStart(12, "0")}`;
}

