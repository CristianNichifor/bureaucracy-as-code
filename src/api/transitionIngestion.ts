import type { IdentityProvider } from "../identity/types";
import { assertAllowedTransition } from "../law544/stateMachine";
import type { Law544Request, TransitionRule } from "../law544/types";
import type { LedgerProvider } from "../ledger/types";
import { hashJson, sha256Hex } from "../shared/crypto";
import {
  ApiBoundaryError,
  apiTransitionPayloadSchema,
  createRequestInputSchema,
  type ApiTransitionPayload,
  type IngestTransitionCommand,
  type IngestTransitionResult,
  type RequestRepository,
} from "./types";

export const transitionPurpose = (payload: Pick<ApiTransitionPayload, "requestId" | "action">) =>
  `law544.transition:${payload.requestId}:${payload.action}`;

export class TransitionIngestionService {
  constructor(
    private readonly dependencies: {
      identity: IdentityProvider;
      ledger: LedgerProvider;
      requests: RequestRepository;
    },
  ) {}

  async ingest(command: IngestTransitionCommand): Promise<IngestTransitionResult> {
    const payload = parsePayload(command.payload);
    const request = await this.resolveCurrentRequest(command, payload);
    const rule = this.assertDomainTransition(command, request, payload);

    await this.assertPresentation(command, request, rule);
    await this.assertPayloadSignature(command, payload);

    const event = await this.dependencies.ledger.appendTransition({
      requestId: payload.requestId,
      action: payload.action,
      fromStatus: payload.fromStatus,
      toStatus: rule.to,
      payloadHash: command.proof.payloadHash,
      documentHash: payload.documentHash,
      signerDidHash: command.proof.signerDidHash,
      signerRole: command.presentation.credential.role,
      credentialHash: command.presentation.credentialHash,
      signature: command.proof.signature,
      timestamp: command.proof.signedAt,
      metadata: payload.metadata,
    });

    const updatedRequest = applyTransitionToRequest({
      request,
      payload,
      toStatus: rule.to,
    });
    await this.dependencies.requests.save(updatedRequest);

    return { event, request: updatedRequest };
  }

  private async resolveCurrentRequest(
    command: IngestTransitionCommand,
    payload: ApiTransitionPayload,
  ): Promise<Law544Request> {
    const existing = await this.dependencies.requests.get(payload.requestId);

    if (payload.action === "Request_Created") {
      if (existing) {
        throw new ApiBoundaryError("REQUEST_ALREADY_EXISTS", `Request ${payload.requestId} already exists.`);
      }

      if (!command.createRequest) {
        throw new ApiBoundaryError("REQUEST_NOT_FOUND", "Request_Created requires createRequest details.");
      }

      const createRequest = createRequestInputSchema.safeParse(command.createRequest);
      if (!createRequest.success) {
        throw new ApiBoundaryError("INVALID_COMMAND", createRequest.error.message);
      }

      if (createRequest.data.id !== payload.requestId) {
        throw new ApiBoundaryError("STATE_MISMATCH", "createRequest.id must match payload.requestId.");
      }

      return {
        ...createRequest.data,
        status: "Draft",
      };
    }

    if (!existing) {
      throw new ApiBoundaryError("REQUEST_NOT_FOUND", `Request ${payload.requestId} does not exist.`);
    }

    return existing;
  }

  private assertDomainTransition(
    command: IngestTransitionCommand,
    request: Law544Request,
    payload: ApiTransitionPayload,
  ) {
    if (request.status !== payload.fromStatus) {
      throw new ApiBoundaryError(
        "STATE_MISMATCH",
        `Payload starts from ${payload.fromStatus}, but request is ${request.status}.`,
      );
    }

    try {
      const rule = assertAllowedTransition({
        request,
        action: payload.action,
        actor: {
          did: command.presentation.subjectDid,
          displayName: "Presented actor",
          role: command.presentation.credential.role,
          institution: command.presentation.credential.institution,
          publicKeyJwk: command.presentation.publicKeyJwk,
          privateKey: {} as CryptoKey,
          credential: command.presentation.credential,
          credentialHash: command.presentation.credentialHash,
        },
        documentHash: payload.documentHash,
      });

      if (payload.toStatus !== rule.to) {
        throw new ApiBoundaryError("STATE_MISMATCH", `Payload target must be ${rule.to}.`);
      }

      return rule;
    } catch (error) {
      if (error instanceof ApiBoundaryError) {
        throw error;
      }
      throw new ApiBoundaryError("TRANSITION_REJECTED", error instanceof Error ? error.message : "Rejected.");
    }
  }

  private async assertPresentation(
    command: IngestTransitionCommand,
    request: Law544Request,
    rule: TransitionRule,
  ): Promise<void> {
    const requiresInstitution = command.presentation.credential.role === "Citizen" ? undefined : request.institution;
    const verified = await this.dependencies.identity.verifyPresentation({
      presentation: command.presentation,
      requiredRole: rule.allowedRoles[0],
      requiredInstitution: requiresInstitution,
      purpose: transitionPurpose(command.payload),
    });

    if (!verified.valid) {
      throw new ApiBoundaryError("PRESENTATION_REJECTED", verified.reason ?? "Credential presentation is invalid.");
    }
  }

  private async assertPayloadSignature(
    command: IngestTransitionCommand,
    payload: ApiTransitionPayload,
  ): Promise<void> {
    const expectedHash = await hashJson(payload);
    const expectedSignerHash = await sha256Hex(command.presentation.subjectDid);

    if (
      command.proof.signerDid !== command.presentation.subjectDid ||
      command.proof.signerDidHash !== expectedSignerHash ||
      command.proof.payloadHash !== expectedHash
    ) {
      throw new ApiBoundaryError("SIGNATURE_REJECTED", "Signed payload metadata does not match the command.");
    }

    const valid = await this.dependencies.identity.verifySignature({
      publicKeyJwk: command.presentation.publicKeyJwk,
      payloadHash: command.proof.payloadHash,
      signature: command.proof.signature,
    });

    if (!valid) {
      throw new ApiBoundaryError("SIGNATURE_REJECTED", "Payload signature is invalid.");
    }
  }
}

function parsePayload(payload: ApiTransitionPayload): ApiTransitionPayload {
  const result = apiTransitionPayloadSchema.safeParse(payload);
  if (!result.success) {
    throw new ApiBoundaryError("INVALID_COMMAND", result.error.message);
  }
  return result.data;
}

function applyTransitionToRequest(input: {
  request: Law544Request;
  payload: ApiTransitionPayload;
  toStatus: Law544Request["status"];
}): Law544Request {
  return {
    ...input.request,
    status: input.toStatus,
    registryNumber: input.payload.metadata?.registryNumber ?? input.request.registryNumber,
    assignedToDidHash: input.payload.metadata?.assignedToDidHash ?? input.request.assignedToDidHash,
    responseDocumentHash:
      input.payload.action === "Request_Resolved" || input.payload.action === "Request_Rejected"
        ? input.payload.documentHash
        : input.request.responseDocumentHash,
  };
}
