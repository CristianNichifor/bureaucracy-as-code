import { formatAction, formatDateTime, formatLaw544Status, formatRole, useLanguage } from "../locale";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import type { LedgerEvent } from "../ledger/types";
import type { Dictionary } from "../i18n";
import { eventProofSummary } from "./auditReceipt";
import "./trail.css";

/**
 * The signed trail as a table. It is the text alternative to the machinery graph
 * (docs/ux-guidelines.md §4): one row per signed transition, the state hash copyable
 * from the row, and the full proof behind a disclosure under each row.
 */
export function RequestTrail({
  events,
  requestId,
  labels,
}: {
  events: LedgerEvent[];
  requestId: string;
  labels: Dictionary["trail"];
}) {
  const language = useLanguage();

  return (
    <section className="panel timelinePanel">
      <div className="panelHeader">
        <h2>{labels.title}</h2>
        <span className="pill">{requestId}</span>
      </div>
      <div className="explainBox">
        <strong>{labels.explainLabel}</strong>
        <p>{labels.explainerCopy}</p>
      </div>
      {events.length > 0 ? (
        <div className="trailScroll">
          <table className="trailTable" aria-label={labels.title}>
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">{labels.eventCode}</th>
                <th scope="col">{labels.state}</th>
                <th scope="col">{labels.signerRole}</th>
                <th scope="col">{labels.stateHash}</th>
                <th scope="col">{labels.documentHash}</th>
              </tr>
            </thead>
            {events.map((event) => {
              const proof = eventProofSummary(event);

              return (
                <tbody key={event.stateHash}>
                  <tr>
                    <td className="trailIndex">{event.index}</td>
                    <td>
                      <strong>{formatAction(event.action, language)}</strong>
                      <span className="trailWhen">{formatDateTime(event.timestamp, language)}</span>
                      <code>{event.action}</code>
                    </td>
                    <td>
                      {formatLaw544Status(event.fromStatus, language)} &rarr; {formatLaw544Status(event.toStatus, language)}
                    </td>
                    <td>{formatRole(event.signerRole, language)}</td>
                    <td>
                      <ProofValue value={proof.stateHash} labels={labels} />
                    </td>
                    <td>{event.documentHash ? <ProofValue value={event.documentHash} labels={labels} /> : labels.none}</td>
                  </tr>
                  <tr className="trailProofRow">
                    <td colSpan={6}>
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
                      </details>
                    </td>
                  </tr>
                </tbody>
              );
            })}
          </table>
        </div>
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
      <code title={value}>{value}</code>
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
