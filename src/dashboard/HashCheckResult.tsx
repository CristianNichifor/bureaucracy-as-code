import type { Dictionary } from "../i18n";
import type { HashCheckState } from "./hashCheck";

/** The outcome in words: a match is announced politely, a mismatch as an alert with a way to try another file. */
export function HashCheckResult({
  state,
  labels,
  onChooseAgain,
}: {
  state: HashCheckState;
  labels: Dictionary["hash"];
  onChooseAgain: () => void;
}) {
  if (state === "match") {
    return (
      <p className="okText" role="status">
        {labels.match}
      </p>
    );
  }

  if (state === "mismatch") {
    return (
      <div role="alert">
        <p className="danger">{labels.mismatch}</p>
        <button className="civicButton civicButtonSecondary" onClick={onChooseAgain} type="button">
          {labels.chooseFile}
        </button>
      </div>
    );
  }

  return null;
}
