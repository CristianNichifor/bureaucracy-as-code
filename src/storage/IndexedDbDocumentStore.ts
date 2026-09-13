import { openDB } from "idb";
import { EncryptedDocumentStore, createAesGcmStorageKey } from "./EncryptedDocumentStore";
import type {
  DocumentStorageBackend,
  DocumentStorageProvider,
  EncryptedDocumentEnvelope,
  StoreDocumentInput,
  StoredDocumentMetadata,
} from "./types";

const DB_NAME = "bureaucracy-as-code-documents";
const STORE_NAME = "documents";

async function db() {
  return openDB(DB_NAME, 2, {
    upgrade(database) {
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    },
  });
}

export class IndexedDbDocumentStorageBackend implements DocumentStorageBackend {
  readonly provider = "indexeddb" as const;

  async putEnvelope(envelope: EncryptedDocumentEnvelope): Promise<void> {
    await (await db()).put(STORE_NAME, envelope);
  }

  async getEnvelope(id: string): Promise<EncryptedDocumentEnvelope | undefined> {
    return (await db()).get(STORE_NAME, id);
  }

  async deleteEnvelope(id: string): Promise<void> {
    await (await db()).delete(STORE_NAME, id);
  }
}

export class IndexedDbDocumentStore implements DocumentStorageProvider {
  private static storePromise: Promise<EncryptedDocumentStore> | undefined;

  static async create(): Promise<IndexedDbDocumentStore> {
    return new IndexedDbDocumentStore();
  }

  private async store(): Promise<EncryptedDocumentStore> {
    IndexedDbDocumentStore.storePromise ??= createAesGcmStorageKey().then(
      (key) => new EncryptedDocumentStore(new IndexedDbDocumentStorageBackend(), key, "browser-session-key"),
    );
    return IndexedDbDocumentStore.storePromise;
  }

  async putDocument(input: StoreDocumentInput) {
    return (await this.store()).putDocument(input);
  }

  async getDocument(id: string) {
    return (await this.store()).getDocument(id);
  }

  async getMetadata(id: string) {
    return (await this.store()).getMetadata(id);
  }

  async deleteDocument(id: string) {
    return (await this.store()).deleteDocument(id);
  }

  async putFile(file: File, requestId?: string): Promise<StoredDocumentMetadata> {
    return this.putDocument({
      bytes: await file.arrayBuffer(),
      name: file.name,
      type: file.type,
      requestId,
    });
  }

  async hashFile(file: File): Promise<string> {
    return this.hashBytes(await file.arrayBuffer());
  }

  async hashBytes(bytes: ArrayBuffer): Promise<string> {
    return (await this.store()).hashBytes(bytes);
  }
}
