import type { IdentityProvider } from "../identity/types";
import { assertAllowedTransition } from "../law544/stateMachine";
import type { Law544Request, TransitionRule } from "../law544/types";
import type { LedgerProvider } from "../ledger/types";
import { hashJson, sha256Hex } from "../shared/crypto";
import { InMemoryNonceStore } from "./InMemoryNonceStore";
import {
  ApiBoundaryError,
  CANONICAL_SIGNING_ENVELOPE_VERSION,
  apiTransitionPayloadSchema,
  canonicalSigningEnvelopeSchema,
  createRequestInputSchema,
  type ApiTransitionPayload,
  type CanonicalSigningEnvelope,
  type IngestTransitionCommand,
  type IngestTransitionResult,
  type NonceStore,
  type RequestRepository,
} from "./types";

export const transitionPurpose = (payload: Pick<ApiTransitionPayload, "requestId" | "action">) =>
  `law544.transition:${payload.requestId}:${payload.action}`;

export class TransitionIngestionService {
  private readonly nonces: NonceStore;

  constructor(
    private readonly dependencies: {
      identity: IdentityProvider;
      ledger: LedgerProvider;
      requests: RequestRepository;
      nonces?: NonceStore;
    },
  ) {
    this.nonces = dependencies.nonces ?? new InMemoryNonceStore();
  }

  async ingest(command: IngestTransitionCommand): Promise<IngestTransitionResult> {
    const payload = parsePayload(command.payload);
    const envelope = parseEnvelope(command.envelope);
    await this.assertEnvelopeSignature(command, payload, envelope);
    await this.assertFreshNonce(command, envelope);

    const request = await this.resolveCurrentRequest(command, payload);
    const rule = this.assertDomainTransition(command, request, payload);

    await this.assertPresentation(command, request, rule);

    const event = await this.dependencies.ledger.appendTransition({
      requestId: payload.requestId,
      action: payload.action,
      fromStatus: payload.fromStatus,
      toStatus: rule.to,
      payloadHash: envelope.payloadHash,
      documentHash: payload.documentHash,
      signerDidHash: command.proof.signerDidHash,
      signerRole: command.presentation.credential.role,
      credentialHash: command.presentation.credentialHash,
      signature: command.proof.signature,
      timestamp: envelope.signedAt,
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

  private async assertEnvelopeSignature(
    command: IngestTransitionCommand,
    payload: ApiTransitionPayload,
    envelope: CanonicalSigningEnvelope,
  ): Promise<void> {
    const expectedPayloadHash = await hashJson(payload);
    const expectedEnvelopeHash = await hashJson(envelope);
    const expectedSignerHash = await sha256Hex(command.presentation.subjectDid);

    if (
      command.proof.signerDid !== command.presentation.subjectDid ||
      command.proof.signerDidHash !== expectedSignerHash ||
      command.proof.payloadHash !== expectedEnvelopeHash ||
      envelope.payloadHash !== expectedPayloadHash ||
      envelope.requestId !== payload.requestId ||
      envelope.action !== payload.action ||
      envelope.purpose !== transitionPurpose(payload)
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

  private async assertFreshNonce(
    command: IngestTransitionCommand,
    envelope: CanonicalSigningEnvelope,
  ): Promise<void> {
    const nonce = { signerDidHash: command.proof.signerDidHash, nonce: envelope.nonce };
    if (await this.nonces.has(nonce)) {
      throw new ApiBoundaryError("REPLAY_REJECTED", "Signing envelope nonce was already used by this signer.");
    }
    await this.nonces.remember({ ...nonce, signedAt: envelope.signedAt });
  }
}

function parsePayload(payload: ApiTransitionPayload): ApiTransitionPayload {
  const result = apiTransitionPayloadSchema.safeParse(payload);
  if (!result.success) {
    throw new ApiBoundaryError("INVALID_COMMAND", result.error.message);
  }
  return result.data;
}

function parseEnvelope(envelope: CanonicalSigningEnvelope): CanonicalSigningEnvelope {
  const result = canonicalSigningEnvelopeSchema.safeParse(envelope);
  if (!result.success) {
    throw new ApiBoundaryError("INVALID_COMMAND", result.error.message);
  }
  return result.data;
}

export async function createCanonicalSigningEnvelope(
  payload: ApiTransitionPayload,
  options: { nonce?: string; signedAt?: string } = {},
): Promise<CanonicalSigningEnvelope> {
  return {
    schemaVersion: CANONICAL_SIGNING_ENVELOPE_VERSION,
    context: "law544.transition",
    requestId: payload.requestId,
    action: payload.action,
    purpose: transitionPurpose(payload),
    payloadHash: await hashJson(payload),
    nonce: options.nonce ?? crypto.randomUUID(),
    signedAt: options.signedAt ?? new Date().toISOString(),
  };
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
