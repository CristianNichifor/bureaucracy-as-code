import { InMemoryRequestRepository } from "../api/InMemoryRequestRepository";
import { TransitionIngestionService, transitionPurpose } from "../api/transitionIngestion";
import type { RequestRepository } from "../api/types";
import { BrowserIdentityProvider } from "../identity/BrowserIdentityProvider";
import type { DemoIdentity, IdentityProvider } from "../identity/types";
import { findTransitionRule } from "../law544/transitions";
import type { Law544Action, Law544Request } from "../law544/types";
import { LocalLedgerProvider } from "../ledger/LocalLedgerProvider";
import type { ChainVerificationResult, LedgerEvent, LedgerProvider } from "../ledger/types";
import { EncryptedDocumentStore, createAesGcmStorageKey, toLedgerDocumentReference } from "../storage/EncryptedDocumentStore";
import { IndexedDbDocumentStore } from "../storage/IndexedDbDocumentStore";
import { InMemoryDocumentStorageBackend } from "../storage/InMemoryDocumentStorageBackend";
import type { DocumentStorageProvider, StoredDocumentMetadata } from "../storage/types";
import { createInitialDemoContext, type DemoContext } from "./scenarioLaw544";

const textEncoder = new TextEncoder();

export type DemoRuntimeTransitionInput = {
  request: Law544Request;
  actor: DemoIdentity;
  action: Law544Action;
  metadata?: Record<string, string>;
  document?: {
    name: string;
    type?: string;
    bytes?: ArrayBuffer;
  };
};

export type DemoRuntimeTransitionResult = {
  request: Law544Request;
  event: LedgerEvent;
  document?: StoredDocumentMetadata;
};

export type DemoRuntimeDependencies = {
  identity: IdentityProvider;
  ledger: LedgerProvider;
  requests: RequestRepository;
  documents: DocumentStorageProvider;
};

export class DemoRuntime {
  readonly ingestion: TransitionIngestionService;

  constructor(readonly dependencies: DemoRuntimeDependencies) {
    this.ingestion = new TransitionIngestionService({
      identity: dependencies.identity,
      ledger: dependencies.ledger,
      requests: dependencies.requests,
    });
  }

  get identity() {
    return this.dependencies.identity;
  }

  get ledger() {
    return this.dependencies.ledger;
  }

  get requests() {
    return this.dependencies.requests;
  }

  get documents() {
    return this.dependencies.documents;
  }

  async reset(): Promise<DemoContext> {
    await this.ledger.reset();
    const context = await createInitialDemoContext(this.identity);
    return context;
  }

  async saveRequest(request: Law544Request): Promise<void> {
    await this.requests.save(request);
  }

  async listEvents(): Promise<LedgerEvent[]> {
    return this.ledger.listEvents();
  }

  async verifyChain(): Promise<ChainVerificationResult> {
    return this.ledger.verifyChain();
  }

  async applyTransition(input: DemoRuntimeTransitionInput): Promise<DemoRuntimeTransitionResult> {
    const rule = findTransitionRule({ action: input.action, from: input.request.status });
    if (!rule) {
      throw new Error(`Action ${input.action} is not allowed from ${input.request.status}.`);
    }

    const document = input.document
      ? await this.documents.putDocument({
          bytes: input.document.bytes ?? createDemoDocumentBytes(input.document.name),
          name: input.document.name,
          type: input.document.type,
          requestId: input.request.id,
        })
      : undefined;
    const documentHash = document ? toLedgerDocumentReference(document).documentHash : undefined;
    const payload = {
      requestId: input.request.id,
      action: input.action,
      fromStatus: input.request.status,
      toStatus: rule.to,
      documentHash,
      metadata: input.metadata,
    };
    const proof = await this.identity.signPayload(input.actor, payload);
    const presentation = await this.identity.presentCredential({
      identity: input.actor,
      purpose: transitionPurpose(payload),
    });
    const result = await this.ingestion.ingest({
      payload,
      proof,
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

    return { ...result, document };
  }
}

export function createBrowserDemoRuntime(): DemoRuntime {
  return new DemoRuntime({
    identity: new BrowserIdentityProvider(),
    ledger: new LocalLedgerProvider(),
    requests: new InMemoryRequestRepository(),
    documents: new IndexedDbDocumentStore(),
  });
}

export async function createMemoryDemoRuntime(overrides: Partial<DemoRuntimeDependencies> = {}): Promise<DemoRuntime> {
  return new DemoRuntime({
    identity: overrides.identity ?? new BrowserIdentityProvider(),
    ledger: overrides.ledger ?? new LocalLedgerProvider(),
    requests: overrides.requests ?? new InMemoryRequestRepository(),
    documents:
      overrides.documents ??
      new EncryptedDocumentStore(new InMemoryDocumentStorageBackend(), await createAesGcmStorageKey()),
  });
}

export function createDemoDocumentBytes(label: string): ArrayBuffer {
  const bytes = textEncoder.encode(
    JSON.stringify({
      label,
      generatedAt: new Date().toISOString(),
    }),
  );
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
}
