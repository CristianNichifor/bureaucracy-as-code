import type { DocumentStorageBackend, EncryptedDocumentEnvelope } from "./types";

export class InMemoryDocumentStorageBackend implements DocumentStorageBackend {
  readonly provider = "memory" as const;
  readonly envelopes = new Map<string, EncryptedDocumentEnvelope>();

  async putEnvelope(envelope: EncryptedDocumentEnvelope): Promise<void> {
    this.envelopes.set(envelope.id, structuredClone(envelope));
  }

  async getEnvelope(id: string): Promise<EncryptedDocumentEnvelope | undefined> {
    const envelope = this.envelopes.get(id);
    return envelope ? structuredClone(envelope) : undefined;
  }

  async deleteEnvelope(id: string): Promise<void> {
    this.envelopes.delete(id);
  }
}

