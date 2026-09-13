import type { DocumentStorageBackend, EncryptedDocumentEnvelope } from "./types";

export type R2ObjectBody = {
  arrayBuffer(): Promise<ArrayBuffer>;
  customMetadata?: Record<string, string>;
};

export type R2BucketLike = {
  put(
    key: string,
    value: string,
    options?: { customMetadata?: Record<string, string> },
  ): Promise<unknown>;
  get(key: string): Promise<R2ObjectBody | null>;
  delete(key: string): Promise<void>;
};

export type R2DocumentStorageBackendOptions = {
  bucket: R2BucketLike;
  prefix?: string;
};

export class R2DocumentStorageBackend implements DocumentStorageBackend {
  readonly provider = "r2" as const;
  private readonly bucket: R2BucketLike;
  private readonly prefix: string;

  constructor(options: R2DocumentStorageBackendOptions) {
    this.bucket = options.bucket;
    this.prefix = options.prefix ?? "law544-documents";
  }

  keyFor(id: string): string {
    return `${this.prefix}/${id}.json`;
  }

  async putEnvelope(envelope: EncryptedDocumentEnvelope): Promise<void> {
    await this.bucket.put(this.keyFor(envelope.id), JSON.stringify(envelope), {
      customMetadata: {
        documentHash: envelope.documentHash,
        encryption: envelope.encryption.algorithm,
        keyRef: envelope.encryption.keyRef,
        schemaVersion: String(envelope.version),
      },
    });
  }

  async getEnvelope(id: string): Promise<EncryptedDocumentEnvelope | undefined> {
    const object = await this.bucket.get(this.keyFor(id));
    if (!object) {
      return undefined;
    }

    return JSON.parse(new TextDecoder().decode(await object.arrayBuffer())) as EncryptedDocumentEnvelope;
  }

  async deleteEnvelope(id: string): Promise<void> {
    await this.bucket.delete(this.keyFor(id));
  }
}
