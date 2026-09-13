import { describe, expect, it } from "vitest";
import { InMemoryRequestRepository } from "../api/InMemoryRequestRepository";
import type { Law544Request } from "../law544/types";
import { createLedgerEvent } from "../ledger/hashChain";
import type { UnsignedTransition } from "../ledger/types";
import { R2DocumentStorageBackend } from "../storage/R2DocumentStorageBackend";
import { D1RequestRepository } from "./D1RequestRepository";
import { KVLedgerProvider } from "./KVLedgerProvider";
import { InMemoryD1Database, InMemoryKVNamespace } from "./testing";

const request: Law544Request = {
  id: "REQ-CF-001",
  institution: "Ministry of Finance",
  subject: "Budget execution data",
  citizenDidHash: "a".repeat(64),
  status: "Created",
  createdAt: "2026-09-14T09:00:00.000Z",
  deadlineAt: "2026-10-14T09:00:00.000Z",
};

describe("Cloudflare persistence scaffold", () => {
  it("stores public request projections through a D1-ready repository", async () => {
    const repository = new D1RequestRepository(new InMemoryD1Database());

    await repository.save(request);
    await repository.save({ ...request, status: "Registered", registryNumber: "544/42" });

    await expect(repository.get(request.id)).resolves.toMatchObject({
      id: request.id,
      status: "Registered",
      registryNumber: "544/42",
    });
    await expect(repository.list()).resolves.toContainEqual(expect.objectContaining({ id: request.id }));
  });

  it("keeps the same repository contract as the local in-memory implementation", async () => {
    const repositories = [
      new InMemoryRequestRepository(),
      new D1RequestRepository(new InMemoryD1Database()),
    ];

    for (const repository of repositories) {
      await repository.save(request);
      await expect(repository.get(request.id)).resolves.toEqual(request);
    }
  });

  it("stores append-only ledger events in a KV-ready provider", async () => {
    const ledger = new KVLedgerProvider(new InMemoryKVNamespace());
    const created = await ledger.appendTransition(unsignedTransition("REQ-CF-001", "Request_Created", "Draft", "Created"));
    const registered = await ledger.appendTransition(
      unsignedTransition("REQ-CF-001", "Registry_Assigned", "Created", "Registered"),
    );

    expect(registered.index).toBe(1);
    expect(registered.previousStateHash).toBe(created.stateHash);
    await expect(ledger.getRequestTrail("REQ-CF-001")).resolves.toHaveLength(2);
    await expect(ledger.verifyChain()).resolves.toMatchObject({ valid: true, checkedEvents: 2 });
  });

  it("rejects overwriting an existing KV ledger index", async () => {
    const kv = new InMemoryKVNamespace();
    const event = await createLedgerEvent({
      event: unsignedTransition("REQ-CF-001", "Request_Created", "Draft", "Created"),
    });
    const ledger = new KVLedgerProvider(kv);

    await ledger.replaceEvents([event]);
    await expect(ledger.replaceEvents([event])).rejects.toThrow("append-only");
  });

  it("uses the existing R2 document backend without Cloudflare credentials", async () => {
    const bucket = new InMemoryR2Bucket();
    const backend = new R2DocumentStorageBackend({ bucket, prefix: "test-documents" });
    const envelope = {
      id: "doc-1",
      version: 1 as const,
      ciphertextBase64: "encrypted",
      documentHash: "b".repeat(64),
      storedAt: "2026-09-14T09:00:00.000Z",
      encryption: {
        algorithm: "AES-GCM" as const,
        ivBase64: "iv",
        keyRef: "local-test-key",
      },
    };

    await backend.putEnvelope(envelope);

    await expect(backend.getEnvelope("doc-1")).resolves.toEqual(envelope);
    expect(bucket.keys()).toEqual(["test-documents/doc-1.json"]);
  });
});

function unsignedTransition(
  requestId: string,
  action: UnsignedTransition["action"],
  fromStatus: UnsignedTransition["fromStatus"],
  toStatus: UnsignedTransition["toStatus"],
): UnsignedTransition {
  return {
    requestId,
    action,
    fromStatus,
    toStatus,
    payloadHash: "1".repeat(64),
    signerDidHash: "2".repeat(64),
    signerRole: "Citizen",
    credentialHash: "3".repeat(64),
    signature: "signature",
    timestamp: "2026-09-14T09:00:00.000Z",
  };
}

class InMemoryR2Bucket {
  private readonly values = new Map<string, string>();

  async put(key: string, value: string): Promise<void> {
    this.values.set(key, value);
  }

  async get(key: string) {
    const value = this.values.get(key);
    if (!value) {
      return null;
    }

    return {
      arrayBuffer: async () => new TextEncoder().encode(value).buffer,
    };
  }

  async delete(key: string): Promise<void> {
    this.values.delete(key);
  }

  keys(): string[] {
    return [...this.values.keys()];
  }
}

