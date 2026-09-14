import { Check, Copy } from "lucide-react";
import { useState } from "react";
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
                  <dl className="proofGrid">
                    <div>
                      <dt>{labels.signerDidHash}</dt>
                      <dd><ProofValue value={proof.signerDidHash} labels={labels} /></dd>
                    </div>
                    <div>
                      <dt>{labels.credentialHash}</dt>
                      <dd><ProofValue value={proof.credentialHash} labels={labels} /></dd>
                    </div>
                    <div>
                      <dt>{labels.payloadHash}</dt>
                      <dd><ProofValue value={proof.payloadHash} labels={labels} /></dd>
                    </div>
                    <div>
                      <dt>{labels.previousStateHash}</dt>
                      <dd><ProofValue value={proof.previousStateHash} labels={labels} /></dd>
                    </div>
                    <div>
                      <dt>{labels.stateHash}</dt>
                      <dd><ProofValue value={proof.stateHash} labels={labels} /></dd>
                    </div>
                    <div>
                      <dt>{labels.signature}</dt>
                      <dd><ProofValue value={proof.signature} labels={labels} /></dd>
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

function ProofValue({ value, labels }: { value: string; labels: Dictionary["trail"] }) {
  const [copied, setCopied] = useState(false);

  async function copyValue() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1_200);
  }

  return (
    <span className="proofValue">
      <code>{value}</code>
      <button
        aria-label={`${labels.copy}: ${value}`}
        className="iconButton"
        onClick={() => void copyValue()}
        type="button"
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
        <span>{copied ? labels.copied : labels.copy}</span>
      </button>
    </span>
  );
}
