import type { Dictionary } from "../i18n";
import type { Law544Request } from "../law544/types";

export function MachineryGraph({ request, labels }: { request: Law544Request; labels: Dictionary["graph"] }) {
  const nodes = [
    labels.citizenDid,
    request.institution,
    request.registryNumber ? labels.registryAssigned : labels.registryQueue,
    request.assignedToDidHash ? labels.directorRouted : labels.directorQueue,
    request.assignedToDidHash ? labels.publicServant : labels.unassigned,
    request.status,
  ];

  return (
    <section className="panel graphPanel">
      <div className="panelHeader">
        <h2>{labels.title}</h2>
        <span className="pill">{labels.currentPath}</span>
      </div>
      <div className="graph">
        {nodes.map((node, index) => (
          <div className="graphStep" key={`${node}-${index}`}>
            <div className="graphNode">{node}</div>
            {index < nodes.length - 1 ? <div className="graphEdge" /> : null}
          </div>
        ))}
      </div>
    </section>
  );
}
