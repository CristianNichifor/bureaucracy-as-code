import { describe, expect, it } from "vitest";
import {
  EncryptedDocumentStore,
  createAesGcmStorageKey,
  toLedgerDocumentReference,
} from "./EncryptedDocumentStore";
import { InMemoryDocumentStorageBackend } from "./InMemoryDocumentStorageBackend";
import { R2DocumentStorageBackend, type R2BucketLike } from "./R2DocumentStorageBackend";

function bytes(value: string): ArrayBuffer {
  return new TextEncoder().encode(value).buffer as ArrayBuffer;
}

async function text(value: ArrayBuffer): Promise<string> {
  return new TextDecoder().decode(value);
}

async function demoStore() {
  const backend = new InMemoryDocumentStorageBackend();
  const store = new EncryptedDocumentStore(backend, await createAesGcmStorageKey(), "test-key");
  return { backend, store };
}

describe("EncryptedDocumentStore", () => {
  it("stores encrypted bytes and returns metadata with the plaintext hash", async () => {
    const { backend, store } = await demoStore();
    const metadata = await store.putDocument({
      bytes: bytes("response content for integrity verification"),
      name: "response.pdf",
      type: "application/pdf",
      requestId: "REQ-2026-0001",
    });

    const envelope = await backend.getEnvelope(metadata.id);
    expect(envelope?.ciphertextBase64).not.toContain("response content");
    expect(JSON.stringify(envelope)).not.toContain("response.pdf");
    expect(JSON.stringify(envelope)).not.toContain("REQ-2026-0001");
    expect(envelope?.documentHash).toBe(metadata.hash);

    const restored = await store.getDocument(metadata.id);
    expect(restored?.metadata).toMatchObject({
      hash: metadata.hash,
      name: "response.pdf",
      provider: "memory",
      requestId: "REQ-2026-0001",
      type: "application/pdf",
    });
    expect(await text(restored!.bytes)).toBe("response content for integrity verification");
  });

  it("exposes only the document hash for ledger recording", async () => {
    const { store } = await demoStore();
    const metadata = await store.putDocument({
      bytes: bytes("off-chain file"),
      name: "internal-response.pdf",
    });

    expect(toLedgerDocumentReference(metadata)).toEqual({ documentHash: metadata.hash });
    expect(JSON.stringify(toLedgerDocumentReference(metadata))).not.toContain("internal-response");
  });

  it("rejects ciphertext that was changed after storage", async () => {
    const { backend, store } = await demoStore();
    const metadata = await store.putDocument({ bytes: bytes("sealed file"), name: "sealed.txt" });
    const envelope = await backend.getEnvelope(metadata.id);
    expect(envelope).toBeDefined();

    await backend.putEnvelope({
      ...envelope!,
      ciphertextBase64: `${envelope!.ciphertextBase64.slice(0, -2)}aa`,
    });

    await expect(store.getDocument(metadata.id)).rejects.toThrow();
  });
});

describe("R2DocumentStorageBackend", () => {
  it("stores encrypted envelopes under a stable prefix with hash-only object metadata", async () => {
    const objects = new Map<string, string>();
    const metadata = new Map<string, Record<string, string>>();
    const bucket: R2BucketLike = {
      async put(key, value, options) {
        objects.set(key, value);
        metadata.set(key, options?.customMetadata ?? {});
      },
      async get(key) {
        const value = objects.get(key);
        return value
          ? {
              arrayBuffer: async () => bytes(value),
              customMetadata: metadata.get(key),
            }
          : null;
      },
      async delete(key) {
        objects.delete(key);
      },
    };

    const backend = new R2DocumentStorageBackend({ bucket, prefix: "demo/private-documents" });
    const store = new EncryptedDocumentStore(backend, await createAesGcmStorageKey(), "worker-kms-key");
    const stored = await store.putDocument({ bytes: bytes("encrypted R2 content"), name: "r2.txt" });
    const key = backend.keyFor(stored.id);

    expect(key).toBe(`demo/private-documents/${stored.id}.json`);
    expect(metadata.get(key)).toEqual({
      documentHash: stored.hash,
      encryption: "AES-GCM",
      keyRef: "worker-kms-key",
      schemaVersion: "1",
    });
    expect(objects.get(key)).not.toContain("encrypted R2 content");
    expect(objects.get(key)).not.toContain("r2.txt");

    const restored = await store.getDocument(stored.id);
    expect(await text(restored!.bytes)).toBe("encrypted R2 content");
  });
});
