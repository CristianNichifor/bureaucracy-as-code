import { hashJson } from "../shared/crypto";
import {
  LEDGER_EVENT_SCHEMA_VERSION,
  LEDGER_HEAD_ANCHOR_SCHEMA_VERSION,
  type LedgerEvent,
  type LedgerHeadAnchor,
  type UnsignedTransition,
} from "./types";

export const GENESIS_HASH = "0".repeat(64);

export async function createLedgerEvent(input: {
  event: UnsignedTransition;
  previous?: LedgerEvent;
}): Promise<LedgerEvent> {
  const previousStateHash = input.previous?.stateHash ?? GENESIS_HASH;
  const index = (input.previous?.index ?? -1) + 1;
  const unsigned = {
    ...input.event,
    index,
    previousStateHash,
  };

  return {
    schemaVersion: LEDGER_EVENT_SCHEMA_VERSION,
    eventType: "law544.transition",
    ...unsigned,
    stateHash: await hashJson(unsigned),
  };
}

export async function verifyLedgerEvents(events: LedgerEvent[]): Promise<string | null> {
  let previousHash = GENESIS_HASH;

  for (const event of events) {
    if (event.schemaVersion && event.schemaVersion !== LEDGER_EVENT_SCHEMA_VERSION) {
      return event.stateHash;
    }

    if (event.eventType && event.eventType !== "law544.transition") {
      return event.stateHash;
    }

    if (event.previousStateHash !== previousHash) {
      return event.stateHash;
    }

    const { stateHash, ...withoutStateHash } = event;
    void stateHash;
    const { schemaVersion, eventType, ...hashPayload } = withoutStateHash;
    void schemaVersion;
    void eventType;
    const expectedHash = await hashJson(hashPayload);

    if (expectedHash !== event.stateHash) {
      return event.stateHash;
    }

    previousHash = event.stateHash;
  }

  return null;
}

export function getLedgerHeadHash(events: LedgerEvent[]): string {
  return events.at(-1)?.stateHash ?? GENESIS_HASH;
}

export async function createLedgerHeadAnchor(input: {
  events: LedgerEvent[];
  anchoredAt?: string;
  requestId?: string;
  ledgerProvider?: LedgerHeadAnchor["ledgerProvider"];
}): Promise<LedgerHeadAnchor> {
  const anchorPayload = {
    schemaVersion: LEDGER_HEAD_ANCHOR_SCHEMA_VERSION,
    anchorType: "ledger.head" as const,
    ledgerProvider: input.ledgerProvider ?? "local-browser",
    eventCount: input.events.length,
    headHash: getLedgerHeadHash(input.events),
    anchoredAt: input.anchoredAt ?? new Date().toISOString(),
    requestId: input.requestId,
  };

  return {
    ...anchorPayload,
    anchorHash: await hashJson(anchorPayload),
  };
}

export async function verifyLedgerHeadAnchor(input: {
  events: LedgerEvent[];
  anchor: LedgerHeadAnchor;
}): Promise<boolean> {
  const { anchorHash, ...anchorPayload } = input.anchor;

  if (input.anchor.schemaVersion !== LEDGER_HEAD_ANCHOR_SCHEMA_VERSION || input.anchor.anchorType !== "ledger.head") {
    return false;
  }

  if (input.anchor.eventCount !== input.events.length) {
    return false;
  }

  if (input.anchor.headHash !== getLedgerHeadHash(input.events)) {
    return false;
  }

  return (await hashJson(anchorPayload)) === anchorHash;
}
