import type { Law544Request } from "../law544/types";
import { isOverdue } from "../law544/deadlines";

export function RequestFeed({ request }: { request: Law544Request }) {
  return (
    <section className="panel">
      <div className="panelHeader">
        <h2>Public request feed</h2>
        <span className="pill">anonymized</span>
      </div>
      <div className="feedRow">
        <div>
          <strong>{request.id}</strong>
          <span>{request.subject}</span>
        </div>
        <div>{request.institution}</div>
        <div>
          <span className={`status status-${request.status.toLowerCase()}`}>{request.status}</span>
        </div>
        <div className={isOverdue(request.deadlineAt) ? "danger" : ""}>
          {new Date(request.deadlineAt).toLocaleDateString()}
        </div>
      </div>
    </section>
  );
}
