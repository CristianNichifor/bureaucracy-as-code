import type { DemoIdentity, IdentityProvider } from "../identity/types";
import { InMemoryRequestRepository } from "../api/InMemoryRequestRepository";
import { TransitionIngestionService, transitionPurpose } from "../api/transitionIngestion";
import { calculateLaw544Deadline } from "../law544/deadlines";
import { assertAllowedTransition } from "../law544/stateMachine";
import { findTransitionRule } from "../law544/transitions";
import type { Law544Action, Law544Request } from "../law544/types";
import type { LedgerProvider } from "../ledger/types";
import { hashJson, sha256Hex } from "../shared/crypto";
import { BrowserIdentityProvider } from "../identity/BrowserIdentityProvider";

export type DemoContext = {
  identities: {
    citizen: DemoIdentity;
    registryBot: DemoIdentity;
    director: DemoIdentity;
    publicServant: DemoIdentity;
  };
  request: Law544Request;
};

export async function createInitialDemoContext(provider: IdentityProvider = new BrowserIdentityProvider()): Promise<DemoContext> {
  const citizen = await provider.createIdentity({ displayName: "Citizen Demo", role: "Citizen" });
  const registryBot = await provider.createIdentity({
    displayName: "Registry Bot",
    role: "RegistryBot",
    institution: "Ministry of Finance",
  });
  const director = await provider.createIdentity({
    displayName: "Director Demo",
    role: "Director",
    institution: "Ministry of Finance",
  });
  const publicServant = await provider.createIdentity({
    displayName: "Public Servant Demo",
    role: "PublicServant",
    institution: "Ministry of Finance",
  });
  const createdAt = new Date().toISOString();

  return {
    identities: { citizen, registryBot, director, publicServant },
    request: {
      id: `REQ-${new Date().getFullYear()}-${crypto.randomUUID().slice(0, 8)}`,
      institution: "Ministry of Finance",
      subject: "Public spending data for a demo program",
      citizenDidHash: await sha256Hex(citizen.did),
      status: "Draft",
      createdAt,
      deadlineAt: calculateLaw544Deadline(createdAt),
    },
  };
}

export async function applyDemoAction(input: {
  provider: BrowserIdentityProvider;
  ledger: LedgerProvider;
  request: Law544Request;
  actor: DemoIdentity;
  action: Law544Action;
  documentHash?: string;
  metadata?: Record<string, string>;
}): Promise<Law544Request> {
  const rule = assertAllowedTransition(input);
  const payload = {
    requestId: input.request.id,
    action: input.action,
    fromStatus: input.request.status,
    toStatus: rule.to,
    documentHash: input.documentHash,
    metadata: input.metadata,
  };
  const signed = await input.provider.signPayload(input.actor, payload);

  await input.ledger.appendTransition({
    requestId: input.request.id,
    action: input.action,
    fromStatus: input.request.status,
    toStatus: rule.to,
    payloadHash: signed.payloadHash,
    documentHash: input.documentHash,
    signerDidHash: signed.signerDidHash,
    signerRole: input.actor.role,
    credentialHash: input.actor.credentialHash,
    signature: signed.signature,
    timestamp: signed.signedAt,
    metadata: input.metadata,
  });

  return {
    ...input.request,
    status: rule.to,
    registryNumber: input.metadata?.registryNumber ?? input.request.registryNumber,
    assignedToDidHash: input.metadata?.assignedToDidHash ?? input.request.assignedToDidHash,
    responseDocumentHash: input.documentHash ?? input.request.responseDocumentHash,
  };
}

export async function applyDemoActionViaIngestion(input: {
  provider: BrowserIdentityProvider;
  ledger: LedgerProvider;
  request: Law544Request;
  actor: DemoIdentity;
  action: Law544Action;
  documentHash?: string;
  metadata?: Record<string, string>;
}): Promise<Law544Request> {
  const rule = findTransitionRule({ action: input.action, from: input.request.status });
  if (!rule) {
    throw new Error(`Action ${input.action} is not allowed from ${input.request.status}.`);
  }

  const payload = {
    requestId: input.request.id,
    action: input.action,
    fromStatus: input.request.status,
    toStatus: rule.to,
    documentHash: input.documentHash,
    metadata: input.metadata,
  };
  const requests = new InMemoryRequestRepository(input.action === "Request_Created" ? [] : [input.request]);
  const service = new TransitionIngestionService({
    identity: input.provider,
    ledger: input.ledger,
    requests,
  });
  const presentation = await input.provider.presentCredential({
    identity: input.actor,
    purpose: transitionPurpose(payload),
  });
  const result = await service.ingest({
    payload,
    proof: await input.provider.signPayload(input.actor, payload),
    presentation,
    createRequest:
      input.action === "Request_Created"
        ? {
            id: input.request.id,
            institution: input.request.institution,
            subject: input.request.subject,
            citizenDidHash: input.request.citizenDidHash,
            createdAt: input.request.createdAt,
            deadlineAt: input.request.deadlineAt,
          }
        : undefined,
  });

  return result.request;
}

export async function createDemoDocumentHash(label: string): Promise<string> {
  return hashJson({
    label,
    generatedAt: new Date().toISOString(),
  });
}
