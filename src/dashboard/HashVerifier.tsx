import { useRef, useState } from "react";
import type { Dictionary } from "../i18n";
import { IndexedDbDocumentStore } from "../storage/IndexedDbDocumentStore";
import { HashCheckResult } from "./HashCheckResult";
import { getHashCheckState } from "./hashCheck";

const store = new IndexedDbDocumentStore();

export function HashVerifier({ expectedHash, labels }: { expectedHash?: string; labels: Dictionary["hash"] }) {
  const [actualHash, setActualHash] = useState<string>("");
  const fileInput = useRef<HTMLInputElement>(null);

  async function onFile(file?: File) {
    if (!file) return;
    setActualHash(await store.hashFile(file));
  }

  const state = getHashCheckState(expectedHash, actualHash);
  const verified = state === "match";
  const mismatch = state === "mismatch";
  const status = verified ? labels.verified : mismatch ? labels.mismatch : state === "local" ? labels.local : labels.waiting;

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
        <input ref={fileInput} aria-label={labels.chooseFile} type="file" onChange={(event) => void onFile(event.target.files?.[0])} />
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
      <HashCheckResult state={state} labels={labels} onChooseAgain={() => fileInput.current?.click()} />
    </section>
  );
}
