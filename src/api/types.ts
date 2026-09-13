import { z } from "zod";
import type { CredentialPresentation, SignedPayload } from "../identity/types";
import type { Law544Action, Law544Request, Law544Status } from "../law544/types";
import type { LedgerEvent } from "../ledger/types";

export const LAW_544_ACTIONS = [
  "Request_Created",
  "Registry_Assigned",
  "Task_Routed",
  "Processing_Started",
  "Extension_Requested",
  "Document_Attached",
  "Request_Resolved",
  "Request_Rejected",
  "Request_Marked_Overdue",
] as const satisfies readonly Law544Action[];

export const LAW_544_STATUSES = [
  "Draft",
  "Created",
  "Registered",
  "Routed",
  "InProgress",
  "ExtensionRequested",
  "Resolved",
  "Rejected",
  "Overdue",
] as const satisfies readonly Law544Status[];

export const apiTransitionPayloadSchema = z.object({
  requestId: z.string().min(1),
  action: z.enum(LAW_544_ACTIONS),
  fromStatus: z.enum(LAW_544_STATUSES),
  toStatus: z.enum(LAW_544_STATUSES),
  documentHash: z.string().length(64).optional(),
  metadata: z.record(z.string(), z.string()).optional(),
});

export const createRequestInputSchema = z.object({
  id: z.string().min(1),
  institution: z.string().min(1),
  subject: z.string().min(1),
  citizenDidHash: z.string().length(64),
  createdAt: z.string().datetime(),
  deadlineAt: z.string().datetime(),
});

export type ApiTransitionPayload = z.infer<typeof apiTransitionPayloadSchema>;
export type CreateRequestInput = z.infer<typeof createRequestInputSchema>;

export type IngestTransitionCommand = {
  payload: ApiTransitionPayload;
  proof: SignedPayload;
  presentation: CredentialPresentation;
  createRequest?: CreateRequestInput;
};

export type IngestTransitionResult = {
  event: LedgerEvent;
  request: Law544Request;
};

export type ApiErrorCode =
  | "INVALID_COMMAND"
  | "REQUEST_NOT_FOUND"
  | "REQUEST_ALREADY_EXISTS"
  | "STATE_MISMATCH"
  | "TRANSITION_REJECTED"
  | "PRESENTATION_REJECTED"
  | "SIGNATURE_REJECTED";

export class ApiBoundaryError extends Error {
  constructor(
    readonly code: ApiErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "ApiBoundaryError";
  }
}

export interface RequestRepository {
  get(requestId: string): Promise<Law544Request | undefined>;
  save(request: Law544Request): Promise<void>;
  list(): Promise<Law544Request[]>;
}
