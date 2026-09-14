import { useMemo, useState } from "react";
import type { Dictionary, Language } from "../i18n";
import { buildPublicAuditReceipt, verifyPublicAuditReceipt, type PublicAuditReceiptVerification } from "./auditReceipt";
import type { RequestExplorerItem } from "./requestExplorer";

export function AuditReceiptVerifier({
  item,
  language,
  labels,
}: {
  item: RequestExplorerItem;
  language: Language;
  labels: Dictionary["receipt"];
}) {
  const [result, setResult] = useState<PublicAuditReceiptVerification | null>(null);
  const [loadedName, setLoadedName] = useState<string>("");

  const demoReceipt = useMemo(
    () =>
      buildPublicAuditReceipt({
        exportedAt: "2026-09-14T12:00:00.000Z",
        item,
        language,
      }),
    [item, language],
  );

  async function onFile(file?: File) {
    if (!file) return;

    try {
      setLoadedName(file.name);
      setResult(verifyPublicAuditReceipt(JSON.parse(await file.text())));
    } catch {
      setResult({ valid: false, checkedEvents: 0, reason: "Receipt file is not valid JSON." });
    }
  }

  function runTamperDemo() {
    const tamperedReceipt = {
      ...demoReceipt,
      summary:
        demoReceipt.evidence.length === 0
          ? { ...demoReceipt.summary, eventCount: demoReceipt.summary.eventCount + 1 }
          : demoReceipt.summary,
      evidence:
        demoReceipt.evidence.length === 0
          ? demoReceipt.evidence
          : demoReceipt.evidence.map((entry, index) =>
              index === demoReceipt.evidence.length - 1
                ? {
                    ...entry,
                    proof: {
                      ...entry.proof,
                      signedPayloadHash: replaceLastHexCharacter(entry.proof.signedPayloadHash),
                    },
                  }
                : entry,
            ),
    };

    setLoadedName(`${item.request.id}-tampered-audit-receipt.json`);
    setResult(verifyPublicAuditReceipt(tamperedReceipt));
  }

  const status = result?.valid ? labels.verified : result ? labels.failed : labels.local;

  return (
    <section className="panel verifierPanel">
      <div className="panelHeader">
        <h2>{labels.title}</h2>
        <span className={result?.valid ? "pill ok" : result ? "pill dangerPill" : "pill"}>{status}</span>
      </div>
      <p className="panelCopy">{labels.copy}</p>
      <div className="verifierActions">
        <label className="civicButton civicButtonSecondary fileButton">
          {labels.chooseFile}
          <input
            accept="application/json"
            aria-label={labels.chooseReceipt}
            type="file"
            onChange={(event) => void onFile(event.target.files?.[0])}
          />
        </label>
        <button className="civicButton panelAction" onClick={runTamperDemo} type="button">
          {labels.tamperButton}
        </button>
      </div>
      <div className={`receiptResult ${result?.valid ? "receiptResult-ok" : result ? "receiptResult-danger" : ""}`}>
        <div>
          <span>{labels.verdict}</span>
          <strong>{status}</strong>
        </div>
        <div>
          <span>{labels.receiptId}</span>
          <strong>{result?.receiptId ?? labels.noReceipt}</strong>
        </div>
        <div>
          <span>{labels.eventsChecked}</span>
          <strong>{result?.checkedEvents ?? 0}</strong>
        </div>
      </div>
      <dl>
        <div>
          <dt>{labels.loadedReceipt}</dt>
          <dd>{loadedName || labels.noReceipt}</dd>
        </div>
        <div>
          <dt>{labels.eventsChecked}</dt>
          <dd>{result?.checkedEvents ?? 0}</dd>
        </div>
        <div>
          <dt>{labels.chainHead}</dt>
          <dd>{result?.headHash ? `${result.headHash.slice(0, 28)}...` : labels.noReceipt}</dd>
        </div>
        <div>
          <dt>{labels.responseHash}</dt>
          <dd>{result?.responseDocumentHash ? `${result.responseDocumentHash.slice(0, 28)}...` : labels.noReceipt}</dd>
        </div>
        <div>
          <dt>{labels.reason}</dt>
          <dd>{result?.reason ?? labels.noReceipt}</dd>
        </div>
      </dl>
      {result?.reason ? <p className="danger">{result.reason}</p> : null}
    </section>
  );
}

function replaceLastHexCharacter(value: string): string {
  const replacement = value.endsWith("0") ? "1" : "0";
  return `${value.slice(0, -1)}${replacement}`;
}
