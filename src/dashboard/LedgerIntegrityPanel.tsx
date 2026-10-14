import { AlertTriangle, CheckCircle2, Fingerprint, Undo2 } from "lucide-react";
import type { Dictionary } from "../i18n";
import type { ChainVerificationResult, LedgerEvent } from "../ledger/types";
import "./integrity.css";

export function LedgerIntegrityPanel({
  verification,
  events,
  onTamperDemo,
  tamperResult,
  onDismissTamper,
  labels,
}: {
  verification: ChainVerificationResult;
  events: LedgerEvent[];
  onTamperDemo: () => void;
  /** The rejected edited export, if the tamper test just ran; the stored chain is untouched. */
  tamperResult: { reason?: string } | null;
  onDismissTamper: () => void;
  labels: Dictionary["integrity"];
}) {
  const head = events.at(-1)?.stateHash;

  return (
    <section className="panel integrityPanel">
      <div className="panelHeader">
        <h2>{labels.title}</h2>
        <span className={`pill ${verification.valid ? "ok" : "dangerPill"}`}>
          {verification.valid ? labels.valid : labels.failed}
        </span>
      </div>
      <div className="integritySummary">
        {verification.valid ? <CheckCircle2 size={30} /> : <AlertTriangle size={30} />}
        <div>
          <strong>{verification.valid ? labels.validTitle : labels.failedTitle}</strong>
          <p>
            {verification.valid ? labels.validCopy : labels.failedCopy}
          </p>
        </div>
      </div>
      <div className="explainBox">
        <strong>{labels.explainLabel}</strong>
        <p>{verification.valid ? labels.validCopy : labels.failedCopy}</p>
      </div>
      <dl>
        <div>
          <dt>{labels.eventsChecked}</dt>
          <dd>{verification.checkedEvents}</dd>
        </div>
        <div>
          <dt>{labels.currentHead}</dt>
          <dd>{head ? `${head.slice(0, 28)}...` : labels.noEvents}</dd>
        </div>
        <div>
          <dt>{labels.firstInvalidEvent}</dt>
          <dd>{verification.firstInvalidEvent ? `${verification.firstInvalidEvent.slice(0, 28)}...` : labels.none}</dd>
        </div>
      </dl>
      {tamperResult && (
        <div className="tamperResult" role="alert">
          <AlertTriangle size={20} aria-hidden="true" />
          <div>
            <strong>{labels.tamperFailedTitle}</strong>
            <p className="tamperReason">{tamperResult.reason ?? labels.tamperFallbackReason}</p>
            <p>{labels.tamperChainUnchanged}</p>
            <button className="civicButton civicButtonSecondary" onClick={onDismissTamper} type="button">
              <Undo2 size={18} aria-hidden="true" />
              {labels.backToVerified}
            </button>
          </div>
        </div>
      )}
      <button className="civicButton panelAction" disabled={events.length === 0} onClick={onTamperDemo} type="button">
        <Fingerprint size={18} />
        {labels.tamperButton}
      </button>
    </section>
  );
}
