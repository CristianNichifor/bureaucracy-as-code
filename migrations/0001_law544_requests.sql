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
