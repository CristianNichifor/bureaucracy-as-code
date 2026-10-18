/// <reference types="node" />
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync("src/styles.css", "utf8");
const block = (query: string) => css.slice(css.indexOf(`@media (${query})`));

describe("BAC-20 motion and forced colours", () => {
  it("turns transitions, animation and smooth scroll off for reduced motion", () => {
    const reduced = block("prefers-reduced-motion: reduce");
    expect(reduced).toMatch(/transition: none/);
    expect(reduced).toMatch(/animation: none/);
    expect(reduced).toMatch(/scroll-behavior: auto/);
  });
  it("marks the pressed toggle with more than its background in forced colours", () => {
    expect(block("forced-colors: active")).toMatch(
      /\.segmentedToggle button\[aria-pressed="true"\]\s*\{[^}]*(outline|border): [^;]*Highlight/,
    );
  });
});
