import type { Law544Request } from "../law544/types";

export function MachineryGraph({ request }: { request: Law544Request }) {
  const nodes = [
    "Citizen DID",
    request.institution,
    request.registryNumber ? "Registry assigned" : "Registry queue",
    request.assignedToDidHash ? "Director routed" : "Director queue",
    request.assignedToDidHash ? "Public servant" : "Unassigned",
    request.status,
  ];

  return (
    <section className="panel graphPanel">
      <div className="panelHeader">
        <h2>Bureaucratic machinery</h2>
        <span className="pill">current path</span>
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
