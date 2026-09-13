import { openDB } from "idb";
import { sha256Hex } from "../shared/crypto";

export type StoredDocument = {
  id: string;
  name: string;
  type: string;
  hash: string;
  storedAt: string;
};

const DB_NAME = "bureaucracy-as-code-documents";
const STORE_NAME = "documents";

async function db() {
  return openDB(DB_NAME, 1, {
    upgrade(database) {
      database.createObjectStore(STORE_NAME, { keyPath: "id" });
    },
  });
}

export class IndexedDbDocumentStore {
  async putFile(file: File): Promise<StoredDocument> {
    const buffer = await file.arrayBuffer();
    const hash = await sha256Hex(buffer);
    const record = {
      id: crypto.randomUUID(),
      name: file.name,
      type: file.type || "application/octet-stream",
      hash,
      storedAt: new Date().toISOString(),
      bytes: buffer,
    };
    await (await db()).put(STORE_NAME, record);

    return {
      id: record.id,
      name: record.name,
      type: record.type,
      hash: record.hash,
      storedAt: record.storedAt,
    };
  }

  async hashFile(file: File): Promise<string> {
    return sha256Hex(await file.arrayBuffer());
  }
}
