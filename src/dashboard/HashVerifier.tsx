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

  const verified = Boolean(expectedHash && actualHash && expectedHash === actualHash);
  const mismatch = Boolean(expectedHash && actualHash && expectedHash !== actualHash);
  const status = verified ? labels.verified : mismatch ? labels.mismatch : actualHash ? labels.local : labels.waiting;

  return (
    <section className="panel verifierPanel">
      <div className="panelHeader">
        <h2>{labels.title}</h2>
        <span className={verified ? "pill ok" : mismatch ? "pill dangerPill" : "pill"}>{status}</span>
      </div>
      <p className="panelCopy">{labels.copy}</p>
      <label className="fileButton">
        {labels.chooseFile}
        <input aria-label={labels.chooseFile} type="file" onChange={(event) => void onFile(event.target.files?.[0])} />
      </label>
      <dl>
        <div>
          <dt>{labels.onLedgerHash}</dt>
          <dd>{expectedHash ?? labels.noFinalResponse}</dd>
        </div>
        <div>
          <dt>{labels.selectedFileHash}</dt>
          <dd>{actualHash || labels.chooseFileToVerify}</dd>
        </div>
      </dl>
      {mismatch ? <p className="danger">{labels.mismatch}</p> : null}
      {verified ? <p className="okText">{labels.match}</p> : null}
    </section>
  );
}
