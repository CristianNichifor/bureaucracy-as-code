import type { LedgerEvent } from "../ledger/types";

export function RequestTrail({ events }: { events: LedgerEvent[] }) {
  return (
    <section className="panel">
      <div className="panelHeader">
        <h2>Signed audit trail</h2>
        <span className="pill">{events.length} events</span>
      </div>
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
            </dl>
          </li>
        ))}
      </ol>
    </section>
  );
}
