import type { Dictionary } from "../i18n";
import type { Law544Request } from "../law544/types";
import type { LedgerEvent } from "../ledger/types";

type ExceptionSignal = {
  label: string;
  detail: string;
  tone: "current" | "complete" | "danger" | "waiting";
};

export function MachineryGraph({
  request,
  events,
  labels,
}: {
  request: Law544Request;
  events: LedgerEvent[];
  labels: Dictionary["graph"];
}) {
  const registryDone = Boolean(request.registryNumber);
  const routed = Boolean(request.assignedToDidHash);
  const resolved = request.status === "Resolved";
  const overdue = request.status === "Overdue";
  const rejected = request.status === "Rejected";
  const exceptionSignals = getExceptionSignals(request, events, labels);
  const currentOwner =
    resolved ? labels.finalResponse : rejected ? labels.refusalResponse : overdue ? labels.escalationQueue : routed ? labels.publicServant : registryDone ? labels.directorQueue : labels.registryQueue;
  const nodes = [
    {
      label: labels.citizenDid,
      detail: request.citizenDidHash.slice(0, 14),
      state: labels.complete,
      tone: "complete",
    },
    {
      label: labels.institution,
      detail: request.institution,
      state: labels.complete,
      tone: "complete",
    },
    {
      label: registryDone ? labels.registryAssigned : labels.registryQueue,
      detail: request.registryNumber ?? labels.waiting,
      state: registryDone ? labels.complete : labels.current,
      tone: registryDone ? "complete" : "current",
    },
    {
      label: routed ? labels.directorRouted : labels.directorQueue,
      detail: routed ? request.assignedToDidHash?.slice(0, 14) : labels.waiting,
      state: routed ? labels.complete : labels.current,
      tone: routed ? "complete" : "current",
    },
    {
      label: routed ? labels.publicServant : labels.unassigned,
      detail: request.responseDocumentHash ? labels.hashEvidence : request.status,
      state: resolved || overdue || rejected ? request.status : routed ? labels.current : labels.waiting,
      tone: resolved ? "complete" : overdue || rejected ? "danger" : routed ? "current" : "waiting",
    },
  ];

  return (
    <section className="panel graphPanel">
      <div className="panelHeader">
        <h2>{labels.title}</h2>
        <span className="pill">{labels.currentPath}</span>
      </div>
      <div className="explainBox">
        <strong>{labels.explainLabel}</strong>
        <p>{labels.copy}</p>
      </div>
      <div className="graphOwner">
        <span>{labels.currentOwner}</span>
        <strong>{currentOwner}</strong>
      </div>
      <div className="exceptionLane" aria-label={labels.exceptionLane}>
        <span>{labels.exceptionLane}</span>
        {exceptionSignals.length > 0 ? (
          exceptionSignals.map((signal) => (
            <div className={`exceptionSignal exceptionSignal-${signal.tone}`} key={`${signal.label}-${signal.detail}`}>
              <strong>{signal.label}</strong>
              <small>{signal.detail}</small>
            </div>
          ))
        ) : (
          <div className="exceptionSignal exceptionSignal-waiting">
            <strong>{labels.standardFlow}</strong>
            <small>{labels.noExceptions}</small>
          </div>
        )}
      </div>
      <div className="graph">
        {nodes.map((node, index) => (
          <div className="graphStep" key={`${node.label}-${index}`}>
            <div className={`graphNode graphNode-${node.tone}`}>
              <span>{node.label}</span>
              <strong>{node.detail}</strong>
              <small>{node.state}</small>
            </div>
            {index < nodes.length - 1 ? <div className="graphEdge" /> : null}
          </div>
        ))}
      </div>
    </section>
  );
}

function getExceptionSignals(
  request: Law544Request,
  events: LedgerEvent[],
  labels: Dictionary["graph"],
): ExceptionSignal[] {
  const signals: ExceptionSignal[] = [];
  const metadataEntries = events.flatMap((event) => Object.entries(event.metadata ?? {}));
  const metadataKeys = new Set(metadataEntries.map(([key]) => key));
  const metadataValues = new Set(metadataEntries.map(([, value]) => value));

  if (request.status === "ExtensionRequested" || events.some((event) => event.action === "Extension_Requested")) {
    signals.push({
      label: labels.extensionSignal,
      detail: getMetadataValue(events, "extensionDeadlineAt") ?? getMetadataValue(events, "reason") ?? labels.signedMetadata,
      tone: request.status === "ExtensionRequested" ? "current" : "complete",
    });
  }

  if (metadataValues.has("partial") || metadataKeys.has("redactionBasis") || metadataKeys.has("responseScope")) {
    signals.push({
      label: labels.partialDisclosureSignal,
      detail: getMetadataValue(events, "redactionBasis") ?? labels.signedMetadata,
      tone: "complete",
    });
  }

  if (metadataValues.has("redirected") || metadataKeys.has("targetInstitution")) {
    signals.push({
      label: labels.redirectSignal,
      detail: getMetadataValue(events, "targetInstitution") ?? labels.signedMetadata,
      tone: "complete",
    });
  }

  if (request.status === "Overdue" || events.some((event) => event.action === "Request_Marked_Overdue")) {
    signals.push({
      label: labels.overdueSignal,
      detail: getMetadataValue(events, "missedDeadlineAt") ?? labels.escalationQueue,
      tone: "danger",
    });
  }

  if (request.status === "Rejected" || events.some((event) => event.action === "Request_Rejected")) {
    signals.push({
      label: labels.rejectionSignal,
      detail: getMetadataValue(events, "reason") ?? labels.refusalResponse,
      tone: "danger",
    });
  }

  return signals;
}

function getMetadataValue(events: LedgerEvent[], key: string): string | undefined {
  return events.find((event) => event.metadata?.[key])?.metadata?.[key];
}
