import type { DemoRole } from "../../identity/types";
import type { Law544Action, Law544Status } from "../../law544/types";
import { hashJson } from "../../shared/crypto";
import { GENESIS_HASH } from "../hashChain";
import { LEDGER_HEAD_ANCHOR_SCHEMA_VERSION, type LedgerHeadAnchor } from "../types";

type Bytes32 = `0x${string}`;

export type ChainBlockRange = {
  fromBlock?: bigint;
  toBlock?: bigint;
};

export type Law544TransitionLog = {
  args: {
    eventIndex: bigint;
    requestIdHash: Bytes32;
    stateHash: Bytes32;
    previousStateHash: Bytes32;
    payloadHash: Bytes32;
    documentHash: Bytes32;
    signerDidHash: Bytes32;
    credentialHash: Bytes32;
    action: string;
    fromStatus: string;
    toStatus: string;
    signerRole: string;
    occurredAt: string;
    metadataUri: string;
  };
  blockNumber?: bigint;
  transactionHash?: Bytes32;
  logIndex?: number;
};

export interface Law544TransitionLogSource {
  getTransitionLogs(range?: ChainBlockRange): Promise<Law544TransitionLog[]>;
}

export type ViemLaw544LedgerContract = {
  getEvents: {
    TransitionRecorded: (
      filter?: Record<string, never>,
      range?: ChainBlockRange,
    ) => Promise<Law544TransitionLog[]>;
  };
};

export type IndexedLaw544Transition = {
  index: number;
  requestIdHash: string;
  stateHash: string;
  previousStateHash: string;
  payloadHash: string;
  documentHash?: string;
  signerDidHash: string;
  credentialHash: string;
  action: Law544Action;
  fromStatus: Law544Status;
  toStatus: Law544Status;
  signerRole: DemoRole;
  timestamp: string;
  metadataUri?: string;
  blockNumber?: string;
  transactionHash?: string;
  logIndex?: number;
};

export type PublicRequestProjection = {
  requestIdHash: string;
  status: Law544Status;
  eventCount: number;
  firstSeenAt: string;
  lastUpdatedAt: string;
  lastAction: Law544Action;
  lastSignerRole: DemoRole;
  responseDocumentHash?: string;
  currentStateHash: string;
};

export type ChainIndexSnapshot = {
  events: IndexedLaw544Transition[];
  projections: PublicRequestProjection[];
  headAnchor: LedgerHeadAnchor;
};

const EMPTY_BYTES32 = "0".repeat(64);

export class Law544EventIndexer {
  constructor(private readonly source: Law544TransitionLogSource) {}

  async index(range?: ChainBlockRange): Promise<ChainIndexSnapshot> {
    const events = normalizeTransitionLogs(await this.source.getTransitionLogs(range));

    return {
      events,
      projections: buildPublicRequestProjections(events),
      headAnchor: await createEthereumHeadAnchor(events),
    };
  }
}

export class ViemLaw544TransitionLogSource implements Law544TransitionLogSource {
  constructor(private readonly contract: ViemLaw544LedgerContract) {}

  getTransitionLogs(range?: ChainBlockRange): Promise<Law544TransitionLog[]> {
    return this.contract.getEvents.TransitionRecorded({}, range);
  }
}

export function normalizeTransitionLogs(logs: Law544TransitionLog[]): IndexedLaw544Transition[] {
  return logs.map(normalizeTransitionLog).sort((a, b) => a.index - b.index);
}

export function normalizeTransitionLog(log: Law544TransitionLog): IndexedLaw544Transition {
  return {
    index: Number(log.args.eventIndex),
    requestIdHash: stripBytes32(log.args.requestIdHash),
    stateHash: stripBytes32(log.args.stateHash),
    previousStateHash: stripBytes32(log.args.previousStateHash),
    payloadHash: stripBytes32(log.args.payloadHash),
    documentHash: optionalBytes32(log.args.documentHash),
    signerDidHash: stripBytes32(log.args.signerDidHash),
    credentialHash: stripBytes32(log.args.credentialHash),
    action: log.args.action as Law544Action,
    fromStatus: log.args.fromStatus as Law544Status,
    toStatus: log.args.toStatus as Law544Status,
    signerRole: log.args.signerRole as DemoRole,
    timestamp: log.args.occurredAt,
    metadataUri: log.args.metadataUri || undefined,
    blockNumber: log.blockNumber?.toString(),
    transactionHash: log.transactionHash,
    logIndex: log.logIndex,
  };
}

export function buildPublicRequestProjections(events: IndexedLaw544Transition[]): PublicRequestProjection[] {
  const projections = new Map<string, PublicRequestProjection>();

  for (const event of [...events].sort((a, b) => a.index - b.index)) {
    const existing = projections.get(event.requestIdHash);

    projections.set(event.requestIdHash, {
      requestIdHash: event.requestIdHash,
      status: event.toStatus,
      eventCount: (existing?.eventCount ?? 0) + 1,
      firstSeenAt: existing?.firstSeenAt ?? event.timestamp,
      lastUpdatedAt: event.timestamp,
      lastAction: event.action,
      lastSignerRole: event.signerRole,
      responseDocumentHash:
        event.action === "Request_Resolved" ? event.documentHash : existing?.responseDocumentHash,
      currentStateHash: event.stateHash,
    });
  }

  return [...projections.values()].sort((a, b) => a.lastUpdatedAt.localeCompare(b.lastUpdatedAt));
}

export async function createEthereumHeadAnchor(
  events: IndexedLaw544Transition[],
  anchoredAt = new Date().toISOString(),
): Promise<LedgerHeadAnchor> {
  const anchorPayload = {
    schemaVersion: LEDGER_HEAD_ANCHOR_SCHEMA_VERSION,
    anchorType: "ledger.head" as const,
    ledgerProvider: "local-ethereum" as const,
    eventCount: events.length,
    headHash: events.at(-1)?.stateHash ?? GENESIS_HASH,
    anchoredAt,
  };

  return {
    ...anchorPayload,
    anchorHash: await hashJson(anchorPayload),
  };
}

function optionalBytes32(value: Bytes32): string | undefined {
  const normalized = stripBytes32(value);
  return normalized === EMPTY_BYTES32 ? undefined : normalized;
}

function stripBytes32(value: Bytes32): string {
  const normalized = value.startsWith("0x") ? value.slice(2) : value;

  if (!/^[a-fA-F0-9]{64}$/.test(normalized)) {
    throw new Error("Expected a 32-byte hex value from Law544Ledger.");
  }

  return normalized.toLowerCase();
}
