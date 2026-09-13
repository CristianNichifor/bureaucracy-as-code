export type DocumentStorageProviderName = "indexeddb" | "memory" | "r2";

export type EncryptedDocumentEnvelope = {
  id: string;
  version: 1;
  ciphertextBase64: string;
  documentHash: string;
  storedAt: string;
  encryption: {
    algorithm: "AES-GCM";
    ivBase64: string;
    keyRef: string;
  };
};

export type StoredDocumentMetadata = {
  id: string;
  requestId?: string;
  name: string;
  type: string;
  size: number;
  hash: string;
  storedAt: string;
  provider: DocumentStorageProviderName;
};

export type StoreDocumentInput = {
  bytes: ArrayBuffer;
  name: string;
  type?: string;
  requestId?: string;
};

export type RetrievedDocument = {
  bytes: ArrayBuffer;
  metadata: StoredDocumentMetadata;
};

export type LedgerDocumentReference = {
  documentHash: string;
};

export interface DocumentStorageBackend {
  readonly provider: DocumentStorageProviderName;
  putEnvelope(envelope: EncryptedDocumentEnvelope): Promise<void>;
  getEnvelope(id: string): Promise<EncryptedDocumentEnvelope | undefined>;
  deleteEnvelope(id: string): Promise<void>;
}

export interface DocumentStorageProvider {
  putDocument(input: StoreDocumentInput): Promise<StoredDocumentMetadata>;
  getDocument(id: string): Promise<RetrievedDocument | undefined>;
  getMetadata(id: string): Promise<StoredDocumentMetadata | undefined>;
  deleteDocument(id: string): Promise<void>;
  hashBytes(bytes: ArrayBuffer): Promise<string>;
}
