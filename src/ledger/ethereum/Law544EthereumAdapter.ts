import {
  createLedgerEvent,
  createLedgerHeadAnchor,
  getLedgerHeadHash,
  verifyLedgerEvents,
  verifyLedgerHeadAnchor,
} from "../hashChain";
import type { ChainVerificationResult, LedgerEvent, LedgerHeadAnchor, LedgerProvider, UnsignedTransition } from "../types";
import { sha256Hex } from "../../shared/crypto";

const EMPTY_BYTES32 = `0x${"0".repeat(64)}` as const;

export type EthereumTransactionReceipt = {
  transactionHash: string;
  blockNumber?: number;
  logIndex?: number;
};

export type EthereumTransitionRecord = {
  requestIdHash: `0x${string}`;
  payloadHash: `0x${string}`;
  documentHash: `0x${string}`;
  signerDidHash: `0x${string}`;
  credentialHash: `0x${string}`;
  previousStateHash: `0x${string}`;
  stateHash: `0x${string}`;
  eventIndex: bigint;
  action: string;
  fromStatus: string;
  toStatus: string;
  signerRole: string;
  occurredAt: string;
  metadataUri: string;
};

export interface EthereumLedgerContractClient {
  appendTransition(record: EthereumTransitionRecord): Promise<EthereumTransactionReceipt>;
  listEvents(): Promise<LedgerEvent[]>;
}

export class Law544EthereumAdapter implements LedgerProvider {
  constructor(private readonly contract: EthereumLedgerContractClient) {}

  async appendTransition(event: UnsignedTransition): Promise<LedgerEvent> {
    const events = await this.listEvents();
    const next = await createLedgerEvent({
      event,
      previous: events.at(-1),
    });
    await this.contract.appendTransition(await toEthereumTransitionRecord(next));
    return next;
  }

  listEvents(): Promise<LedgerEvent[]> {
    return this.contract.listEvents();
  }

  async replaceEvents(events: LedgerEvent[]): Promise<void> {
    void events;
    throw new Error("Ethereum ledgers are append-only; replaceEvents is only available in the browser demo ledger.");
  }

  async getRequestTrail(requestId: string): Promise<LedgerEvent[]> {
    return (await this.listEvents()).filter((event) => event.requestId === requestId);
  }

  async getHeadAnchor(requestId?: string): Promise<LedgerHeadAnchor> {
    const events = await eventsForVerification(await this.listEvents(), requestId);
    return createLedgerHeadAnchor({
      events,
      requestId,
      ledgerProvider: "local-ethereum",
    });
  }

  async verifyChain(requestId?: string, anchor?: LedgerHeadAnchor): Promise<ChainVerificationResult> {
    const events = await eventsForVerification(await this.listEvents(), requestId);
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
    throw new Error("Ethereum ledgers are append-only; reset the local Hardhat node instead.");
  }
}

export async function toEthereumTransitionRecord(event: LedgerEvent): Promise<EthereumTransitionRecord> {
  return {
    requestIdHash: await stringToBytes32(event.requestId),
    payloadHash: hexHashToBytes32(event.payloadHash),
    documentHash: event.documentHash ? hexHashToBytes32(event.documentHash) : EMPTY_BYTES32,
    signerDidHash: hexHashToBytes32(event.signerDidHash),
    credentialHash: hexHashToBytes32(event.credentialHash),
    previousStateHash: hexHashToBytes32(event.previousStateHash),
    stateHash: hexHashToBytes32(event.stateHash),
    eventIndex: BigInt(event.index),
    action: event.action,
    fromStatus: event.fromStatus,
    toStatus: event.toStatus,
    signerRole: event.signerRole,
    occurredAt: event.timestamp,
    metadataUri: event.metadata?.uri ?? "",
  };
}

export function hexHashToBytes32(value: string): `0x${string}` {
  const normalized = value.startsWith("0x") ? value.slice(2) : value;

  if (!/^[a-fA-F0-9]{64}$/.test(normalized)) {
    throw new Error("Expected a 32-byte hex hash.");
  }

  return `0x${normalized.toLowerCase()}`;
}

async function stringToBytes32(value: string): Promise<`0x${string}`> {
  return hexHashToBytes32(await sha256Hex(value));
}

async function eventsForVerification(events: LedgerEvent[], requestId?: string): Promise<LedgerEvent[]> {
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
