import type { LedgerEvent } from "../ledger/types";

export function RequestTrail({
  events,
  requestId,
}: {
  events: LedgerEvent[];
  requestId: string;
}) {
  return (
    <section className="panel timelinePanel">
      <div className="panelHeader">
        <h2>Signed audit trail</h2>
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
                  <dt>State</dt>
                  <dd>
                    {event.fromStatus} &rarr; {event.toStatus}
                  </dd>
                </div>
                <div>
                  <dt>Signer role</dt>
                  <dd>{event.signerRole}</dd>
                </div>
                <div>
                  <dt>Signer DID hash</dt>
                  <dd>{event.signerDidHash.slice(0, 18)}...</dd>
                </div>
                <div>
                  <dt>State hash</dt>
                  <dd>{event.stateHash.slice(0, 18)}...</dd>
                </div>
                <div>
                  <dt>Document hash</dt>
                  <dd>{event.documentHash ? `${event.documentHash.slice(0, 18)}...` : "None"}</dd>
                </div>
                <div>
                  <dt>Metadata</dt>
                  <dd>{event.metadata ? Object.entries(event.metadata).map(([key, value]) => `${key}: ${value}`).join(", ") : "None"}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ol>
      ) : (
        <p className="emptyState">No signed events have been recorded for this request yet.</p>
      )}
    </section>
  );
}
