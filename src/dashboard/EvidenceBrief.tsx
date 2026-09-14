import { BadgeCheck, Fingerprint, ShieldCheck, UserRoundCheck } from "lucide-react";
import type { Dictionary } from "../i18n";
import type { Law544Request, Law544Status } from "../law544/types";
import type { LedgerEvent } from "../ledger/types";
import { formatLaw544Status } from "./requestExplorer";

export function EvidenceBrief({
  request,
  events,
  labels,
}: {
  request: Law544Request;
  events: LedgerEvent[];
  labels: Dictionary["evidenceBrief"];
}) {
  const latestEvent = events.at(-1);
  const latestHash = latestEvent?.stateHash.slice(0, 18) ?? labels.noProof;
  const documentProof = request.responseDocumentHash ?? latestEvent?.documentHash;
  const nextAction = getNextAction(request.status, labels);

  return (
    <section className="panel evidenceBriefPanel" aria-labelledby="evidence-brief-title">
      <div className="panelHeader">
        <div>
          <p className="eyebrow">{labels.label}</p>
          <h2 id="evidence-brief-title">{labels.title}</h2>
        </div>
        <span className={`status status-${request.status.toLowerCase()}`}>{formatLaw544Status(request.status)}</span>
      </div>
      <p className="panelCopy">{getStatusCopy(request.status, labels)}</p>
      <div className="evidenceBriefGrid">
        <article>
          <UserRoundCheck size={18} />
          <span>{labels.responsibleDesk}</span>
          <strong>{getResponsibleDesk(request, labels)}</strong>
          <small>{nextAction}</small>
        </article>
        <article>
          <ShieldCheck size={18} />
          <span>{labels.latestSignedAction}</span>
          <strong>{latestEvent?.action ?? labels.noProof}</strong>
          <small>{latestEvent ? labels.signedBy.replace("{role}", latestEvent.signerRole) : labels.waiting}</small>
        </article>
        <article>
          <Fingerprint size={18} />
          <span>{labels.stateEvidence}</span>
          <strong>{latestHash}</strong>
          <small>{labels.hashChain}</small>
        </article>
        <article>
          <BadgeCheck size={18} />
          <span>{labels.citizenCanVerify}</span>
          <strong>{documentProof ? labels.documentHashAvailable : labels.noDocumentHash}</strong>
          <small>{documentProof ? documentProof.slice(0, 18) : labels.awaitingResponse}</small>
        </article>
      </div>
    </section>
  );
}

function getResponsibleDesk(request: Law544Request, labels: Dictionary["evidenceBrief"]): string {
  if (request.status === "Resolved") return labels.responsePublished;
  if (request.status === "Rejected") return labels.refusalPublished;
  if (request.status === "Overdue") return labels.escalationDesk;
  if (request.assignedToDidHash) return request.assignedToDidHash.slice(0, 18);
  if (request.registryNumber) return labels.directorQueue;
  return labels.registryQueue;
}

function getNextAction(status: Law544Status, labels: Dictionary["evidenceBrief"]): string {
  const nextActions: Record<Law544Status, string> = {
    Draft: labels.nextSubmit,
    Created: labels.nextRegistry,
    Registered: labels.nextDirector,
    Routed: labels.nextProcessing,
    InProgress: labels.nextResolve,
    ExtensionRequested: labels.nextExtension,
    Overdue: labels.nextEscalate,
    Resolved: labels.nextVerify,
    Rejected: labels.nextVerify,
  };

  return nextActions[status];
}

function getStatusCopy(status: Law544Status, labels: Dictionary["evidenceBrief"]): string {
  const statusCopy: Record<Law544Status, string> = {
    Draft: labels.copyDraft,
    Created: labels.copyCreated,
    Registered: labels.copyRegistered,
    Routed: labels.copyRouted,
    InProgress: labels.copyInProgress,
    ExtensionRequested: labels.copyExtension,
    Overdue: labels.copyOverdue,
    Resolved: labels.copyResolved,
    Rejected: labels.copyRejected,
  };

  return statusCopy[status];
}
