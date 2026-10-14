import { useRef, useState } from "react";
import type { Dictionary } from "../i18n";
import { IndexedDbDocumentStore } from "../storage/IndexedDbDocumentStore";

const store = new IndexedDbDocumentStore();

export function HashVerifier({ expectedHash, labels }: { expectedHash?: string; labels: Dictionary["hash"] }) {
  const [actualHash, setActualHash] = useState<string>("");
  const input = useRef<HTMLInputElement>(null);

  async function onFile(file?: File) {
    if (!file) return;
    setActualHash(await store.hashFile(file));
  }

  function chooseAnother() {
    setActualHash("");
    if (input.current) input.current.value = "";
    input.current?.click();
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
      <div className="explainBox">
        <strong>{labels.explainLabel}</strong>
        <p>{labels.copy}</p>
      </div>
      <label className="civicButton civicButtonSecondary fileButton">
        {labels.chooseFile}
        <input aria-label={labels.chooseFile} ref={input} type="file" onChange={(event) => void onFile(event.target.files?.[0])} />
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
      {/* The result is always written in words: one live region per state, never a colour alone. */}
      {mismatch ? (
        <div className="verifierResult" role="alert">
          <p className="danger">
            <strong>{labels.mismatchTitle}</strong> {labels.mismatch}
          </p>
          <button className="civicButton civicButtonSecondary" onClick={chooseAnother} type="button">
            {labels.chooseAnother}
          </button>
        </div>
      ) : verified ? (
        <p className="okText" role="status">
          <strong>{labels.matchTitle}</strong> {labels.match}
        </p>
      ) : (
        <p className="panelCopy verifierWaiting" role="status">
          {actualHash && !expectedHash ? labels.noExpectedHash : labels.waiting}
        </p>
      )}
    </section>
  );
}
