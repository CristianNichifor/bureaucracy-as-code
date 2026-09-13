import { hashJson } from "../shared/crypto";
import type { LedgerEvent, UnsignedTransition } from "./types";

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
    ...unsigned,
    stateHash: await hashJson(unsigned),
  };
}

export async function verifyLedgerEvents(events: LedgerEvent[]): Promise<string | null> {
  let previousHash = GENESIS_HASH;

  for (const event of events) {
    if (event.previousStateHash !== previousHash) {
      return event.stateHash;
    }

    const { stateHash, ...withoutStateHash } = event;
    void stateHash;
    const expectedHash = await hashJson(withoutStateHash);

    if (expectedHash !== event.stateHash) {
      return event.stateHash;
    }

    previousHash = event.stateHash;
  }

  return null;
}
