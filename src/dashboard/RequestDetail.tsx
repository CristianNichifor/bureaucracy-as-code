import { Clock3, FileText, Fingerprint, Landmark } from "lucide-react";
import { isOverdue } from "../law544/deadlines";
import type { Law544Request } from "../law544/types";
import type { LedgerEvent } from "../ledger/types";
import { getRequestLatestRole } from "./requestExplorer";

export function RequestDetail({
  request,
  events,
  source,
}: {
  request: Law544Request;
  events: LedgerEvent[];
  source: "active" | "seed";
}) {
  const latestRole = getRequestLatestRole(events);

  return (
    <section className="panel requestDetailPanel">
      <div className="panelHeader">
        <h2>Request detail</h2>
        <span className="pill">{source === "active" ? "live browser chain" : "seeded public example"}</span>
      </div>
      <div className="detailHero">
        <div>
          <span className={`status status-${request.status.toLowerCase()}`}>{request.status}</span>
          <h3>{request.id}</h3>
          <p>{request.subject}</p>
        </div>
      </div>
      <div className="metricGrid">
        <div className="metric">
          <Landmark size={18} />
          <span>Institution</span>
          <strong>{request.institution}</strong>
        </div>
        <div className="metric">
          <Clock3 size={18} />
          <span>Deadline</span>
          <strong className={isOverdue(request.deadlineAt) ? "danger" : ""}>
            {new Date(request.deadlineAt).toLocaleDateString()}
          </strong>
        </div>
        <div className="metric">
          <Fingerprint size={18} />
          <span>Latest signer role</span>
          <strong>{latestRole ?? "No signer yet"}</strong>
        </div>
        <div className="metric">
          <FileText size={18} />
          <span>Events</span>
          <strong>{events.length}</strong>
        </div>
      </div>
      <dl className="detailList">
        <div>
          <dt>Citizen DID hash</dt>
          <dd>{request.citizenDidHash.slice(0, 28)}...</dd>
        </div>
        <div>
          <dt>Registry number</dt>
          <dd>{request.registryNumber ?? "Not assigned"}</dd>
        </div>
        <div>
          <dt>Assigned DID hash</dt>
          <dd>{request.assignedToDidHash ? `${request.assignedToDidHash.slice(0, 28)}...` : "Not assigned"}</dd>
        </div>
        <div>
          <dt>Response hash</dt>
          <dd>{request.responseDocumentHash ? `${request.responseDocumentHash.slice(0, 28)}...` : "No response yet"}</dd>
        </div>
      </dl>
    </section>
  );
}
