import type { Law544Request } from "../law544/types";
import type { RequestRepository } from "../api/types";
import type { D1DatabaseLike } from "./bindings";

type RequestRow = {
  id: string;
  institution: string;
  subject: string;
  citizen_did_hash: string;
  status: Law544Request["status"];
  created_at: string;
  deadline_at: string;
  registry_number: string | null;
  assigned_to_did_hash: string | null;
  response_document_hash: string | null;
};

export const REQUEST_PROJECTIONS_SCHEMA = `
CREATE TABLE IF NOT EXISTS law544_requests (
  id TEXT PRIMARY KEY,
  institution TEXT NOT NULL,
  subject TEXT NOT NULL,
  citizen_did_hash TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL,
  deadline_at TEXT NOT NULL,
  registry_number TEXT,
  assigned_to_did_hash TEXT,
  response_document_hash TEXT,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS law544_requests_status_idx ON law544_requests(status);
CREATE INDEX IF NOT EXISTS law544_requests_institution_idx ON law544_requests(institution);
`;

export class D1RequestRepository implements RequestRepository {
  constructor(private readonly db: D1DatabaseLike) {}

  async get(requestId: string): Promise<Law544Request | undefined> {
    const row = await this.db
      .prepare<RequestRow>("SELECT * FROM law544_requests WHERE id = ?")
      .bind(requestId)
      .first<RequestRow>();

    return row ? rowToRequest(row) : undefined;
  }

  async save(request: Law544Request): Promise<void> {
    await this.db
      .prepare(
        `INSERT INTO law544_requests (
          id,
          institution,
          subject,
          citizen_did_hash,
          status,
          created_at,
          deadline_at,
          registry_number,
          assigned_to_did_hash,
          response_document_hash,
          updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(id) DO UPDATE SET
          institution = excluded.institution,
          subject = excluded.subject,
          citizen_did_hash = excluded.citizen_did_hash,
          status = excluded.status,
          created_at = excluded.created_at,
          deadline_at = excluded.deadline_at,
          registry_number = excluded.registry_number,
          assigned_to_did_hash = excluded.assigned_to_did_hash,
          response_document_hash = excluded.response_document_hash,
          updated_at = CURRENT_TIMESTAMP`,
      )
      .bind(
        request.id,
        request.institution,
        request.subject,
        request.citizenDidHash,
        request.status,
        request.createdAt,
        request.deadlineAt,
        request.registryNumber ?? null,
        request.assignedToDidHash ?? null,
        request.responseDocumentHash ?? null,
      )
      .run();
  }

  async list(): Promise<Law544Request[]> {
    const result = await this.db
      .prepare<RequestRow>("SELECT * FROM law544_requests ORDER BY created_at DESC, id ASC")
      .all<RequestRow>();
    return (result.results ?? []).map(rowToRequest);
  }
}

function rowToRequest(row: RequestRow): Law544Request {
  return {
    id: row.id,
    institution: row.institution,
    subject: row.subject,
    citizenDidHash: row.citizen_did_hash,
    status: row.status,
    createdAt: row.created_at,
    deadlineAt: row.deadline_at,
    registryNumber: row.registry_number ?? undefined,
    assignedToDidHash: row.assigned_to_did_hash ?? undefined,
    responseDocumentHash: row.response_document_hash ?? undefined,
  };
}

