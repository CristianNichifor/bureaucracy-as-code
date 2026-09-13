import type { DemoCredential } from "../identity/types";
import type { Law544Action, Law544Status } from "../law544/types";

export const LEDGER_EVENT_SCHEMA_VERSION = "law544-ledger-event/v1" as const;
export const LEDGER_HEAD_ANCHOR_SCHEMA_VERSION = "law544-ledger-head-anchor/v1" as const;

export type LedgerEventSchemaVersion = typeof LEDGER_EVENT_SCHEMA_VERSION;
export type LedgerHeadAnchorSchemaVersion = typeof LEDGER_HEAD_ANCHOR_SCHEMA_VERSION;

export type UnsignedTransition = {
  requestId: string;
  action: Law544Action;
  fromStatus: Law544Status;
  toStatus: Law544Status;
  payloadHash: string;
  documentHash?: string;
  signerDidHash: string;
  signerRole: DemoCredential["role"];
  credentialHash: string;
  signature: string;
  timestamp: string;
  metadata?: Record<string, string>;
};

export type LedgerEvent = UnsignedTransition & {
  schemaVersion?: LedgerEventSchemaVersion;
  eventType?: "law544.transition";
  index: number;
  previousStateHash: string;
  stateHash: string;
};

export type LedgerHeadAnchor = {
  schemaVersion: LedgerHeadAnchorSchemaVersion;
  anchorType: "ledger.head";
  ledgerProvider: "local-browser" | "local-ethereum";
  eventCount: number;
  headHash: string;
  anchoredAt: string;
  requestId?: string;
  anchorHash: string;
};

export type ChainVerificationResult = {
  valid: boolean;
  checkedEvents: number;
  firstInvalidEvent?: string;
  headHash?: string;
  expectedHeadHash?: string;
};

export interface LedgerProvider {
  appendTransition(event: UnsignedTransition): Promise<LedgerEvent>;
  listEvents(): Promise<LedgerEvent[]>;
  replaceEvents(events: LedgerEvent[]): Promise<void>;
  getRequestTrail(requestId: string): Promise<LedgerEvent[]>;
  getHeadAnchor(requestId?: string): Promise<LedgerHeadAnchor>;
  verifyChain(requestId?: string, anchor?: LedgerHeadAnchor): Promise<ChainVerificationResult>;
  reset(): Promise<void>;
}
