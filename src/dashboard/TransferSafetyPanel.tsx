import { FileCheck2, KeyRound, ShieldAlert, ShieldCheck } from "lucide-react";
import type { Dictionary } from "../i18n";

export type TransferStatus = "idle" | "exported" | "imported" | "rejected" | "reset";

export function TransferSafetyPanel({
  labels,
  eventCount,
  requestId,
  status,
  detail,
}: {
  labels: Dictionary["transferSafety"];
  eventCount: number;
  requestId: string;
  status: TransferStatus;
  detail: string;
}) {
  const statusLabels: Record<TransferStatus, string> = {
    idle: labels.idle,
    exported: labels.exported,
    imported: labels.imported,
    rejected: labels.rejected,
    reset: labels.reset,
  };

  return (
    <section className="panel transferSafetyPanel" aria-labelledby="transfer-safety-title">
      <div className="panelHeader">
        <div>
          <p className="eyebrow">{labels.label}</p>
          <h2 id="transfer-safety-title">{labels.title}</h2>
        </div>
        <span className={`pill ${status === "rejected" ? "dangerPill" : "ok"}`}>{statusLabels[status]}</span>
      </div>
      <p className="panelCopy">{labels.copy}</p>
      <div className="transferSafetyGrid">
        <article>
          <FileCheck2 size={18} />
          <span>{labels.exportScope}</span>
          <strong>{labels.eventCount.replace("{count}", eventCount.toString())}</strong>
          <small>{labels.request.replace("{requestId}", requestId)}</small>
        </article>
        <article>
          <ShieldCheck size={18} />
          <span>{labels.importGate}</span>
          <strong>{labels.chainMustVerify}</strong>
          <small>{labels.refusesTampering}</small>
        </article>
        <article>
          <KeyRound size={18} />
          <span>{labels.keyBoundary}</span>
          <strong>{labels.noPrivateKeys}</strong>
          <small>{labels.localKeys}</small>
        </article>
        <article>
          <ShieldAlert size={18} />
          <span>{labels.lastResult}</span>
          <strong>{statusLabels[status]}</strong>
          <small>{detail}</small>
        </article>
      </div>
    </section>
  );
}
