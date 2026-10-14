import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { scrollBehavior } from "./motion";

const css = readFileSync(new URL("../styles.css", import.meta.url), "utf8");

function mediaBlock(query: string): string {
  const start = css.indexOf(`@media (${query})`);
  expect(start, `missing @media (${query})`).toBeGreaterThanOrEqual(0);
  return css.slice(start, css.indexOf("\n}\n", start));
}

describe("motion and contrast preferences", () => {
  it("removes transitions, animations and smooth scrolling for reduced motion", () => {
    const block = mediaBlock("prefers-reduced-motion: reduce");
    expect(block).toMatch(/transition-duration:\s*0\.01ms !important/);
    expect(block).toMatch(/animation-duration:\s*0\.01ms !important/);
    expect(block).toMatch(/scroll-behavior:\s*auto !important/);
  });

  it("keeps controls, statuses and focus visible in forced colours", () => {
    const block = mediaBlock("forced-colors: active");
    expect(block).toMatch(/\.status/);
    expect(block).toMatch(/aria-pressed="true"/);
    expect(block).toMatch(/:focus-visible/);
    expect(block).toMatch(/CanvasText|ButtonText/);
    expect(block).toMatch(/Highlight/);
  });

  it("scrolls without animation when the reader asks for reduced motion", () => {
    expect(scrollBehavior(() => true)).toBe("auto");
    expect(scrollBehavior(() => false)).toBe("smooth");
  });
});
