import { fromBase64, sha256Hex, toArrayBuffer, toBase64 } from "../shared/crypto";
import type {
  DocumentStorageBackend,
  DocumentStorageProvider,
  LedgerDocumentReference,
  RetrievedDocument,
  StoreDocumentInput,
  StoredDocumentMetadata,
} from "./types";

const DEFAULT_TYPE = "application/octet-stream";

type EncryptedPayload = {
  bytesBase64: string;
  metadata: StoredDocumentMetadata;
};

export async function createAesGcmStorageKey(): Promise<CryptoKey> {
  return crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);
}

export function toLedgerDocumentReference(
  metadata: Pick<StoredDocumentMetadata, "hash">,
): LedgerDocumentReference {
  return { documentHash: metadata.hash };
}

export class EncryptedDocumentStore implements DocumentStorageProvider {
  constructor(
    private readonly backend: DocumentStorageBackend,
    private readonly key: CryptoKey,
    private readonly keyRef = "local-demo-key",
  ) {}

  async putDocument(input: StoreDocumentInput): Promise<StoredDocumentMetadata> {
    const id = crypto.randomUUID();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const metadata: StoredDocumentMetadata = {
      id,
      requestId: input.requestId,
      name: input.name,
      type: input.type || DEFAULT_TYPE,
      size: input.bytes.byteLength,
      hash: await this.hashBytes(input.bytes),
      storedAt: new Date().toISOString(),
      provider: this.backend.provider,
    };
    const payload: EncryptedPayload = {
      bytesBase64: toBase64(input.bytes),
      metadata,
    };
    const ciphertext = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      this.key,
      new TextEncoder().encode(JSON.stringify(payload)),
    );

    await this.backend.putEnvelope({
      id,
      version: 1,
      ciphertextBase64: toBase64(ciphertext),
      documentHash: metadata.hash,
      storedAt: metadata.storedAt,
      encryption: {
        algorithm: "AES-GCM",
        ivBase64: toBase64(toArrayBuffer(iv)),
        keyRef: this.keyRef,
      },
    });

    return metadata;
  }

  async getDocument(id: string): Promise<RetrievedDocument | undefined> {
    const envelope = await this.backend.getEnvelope(id);
    if (!envelope) {
      return undefined;
    }

    const bytes = await crypto.subtle.decrypt(
      { name: envelope.encryption.algorithm, iv: toArrayBuffer(fromBase64(envelope.encryption.ivBase64)) },
      this.key,
      toArrayBuffer(fromBase64(envelope.ciphertextBase64)),
    );
    const payload = JSON.parse(new TextDecoder().decode(bytes)) as EncryptedPayload;
    const documentBytes = toArrayBuffer(fromBase64(payload.bytesBase64));

    const actualHash = await this.hashBytes(documentBytes);
    if (actualHash !== envelope.documentHash || actualHash !== payload.metadata.hash) {
      throw new Error("Stored document hash does not match decrypted bytes.");
    }

    return { bytes: documentBytes, metadata: payload.metadata };
  }

  async getMetadata(id: string): Promise<StoredDocumentMetadata | undefined> {
    return (await this.getDocument(id))?.metadata;
  }

  async deleteDocument(id: string): Promise<void> {
    await this.backend.deleteEnvelope(id);
  }

  async hashBytes(bytes: ArrayBuffer): Promise<string> {
    return sha256Hex(bytes);
  }
}
