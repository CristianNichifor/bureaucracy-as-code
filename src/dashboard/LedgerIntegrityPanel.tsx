import { AlertTriangle, CheckCircle2, Fingerprint } from "lucide-react";
import type { ChainVerificationResult, LedgerEvent } from "../ledger/types";

export function LedgerIntegrityPanel({
  verification,
  events,
  onTamperDemo,
}: {
  verification: ChainVerificationResult;
  events: LedgerEvent[];
  onTamperDemo: () => void;
}) {
  const head = events.at(-1)?.stateHash;

  return (
    <section className="panel integrityPanel">
      <div className="panelHeader">
        <h2>Ledger integrity</h2>
        <span className={`pill ${verification.valid ? "ok" : "dangerPill"}`}>
          {verification.valid ? "valid" : "failed"}
        </span>
      </div>
      <div className="integritySummary">
        {verification.valid ? <CheckCircle2 size={30} /> : <AlertTriangle size={30} />}
        <div>
          <strong>{verification.valid ? "Hash chain verifies" : "Hash chain break detected"}</strong>
          <p>
            {verification.valid
              ? "Every event links to the previous state hash."
              : "An imported or stored event no longer matches its recorded hash."}
          </p>
        </div>
      </div>
      <dl>
        <div>
          <dt>Events checked</dt>
          <dd>{verification.checkedEvents}</dd>
        </div>
        <div>
          <dt>Current head</dt>
          <dd>{head ? `${head.slice(0, 28)}...` : "No events yet"}</dd>
        </div>
        <div>
          <dt>First invalid event</dt>
          <dd>{verification.firstInvalidEvent ? `${verification.firstInvalidEvent.slice(0, 28)}...` : "None"}</dd>
        </div>
      </dl>
      <button className="panelAction" disabled={events.length === 0} onClick={onTamperDemo}>
        <Fingerprint size={18} />
        Test edited export
      </button>
    </section>
  );
}
