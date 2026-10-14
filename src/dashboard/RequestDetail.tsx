import { localizeDemoText } from "../demo/demoText";
import { formatAction, formatDate, formatRole, useLanguage } from "../locale";
import { Clock3, FileText, Fingerprint, Landmark } from "lucide-react";
import type { Dictionary, Language } from "../i18n";
import { isOverdue } from "../law544/deadlines";
import type { Law544Request } from "../law544/types";
import type { LedgerEvent } from "../ledger/types";
import { formatLaw544Status, getRequestLatestRole } from "./requestExplorer";
import { detailDeadline, statusSymbols } from "./deadlineSummary";

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
  const language = useLanguage();
  const latestRole = getRequestLatestRole(events);
  const latestEvent = events.at(-1);
  const responsibility = getResponsibilityLabel(request, labels);
  const deadlineSummary = detailDeadline(request, labels, language);
  const handoffSteps = getHandoffSteps(request, events, labels, language);
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
          <span className={`status status-${request.status.toLowerCase()}`}>
            <span aria-hidden="true" className="statusSymbol">{statusSymbols[request.status]}</span>{" "}
            {formatLaw544Status(request.status, language)}
          </span>
          <h3>{request.id}</h3>
          <p>{localizeDemoText(request.subject, language)}</p>
        </div>
      </div>
      <div className="caseGlance" aria-label={labels.title}>
        <div>
          <span>{labels.currentStatus}</span>
          <strong>{formatLaw544Status(request.status, language)}</strong>
        </div>
        <div>
          <span>{labels.latestAction}</span>
          <strong>{latestEvent ? formatAction(latestEvent.action, language) : labels.noProof}</strong>
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
          <strong>{formatDate(request.deadlineAt, language)}</strong>
        </div>
        {deadlineSummary.copy && <p>{deadlineSummary.copy}</p>}
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
          <strong>{localizeDemoText(request.institution, language)}</strong>
        </div>
        <div className="metric">
          <Clock3 size={18} />
          <span>{labels.deadline}</span>
          <strong className={isOverdue(request.deadlineAt) ? "danger" : ""}>
            {formatDate(request.deadlineAt, language)}
          </strong>
        </div>
        <div className="metric">
          <Fingerprint size={18} />
          <span>{labels.latestSignerRole}</span>
          <strong>{latestRole ? formatRole(latestRole, language) : labels.noSigner}</strong>
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


function getHandoffSteps(
  request: Law544Request,
  events: LedgerEvent[],
  labels: Dictionary["detail"],
  language: Language,
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
      proof: registryEvent ? labels.signedBy.replace("{role}", formatRole(registryEvent.signerRole, language)) : labels.waitingForSignature,
      state: registryEvent ? "complete" : "current",
    },
    {
      label: labels.directorStep,
      owner: routeEvent ? labels.directorQueue : labels.notAssigned,
      proof: routeEvent ? labels.signedBy.replace("{role}", formatRole(routeEvent.signerRole, language)) : labels.waitingForSignature,
      state: routeEvent ? "complete" : registryEvent ? "current" : "waiting",
    },
    {
      label: labels.officerStep,
      owner: request.assignedToDidHash ? request.assignedToDidHash.slice(0, 18) : labels.notAssigned,
      proof: processingEvent ? labels.signedBy.replace("{role}", formatRole(processingEvent.signerRole, language)) : labels.waitingForSignature,
      state: isClosed ? "complete" : processingEvent ? "current" : "waiting",
    },
    {
      label: labels.responseStep,
      owner: request.responseDocumentHash ? request.responseDocumentHash.slice(0, 18) : labels.noResponse,
      proof: finalEvent ? labels.signedBy.replace("{role}", formatRole(finalEvent.signerRole, language)) : labels.waitingForSignature,
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
