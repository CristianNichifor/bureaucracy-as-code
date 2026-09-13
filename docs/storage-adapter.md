# Storage Adapter

The storage layer keeps request documents off-ledger. The ledger receives only a
document hash, while the storage provider owns encrypted bytes, private
metadata, retrieval, and deletion.

## Boundary

`DocumentStorageProvider` is defined in `src/storage/types.ts`.

It supports:

- `putDocument` for encrypted storage
- `getDocument` for authorized plaintext retrieval
- `getMetadata` for private metadata lookup
- `deleteDocument` for off-chain retention workflows
- `hashBytes` for local integrity checks

The public ledger reference is intentionally smaller:

```ts
type LedgerDocumentReference = {
  documentHash: string;
};
```

File names, MIME types, sizes, request text, and document bytes are not ledger
fields. They remain off-chain and should be available only to authorized
actors.

## Local Encrypted Store

`EncryptedDocumentStore` encrypts document bytes with AES-GCM before handing
them to a backend. The current local backend options are:

- `IndexedDbDocumentStorageBackend` for the browser demo
- `InMemoryDocumentStorageBackend` for tests and local service composition

The browser demo key is a session-local Web Crypto key. This is enough for a
local functional demo, but it is not production key management.

Production storage should replace the local key with institution-controlled key
management, key rotation, access logging, and revocation workflows.

## R2-Ready Backend

`R2DocumentStorageBackend` defines the Cloudflare R2 storage boundary without
requiring a Worker implementation in this phase.

It expects a minimal bucket interface:

```ts
type R2BucketLike = {
  put(key: string, value: string, options?: { customMetadata?: Record<string, string> }): Promise<unknown>;
  get(key: string): Promise<{ arrayBuffer(): Promise<ArrayBuffer> } | null>;
  delete(key: string): Promise<void>;
};
```

The backend stores encrypted envelopes at:

```txt
law544-documents/{documentId}.json
```

Only hash and encryption metadata should be stored as R2 custom metadata. Raw
document contents and private document metadata stay inside the encrypted
envelope.

## Public Ledger Rule

When a document is attached or used to resolve a request, callers must convert
private storage metadata through `toLedgerDocumentReference(metadata)` and pass
only `documentHash` into the Law 544 transition.

This keeps the public event model aligned with the privacy model:

- public: document hash
- private: document bytes, file name, MIME type, size, requester content,
  access logs, retention metadata

## Production Notes

Before production use:

- use KMS-backed envelope encryption instead of a session-local key
- separate requester-visible, institution-only, and public metadata views
- add per-document access logs
- define retention and deletion policies outside the append-only ledger
- treat hashes as integrity references, not anonymization
- validate uploads before storage and before hash publication

