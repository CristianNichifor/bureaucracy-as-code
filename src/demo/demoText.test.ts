import { describe, expect, it } from "vitest";
import { localizeDemoText, romanianDemoText } from "./demoText";
import { createInitialDemoContext } from "./scenarioLaw544";
import { seededRequestScenarios } from "./seededRequests";

async function demoStrings(): Promise<string[]> {
  const scripted = await createInitialDemoContext();
  const requests = [...seededRequestScenarios.map((scenario) => scenario.request), scripted.request];
  return Array.from(new Set(requests.flatMap((request) => [request.institution, request.subject])));
}

describe("Romanian demo data", () => {
  it("has a Romanian version of every seeded institution and subject", async () => {
    const missing = (await demoStrings()).filter((text) => !romanianDemoText[text]?.trim());
    expect(missing).toEqual([]);
  });

  it("uses comma-below ș and ț, never the cedilla forms", () => {
    for (const text of Object.values(romanianDemoText)) {
      expect(text).not.toMatch(/[şţŞŢ]/);
    }
  });

  it("translates in Romanian and keeps English as is", () => {
    expect(localizeDemoText("Ministry of Finance", "ro")).toBe("Ministerul Finanțelor");
    expect(localizeDemoText("Ministry of Finance", "en")).toBe("Ministry of Finance");
  });

  it("leaves text without a Romanian version unchanged", () => {
    expect(localizeDemoText("A citizen's own subject", "ro")).toBe("A citizen's own subject");
  });
});
