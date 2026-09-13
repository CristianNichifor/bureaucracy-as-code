import type { D1DatabaseLike, D1PreparedStatement, D1Result, KVNamespaceLike } from "./bindings";

type RequestRow = Record<string, unknown> & { id: string; created_at: string };

export class InMemoryKVNamespace implements KVNamespaceLike {
  private readonly values = new Map<string, string>();
  private readonly metadata = new Map<string, Record<string, unknown>>();

  async get(key: string): Promise<string | null> {
    return this.values.get(key) ?? null;
  }

  async put(key: string, value: string, options?: { metadata?: Record<string, unknown> }): Promise<void> {
    this.values.set(key, value);
    if (options?.metadata) {
      this.metadata.set(key, { ...options.metadata });
    }
  }

  async delete(key: string): Promise<void> {
    this.values.delete(key);
    this.metadata.delete(key);
  }

  async list(options: { prefix?: string; cursor?: string; limit?: number } = {}) {
    const prefix = options.prefix ?? "";
    const offset = options.cursor ? Number(options.cursor) : 0;
    const limit = options.limit ?? 1000;
    const names = [...this.values.keys()].filter((key) => key.startsWith(prefix)).sort();
    const page = names.slice(offset, offset + limit);
    const nextOffset = offset + page.length;

    return {
      keys: page.map((name) => ({ name, metadata: this.metadata.get(name) })),
      list_complete: nextOffset >= names.length,
      cursor: nextOffset >= names.length ? undefined : String(nextOffset),
    };
  }
}

export class InMemoryD1Database implements D1DatabaseLike {
  readonly requests = new Map<string, RequestRow>();

  prepare<T = unknown>(query: string): D1PreparedStatement<T> {
    return new InMemoryD1PreparedStatement(this, query);
  }
}

class InMemoryD1PreparedStatement<T = unknown> implements D1PreparedStatement<T> {
  private values: unknown[] = [];

  constructor(
    private readonly db: InMemoryD1Database,
    private readonly query: string,
  ) {}

  bind(...values: unknown[]): D1PreparedStatement<T> {
    this.values = values;
    return this;
  }

  async first<R = T>(): Promise<R | null> {
    if (this.query.includes("WHERE id = ?")) {
      return (this.db.requests.get(String(this.values[0])) as R | undefined) ?? null;
    }

    throw new Error(`Unsupported in-memory D1 first query: ${this.query}`);
  }

  async all<R = T>(): Promise<D1Result<R>> {
    if (this.query.includes("FROM law544_requests")) {
      return {
        success: true,
        results: [...this.db.requests.values()]
          .sort((left, right) => String(right.created_at).localeCompare(String(left.created_at)) || left.id.localeCompare(right.id))
          .map((row) => ({ ...row }) as R),
      };
    }

    throw new Error(`Unsupported in-memory D1 all query: ${this.query}`);
  }

  async run(): Promise<D1Result> {
    if (this.query.includes("INSERT INTO law544_requests")) {
      const [
        id,
        institution,
        subject,
        citizenDidHash,
        status,
        createdAt,
        deadlineAt,
        registryNumber,
        assignedToDidHash,
        responseDocumentHash,
      ] = this.values;

      this.db.requests.set(String(id), {
        id: String(id),
        institution,
        subject,
        citizen_did_hash: citizenDidHash,
        status,
        created_at: createdAt,
        deadline_at: deadlineAt,
        registry_number: registryNumber,
        assigned_to_did_hash: assignedToDidHash,
        response_document_hash: responseDocumentHash,
        updated_at: new Date().toISOString(),
      } as RequestRow);

      return { success: true };
    }

    throw new Error(`Unsupported in-memory D1 run query: ${this.query}`);
  }
}

