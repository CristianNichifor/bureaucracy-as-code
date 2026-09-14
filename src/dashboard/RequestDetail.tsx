import { Clock3, FileText, Fingerprint, Landmark } from "lucide-react";
import type { Dictionary } from "../i18n";
import { isOverdue } from "../law544/deadlines";
import type { Law544Request } from "../law544/types";
import type { LedgerEvent } from "../ledger/types";
import { formatLaw544Status, getRequestLatestRole } from "./requestExplorer";

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
  const latestEvent = events.at(-1);
  const responsibility = getResponsibilityLabel(request, labels);
  const deadlineSummary = getDeadlineSummary(request, labels);
  const handoffSteps = getHandoffSteps(request, events, labels);
  const evidenceState = request.responseDocumentHash
    ? request.responseDocumentHash.slice(0, 18)
    : latestEvent?.documentHash
      ? latestEvent.documentHash.slice(0, 18)
      : labels.noProof;

  return (
    <section className="panel requestDetailPanel">
      <div className="panelHeader">
        <h2>{labels.title}</h2>
        <span className="pill">{source === "active" ? labels.live : labels.seed}</span>
      </div>
      <div className="detailHero">
        <div>
          <span className={`status status-${request.status.toLowerCase()}`}>{formatLaw544Status(request.status)}</span>
          <h3>{request.id}</h3>
          <p>{request.subject}</p>
        </div>
      </div>
      <div className="caseGlance" aria-label={labels.title}>
        <div>
          <span>{labels.currentStatus}</span>
          <strong>{formatLaw544Status(request.status)}</strong>
        </div>
        <div>
          <span>{labels.latestAction}</span>
          <strong>{latestEvent?.action ?? labels.noProof}</strong>
        </div>
        <div>
          <span>{labels.responsibility}</span>
          <strong>{responsibility}</strong>
        </div>
        <div>
          <span>{labels.evidence}</span>
          <strong>{evidenceState}</strong>
        </div>
      </div>
      <div className={`deadlineStrip deadlineStrip-${deadlineSummary.tone}`}>
        <div>
          <span>{labels.deadlineStatus}</span>
          <strong>{deadlineSummary.label}</strong>
        </div>
        <div>
          <span>{labels.deadline}</span>
          <strong>{new Date(request.deadlineAt).toLocaleDateString()}</strong>
        </div>
        <p>{deadlineSummary.copy}</p>
      </div>
      <div className="handoffPanel" aria-label={labels.handoffTitle}>
        <div className="handoffHeader">
          <span>{labels.handoffTitle}</span>
          <strong>{responsibility}</strong>
        </div>
        <ol className="handoffSteps">
          {handoffSteps.map((step) => (
            <li className={`handoffStep handoffStep-${step.state}`} key={step.label}>
              <span>{step.label}</span>
              <strong>{step.owner}</strong>
              <small>{step.proof}</small>
            </li>
          ))}
        </ol>
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
        <div>
          <dt>{labels.latestStateHash}</dt>
          <dd>{latestEvent ? latestEvent.stateHash : labels.noProof}</dd>
        </div>
        <div>
          <dt>{labels.latestSignature}</dt>
          <dd>{latestEvent ? latestEvent.signature : labels.noProof}</dd>
        </div>
      </dl>
    </section>
  );
}

function getDeadlineSummary(
  request: Law544Request,
  labels: Dictionary["detail"],
): { label: string; copy: string; tone: "closed" | "danger" | "warning" | "ok" } {
  const dayMs = 24 * 60 * 60 * 1000;
  const deadlineTime = new Date(request.deadlineAt).getTime();
  const daysUntil = Math.ceil((deadlineTime - Date.now()) / dayMs);

  if (request.status === "Resolved" || request.status === "Rejected") {
    return {
      label: labels.deadlineClosed,
      copy: labels.daysRemaining.replace("{days}", Math.max(daysUntil, 0).toString()),
      tone: "closed",
    };
  }

  if (daysUntil < 0) {
    return {
      label: labels.deadlineOverdue,
      copy: labels.daysOverdue.replace("{days}", Math.abs(daysUntil).toString()),
      tone: "danger",
    };
  }

  if (daysUntil <= 7) {
    return {
      label: labels.deadlineDueSoon,
      copy: labels.daysRemaining.replace("{days}", daysUntil.toString()),
      tone: "warning",
    };
  }

  return {
    label: labels.deadlineOnTrack,
    copy: labels.daysRemaining.replace("{days}", daysUntil.toString()),
    tone: "ok",
  };
}

function getHandoffSteps(
  request: Law544Request,
  events: LedgerEvent[],
  labels: Dictionary["detail"],
): Array<{ label: string; owner: string; proof: string; state: "complete" | "current" | "waiting" }> {
  const registryEvent = events.find((event) => event.action === "Registry_Assigned");
  const routeEvent = events.find((event) => event.action === "Task_Routed");
  const processingEvent = events.find((event) => event.action === "Processing_Started");
  const finalEvent = events.find((event) => event.action === "Request_Resolved" || event.action === "Request_Rejected");
  const isClosed = request.status === "Resolved" || request.status === "Rejected";

  return [
    {
      label: labels.registryStep,
      owner: request.registryNumber ?? labels.registryQueue,
      proof: registryEvent ? labels.signedBy.replace("{role}", registryEvent.signerRole) : labels.waitingForSignature,
      state: registryEvent ? "complete" : "current",
    },
    {
      label: labels.directorStep,
      owner: routeEvent ? labels.directorQueue : labels.notAssigned,
      proof: routeEvent ? labels.signedBy.replace("{role}", routeEvent.signerRole) : labels.waitingForSignature,
      state: routeEvent ? "complete" : registryEvent ? "current" : "waiting",
    },
    {
      label: labels.officerStep,
      owner: request.assignedToDidHash ? request.assignedToDidHash.slice(0, 18) : labels.notAssigned,
      proof: processingEvent ? labels.signedBy.replace("{role}", processingEvent.signerRole) : labels.waitingForSignature,
      state: isClosed ? "complete" : processingEvent ? "current" : "waiting",
    },
    {
      label: labels.responseStep,
      owner: request.responseDocumentHash ? request.responseDocumentHash.slice(0, 18) : labels.noResponse,
      proof: finalEvent ? labels.signedBy.replace("{role}", finalEvent.signerRole) : labels.waitingForSignature,
      state: finalEvent ? "complete" : "waiting",
    },
  ];
}

function getResponsibilityLabel(request: Law544Request, labels: Dictionary["detail"]): string {
  if (request.status === "Resolved" || request.status === "Rejected") {
    return labels.finalResponse;
  }

  if (request.assignedToDidHash) {
    return request.assignedToDidHash.slice(0, 18);
  }

  if (request.registryNumber) {
    return labels.directorQueue;
  }

  return labels.registryQueue;
}
