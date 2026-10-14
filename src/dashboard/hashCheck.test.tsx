import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { dictionaries } from "../i18n";
import { HashCheckResult } from "./HashCheckResult";
import { getHashCheckState } from "./hashCheck";

const expected = "a".repeat(64);

describe("response hash check states (BAC-17)", () => {
  it("waits until a file is chosen", () => {
    expect(getHashCheckState(expected, "")).toBe("waiting");
  });

  it("matches when the file hash equals the recorded hash", () => {
    expect(getHashCheckState(expected, expected)).toBe("match");
  });

  it("flags a different file as a mismatch", () => {
    expect(getHashCheckState(expected, "b".repeat(64))).toBe("mismatch");
  });

  it("reports a local hash only when no final response is recorded", () => {
    expect(getHashCheckState(undefined, "b".repeat(64))).toBe("local");
  });

  it.each(["en", "ro"] as const)("announces a match politely and a mismatch as an alert in %s", (language) => {
    const labels = dictionaries[language].hash;
    const render = (state: Parameters<typeof HashCheckResult>[0]["state"]) =>
      renderToString(createElement(HashCheckResult, { state, labels, onChooseAgain: () => undefined }));

    expect(render("waiting")).toBe("");

    const match = render("match");
    expect(match).toContain('role="status"');
    expect(match).toContain(labels.match);

    const mismatch = render("mismatch");
    expect(mismatch).toContain('role="alert"');
    expect(mismatch).toContain(labels.mismatch);
    expect(mismatch).toMatch(/<button[^>]*type="button"[^>]*>/);
    expect(mismatch).toContain(labels.chooseFile);
  });
});
