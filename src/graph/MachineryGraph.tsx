import type { Dictionary } from "../i18n";
import type { Law544Request } from "../law544/types";

export function MachineryGraph({ request, labels }: { request: Law544Request; labels: Dictionary["graph"] }) {
  const registryDone = Boolean(request.registryNumber);
  const routed = Boolean(request.assignedToDidHash);
  const resolved = request.status === "Resolved";
  const overdue = request.status === "Overdue";
  const currentOwner =
    resolved ? labels.finalResponse : overdue ? labels.publicServant : routed ? labels.publicServant : registryDone ? labels.directorQueue : labels.registryQueue;
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
      state: resolved || overdue ? request.status : routed ? labels.current : labels.waiting,
      tone: resolved ? "complete" : overdue ? "danger" : routed ? "current" : "waiting",
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
