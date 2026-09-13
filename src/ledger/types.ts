import type { DemoCredential } from "../identity/types";
import type { Law544Action, Law544Status } from "../law544/types";

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
  index: number;
  previousStateHash: string;
  stateHash: string;
};

export type ChainVerificationResult = {
  valid: boolean;
  checkedEvents: number;
  firstInvalidEvent?: string;
};

export interface LedgerProvider {
  appendTransition(event: UnsignedTransition): Promise<LedgerEvent>;
  listEvents(): Promise<LedgerEvent[]>;
  replaceEvents(events: LedgerEvent[]): Promise<void>;
  getRequestTrail(requestId: string): Promise<LedgerEvent[]>;
  verifyChain(requestId?: string): Promise<ChainVerificationResult>;
  reset(): Promise<void>;
}
