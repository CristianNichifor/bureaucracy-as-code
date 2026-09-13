import { useState } from "react";
import { IndexedDbDocumentStore } from "../storage/IndexedDbDocumentStore";

const store = new IndexedDbDocumentStore();

export function HashVerifier({ expectedHash }: { expectedHash?: string }) {
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
        <h2>Response hash verifier</h2>
        {verified ? <span className="pill ok">verified</span> : <span className="pill">local</span>}
      </div>
      <input type="file" onChange={(event) => void onFile(event.target.files?.[0])} />
      <dl>
        <div>
          <dt>On-ledger hash</dt>
          <dd>{expectedHash ? `${expectedHash.slice(0, 28)}...` : "No final response yet"}</dd>
        </div>
        <div>
          <dt>Selected file hash</dt>
          <dd>{actualHash ? `${actualHash.slice(0, 28)}...` : "Choose a file to verify"}</dd>
        </div>
      </dl>
      {mismatch ? <p className="danger">The selected file does not match the recorded hash.</p> : null}
      {verified ? <p className="okText">The selected file matches the recorded response hash.</p> : null}
    </section>
  );
}
