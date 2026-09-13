export type D1Result<T = unknown> = {
  results?: T[];
  success: boolean;
  meta?: unknown;
};

export type D1PreparedStatement<T = unknown> = {
  bind(...values: unknown[]): D1PreparedStatement<T>;
  first<R = T>(columnName?: string): Promise<R | null>;
  all<R = T>(): Promise<D1Result<R>>;
  run(): Promise<D1Result>;
};

export type D1DatabaseLike = {
  prepare<T = unknown>(query: string): D1PreparedStatement<T>;
};

export type KVNamespaceLike = {
  get(key: string, options?: "text"): Promise<string | null>;
  put(key: string, value: string, options?: { metadata?: Record<string, unknown> }): Promise<void>;
  delete(key: string): Promise<void>;
  list(options?: { prefix?: string; cursor?: string; limit?: number }): Promise<{
    keys: Array<{ name: string; metadata?: Record<string, unknown> }>;
    list_complete: boolean;
    cursor?: string;
  }>;
};

export type PersistenceBindings = {
  REQUESTS_DB?: D1DatabaseLike;
  LEDGER_EVENTS_KV?: KVNamespaceLike;
  DOCUMENTS_R2?: import("../storage/R2DocumentStorageBackend").R2BucketLike;
};

