import { InMemoryRequestRepository } from "../../src/api/InMemoryRequestRepository";
import { InMemoryNonceStore } from "../../src/api/InMemoryNonceStore";
import { TransitionIngestionService } from "../../src/api/transitionIngestion";
import type { NonceStore } from "../../src/api/types";
import { D1RequestRepository } from "../../src/cloudflare/D1RequestRepository";
import { KVLedgerProvider } from "../../src/cloudflare/KVLedgerProvider";
import type { D1DatabaseLike, KVNamespaceLike, PersistenceBindings } from "../../src/cloudflare/bindings";
import { BrowserIdentityProvider } from "../../src/identity/BrowserIdentityProvider";
import { InMemoryLedgerProvider } from "./InMemoryLedgerProvider";

export type ApiRuntime = ReturnType<typeof createApiRuntime>;

const memoryRuntime = createApiRuntime();
const boundRuntimes = new WeakMap<object, ApiRuntime>();

export const apiRuntime = memoryRuntime;

export function resolveApiRuntime(env?: PersistenceBindings | Record<string, unknown>): ApiRuntime {
  if (!env || !hasDurableBindings(env)) {
    return memoryRuntime;
  }

  const key = env as object;
  const existing = boundRuntimes.get(key);
  if (existing) {
    return existing;
  }

  const runtime = createApiRuntime({
    ledger: new KVLedgerProvider(env.LEDGER_EVENTS_KV),
    requests: new D1RequestRepository(env.REQUESTS_DB),
    nonces: new KVNonceStore(env.NONCES_KV ?? env.LEDGER_EVENTS_KV),
    mode: "cloudflare-durable",
  });
  boundRuntimes.set(key, runtime);
  return runtime;
}

function createApiRuntime(options: {
  ledger?: InMemoryLedgerProvider | KVLedgerProvider;
  requests?: InMemoryRequestRepository | D1RequestRepository;
  nonces?: InMemoryNonceStore | NonceStore;
  mode?: "demo-memory" | "cloudflare-durable";
} = {}) {
  const identity = new BrowserIdentityProvider();
  const ledger = options.ledger ?? new InMemoryLedgerProvider();
  const requests = options.requests ?? new InMemoryRequestRepository();
  const nonces = options.nonces ?? new InMemoryNonceStore();

  return {
    identity,
    ledger,
    requests,
    nonces,
    mode: options.mode ?? "demo-memory",
    ingestion: new TransitionIngestionService({ identity, ledger, requests, nonces }),
  };
}

function hasDurableBindings(env: Record<string, unknown>): env is PersistenceBindings & {
  REQUESTS_DB: D1DatabaseLike;
  LEDGER_EVENTS_KV: KVNamespaceLike;
} {
  return Boolean(env.REQUESTS_DB && env.LEDGER_EVENTS_KV);
}

class KVNonceStore implements NonceStore {
  constructor(private readonly kv: KVNamespaceLike) {}

  async has(input: { signerDidHash: string; nonce: string }): Promise<boolean> {
    return (await this.kv.get(nonceKey(input))) !== null;
  }

  async remember(input: { signerDidHash: string; nonce: string; signedAt: string }): Promise<void> {
    await this.kv.put(nonceKey(input), input.signedAt, {
      metadata: {
        signerDidHash: input.signerDidHash,
        signedAt: input.signedAt,
      },
    });
  }
}

function nonceKey(input: { signerDidHash: string; nonce: string }) {
  return `nonce:${input.signerDidHash}:${input.nonce}`;
}
