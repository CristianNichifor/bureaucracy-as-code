import { Clock3, FileText, Fingerprint, Landmark } from "lucide-react";
import type { Dictionary } from "../i18n";
import { isOverdue } from "../law544/deadlines";
import type { Law544Request } from "../law544/types";
import type { LedgerEvent } from "../ledger/types";
import { getRequestLatestRole } from "./requestExplorer";

export function RequestDetail({
  request,
  events,
  source,
  labels,
}: {
  request: Law544Request;
  events: LedgerEvent[];
  source: "active" | "seed";
  labels: Dictionary["detail"];
}) {
  const latestRole = getRequestLatestRole(events);

  return (
    <section className="panel requestDetailPanel">
      <div className="panelHeader">
        <h2>{labels.title}</h2>
        <span className="pill">{source === "active" ? labels.live : labels.seed}</span>
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
          <span>{labels.institution}</span>
          <strong>{request.institution}</strong>
        </div>
        <div className="metric">
          <Clock3 size={18} />
          <span>{labels.deadline}</span>
          <strong className={isOverdue(request.deadlineAt) ? "danger" : ""}>
            {new Date(request.deadlineAt).toLocaleDateString()}
          </strong>
        </div>
        <div className="metric">
          <Fingerprint size={18} />
          <span>{labels.latestSignerRole}</span>
          <strong>{latestRole ?? labels.noSigner}</strong>
        </div>
        <div className="metric">
          <FileText size={18} />
          <span>{labels.events}</span>
          <strong>{events.length}</strong>
        </div>
      </div>
      <dl className="detailList">
        <div>
          <dt>{labels.citizenDidHash}</dt>
          <dd>{request.citizenDidHash.slice(0, 28)}...</dd>
        </div>
        <div>
          <dt>{labels.registryNumber}</dt>
          <dd>{request.registryNumber ?? labels.notAssigned}</dd>
        </div>
        <div>
          <dt>{labels.assignedDidHash}</dt>
          <dd>{request.assignedToDidHash ? `${request.assignedToDidHash.slice(0, 28)}...` : labels.notAssigned}</dd>
        </div>
        <div>
          <dt>{labels.responseHash}</dt>
          <dd>{request.responseDocumentHash ? `${request.responseDocumentHash.slice(0, 28)}...` : labels.noResponse}</dd>
        </div>
      </dl>
    </section>
  );
}
