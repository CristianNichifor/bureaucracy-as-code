import type { LedgerEvent } from "../ledger/types";
import type { Dictionary } from "../i18n";

export function RequestTrail({
  events,
  requestId,
  labels,
}: {
  events: LedgerEvent[];
  requestId: string;
  labels: Dictionary["trail"];
}) {
  return (
    <section className="panel timelinePanel">
      <div className="panelHeader">
        <h2>{labels.title}</h2>
        <span className="pill">{requestId}</span>
      </div>
      {events.length > 0 ? (
        <ol className="timeline">
          {events.map((event) => (
            <li key={event.stateHash}>
              <div className="timelineTop">
                <strong>{event.action}</strong>
                <span>{new Date(event.timestamp).toLocaleString()}</span>
              </div>
              <dl>
                <div>
                  <dt>{labels.state}</dt>
                  <dd>
                    {event.fromStatus} &rarr; {event.toStatus}
                  </dd>
                </div>
                <div>
                  <dt>{labels.signerRole}</dt>
                  <dd>{event.signerRole}</dd>
                </div>
                <div>
                  <dt>{labels.signerDidHash}</dt>
                  <dd>{event.signerDidHash.slice(0, 18)}...</dd>
                </div>
                <div>
                  <dt>{labels.stateHash}</dt>
                  <dd>{event.stateHash.slice(0, 18)}...</dd>
                </div>
                <div>
                  <dt>{labels.documentHash}</dt>
                  <dd>{event.documentHash ? `${event.documentHash.slice(0, 18)}...` : labels.none}</dd>
                </div>
                <div>
                  <dt>{labels.metadata}</dt>
                  <dd>{event.metadata ? Object.entries(event.metadata).map(([key, value]) => `${key}: ${value}`).join(", ") : labels.none}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ol>
      ) : (
        <p className="emptyState">{labels.empty}</p>
      )}
    </section>
  );
}
