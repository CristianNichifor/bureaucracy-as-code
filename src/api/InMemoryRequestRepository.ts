import type { Law544Request } from "../law544/types";
import type { RequestRepository } from "./types";

export class InMemoryRequestRepository implements RequestRepository {
  private readonly requests = new Map<string, Law544Request>();

  constructor(initialRequests: Law544Request[] = []) {
    for (const request of initialRequests) {
      this.requests.set(request.id, { ...request });
    }
  }

  async get(requestId: string): Promise<Law544Request | undefined> {
    const request = this.requests.get(requestId);
    return request ? { ...request } : undefined;
  }

  async save(request: Law544Request): Promise<void> {
    this.requests.set(request.id, { ...request });
  }

  async list(): Promise<Law544Request[]> {
    return [...this.requests.values()].map((request) => ({ ...request }));
  }
}
