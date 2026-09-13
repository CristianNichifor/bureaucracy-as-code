import { useState } from "react";
import type { Dictionary } from "../i18n";
import { IndexedDbDocumentStore } from "../storage/IndexedDbDocumentStore";

const store = new IndexedDbDocumentStore();

export function HashVerifier({ expectedHash, labels }: { expectedHash?: string; labels: Dictionary["hash"] }) {
  const [actualHash, setActualHash] = useState<string>("");

  async function onFile(file?: File) {
    if (!file) return;
    setActualHash(await store.hashFile(file));
  }

  const verified = expectedHash && actualHash && expectedHash === actualHash;
  const mismatch = expectedHash && actualHash && expectedHash !== actualHash;

  return (
    <section className="panel">
      <div className="panelHeader">
        <h2>{labels.title}</h2>
        {verified ? <span className="pill ok">{labels.verified}</span> : <span className="pill">{labels.local}</span>}
      </div>
      <p className="panelCopy">{labels.copy}</p>
      <input aria-label={labels.chooseFile} type="file" onChange={(event) => void onFile(event.target.files?.[0])} />
      <dl>
        <div>
          <dt>{labels.onLedgerHash}</dt>
          <dd>{expectedHash ? `${expectedHash.slice(0, 28)}...` : labels.noFinalResponse}</dd>
        </div>
        <div>
          <dt>{labels.selectedFileHash}</dt>
          <dd>{actualHash ? `${actualHash.slice(0, 28)}...` : labels.chooseFileToVerify}</dd>
        </div>
      </dl>
      {mismatch ? <p className="danger">{labels.mismatch}</p> : null}
      {verified ? <p className="okText">{labels.match}</p> : null}
    </section>
  );
}
