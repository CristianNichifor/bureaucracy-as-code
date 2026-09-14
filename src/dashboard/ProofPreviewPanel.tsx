import { FileJson, ListChecks, ShieldCheck } from "lucide-react";
import type { Dictionary, Language } from "../i18n";
import { buildPublicAuditReceipt, buildPublicProofReport } from "./auditReceipt";
import type { RequestExplorerItem } from "./requestExplorer";

export function ProofPreviewPanel({
  items,
  language,
  selectedItem,
  labels,
}: {
  items: RequestExplorerItem[];
  language: Language;
  selectedItem: RequestExplorerItem;
  labels: Dictionary["proofPreview"];
}) {
  const receipt = buildPublicAuditReceipt({
    exportedAt: "2026-09-14T12:00:00.000Z",
    item: selectedItem,
    language,
  });
  const report = buildPublicProofReport({
    exportedAt: "2026-09-14T12:00:00.000Z",
    items,
    language,
  });

  return (
    <section className="panel proofPreviewPanel" aria-labelledby="proof-preview-title">
      <div className="panelHeader">
        <div>
          <h2 id="proof-preview-title">{labels.title}</h2>
          <p className="panelCopy">{labels.copy}</p>
        </div>
        <span className="pill">{labels.localOnly}</span>
      </div>
      <div className="proofPreviewGrid">
        <div>
          <FileJson size={18} />
          <span>{labels.receipt}</span>
          <strong>{receipt.request.id}</strong>
          <small>{labels.receiptScope.replace("{count}", receipt.summary.eventCount.toString())}</small>
        </div>
        <div>
          <ListChecks size={18} />
          <span>{labels.report}</span>
          <strong>{labels.reportScope.replace("{count}", report.summary.requestCount.toString())}</strong>
          <small>{labels.reportEvents.replace("{count}", report.summary.eventCount.toString())}</small>
        </div>
        <div>
          <ShieldCheck size={18} />
          <span>{labels.privacy}</span>
          <strong>{receipt.privacy.personalData}</strong>
          <small>{labels.privacyCopy}</small>
        </div>
      </div>
      <dl className="proofPreviewList">
        <div>
          <dt>{labels.schema}</dt>
          <dd>{receipt.schema}</dd>
        </div>
        <div>
          <dt>{labels.chainHead}</dt>
          <dd>{receipt.summary.chainHead ? `${receipt.summary.chainHead.slice(0, 28)}...` : labels.none}</dd>
        </div>
        <div>
          <dt>{labels.responseHashes}</dt>
          <dd>{report.summary.responseHashCount}</dd>
        </div>
        <div>
          <dt>{labels.invalidChains}</dt>
          <dd>{report.summary.invalidChainCount}</dd>
        </div>
      </dl>
    </section>
  );
}
