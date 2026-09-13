import type { LedgerEvent } from "../ledger/types";
import type { Dictionary } from "../i18n";
import { eventProofSummary } from "./auditReceipt";

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
          {events.map((event) => {
            const proof = eventProofSummary(event);

            return (
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
                    <dt>{labels.documentHash}</dt>
                    <dd>{event.documentHash ?? labels.none}</dd>
                  </div>
                  <div>
                    <dt>{labels.metadata}</dt>
                    <dd>
                      {event.metadata
                        ? Object.entries(event.metadata)
                            .map(([key, value]) => `${key}: ${value}`)
                            .join(", ")
                        : labels.none}
                    </dd>
                  </div>
                </dl>
                <details className="proofDetails">
                  <summary>{labels.proofTitle}</summary>
                  <dl>
                    <div>
                      <dt>{labels.signerDidHash}</dt>
                      <dd>{proof.signerDidHash}</dd>
                    </div>
                    <div>
                      <dt>{labels.credentialHash}</dt>
                      <dd>{proof.credentialHash}</dd>
                    </div>
                    <div>
                      <dt>{labels.payloadHash}</dt>
                      <dd>{proof.payloadHash}</dd>
                    </div>
                    <div>
                      <dt>{labels.previousStateHash}</dt>
                      <dd>{proof.previousStateHash}</dd>
                    </div>
                    <div>
                      <dt>{labels.stateHash}</dt>
                      <dd>{proof.stateHash}</dd>
                    </div>
                    <div>
                      <dt>{labels.signature}</dt>
                      <dd>{proof.signature}</dd>
                    </div>
                  </dl>
                </details>
              </li>
            );
          })}
        </ol>
      ) : (
        <p className="emptyState">{labels.empty}</p>
      )}
    </section>
  );
}
