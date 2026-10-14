import { describe, expect, it } from "vitest";
import type { Language } from "./i18n";
import {
  actionLabels,
  describeEvent,
  formatDate,
  formatDateTime,
  formatLaw544Status,
  formatRole,
  roleLabels,
  statusLabels,
} from "./locale";

const languages: Language[] = ["en", "ro"];
// Midday UTC keeps the calendar day the same in every time zone the tests may run in.
const midday = "2026-10-04T12:00:00.000Z";

describe("dates", () => {
  it("writes Romanian dates as dd.mm.yyyy", () => {
    expect(formatDate(midday, "ro")).toBe("04.10.2026");
  });

  it("writes English dates with a short month name", () => {
    expect(formatDate(midday, "en")).toBe("4 Oct 2026");
  });

  it("adds the time for timestamps", () => {
    expect(formatDateTime(midday, "ro")).toMatch(/^04\.10\.2026, \d{2}:\d{2}$/);
    expect(formatDateTime(midday, "en")).toMatch(/^4 Oct 2026, \d{2}:\d{2}$/);
  });

  it("returns the input when it is not a date", () => {
    expect(formatDate("not a date", "ro")).toBe("not a date");
  });
});

describe("domain labels", () => {
  it.each(languages)("labels every status, role and action in %s", (language) => {
    for (const label of [
      ...Object.values(statusLabels[language]),
      ...Object.values(roleLabels[language]),
      ...Object.values(actionLabels[language]),
    ]) {
      expect(label).not.toMatch(/_|[a-z][A-Z]/);
      expect(label.length).toBeGreaterThan(2);
    }
    expect(Object.keys(statusLabels[language]).sort()).toEqual(Object.keys(statusLabels.en).sort());
    expect(Object.keys(roleLabels[language]).sort()).toEqual(Object.keys(roleLabels.en).sort());
    expect(Object.keys(actionLabels[language]).sort()).toEqual(Object.keys(actionLabels.en).sort());
  });

  it("translates statuses and roles", () => {
    expect(formatLaw544Status("Resolved", "ro")).toBe("Soluționată");
    expect(formatLaw544Status("InProgress", "en")).toBe("In progress");
    expect(formatLaw544Status("All", "ro")).toBe("Toate");
    expect(formatRole("PublicServant", "ro")).toBe("Funcționar public");
    expect(formatRole("RegistryBot", "en")).toBe("Registry");
  });

  it("describes a ledger event as a sentence", () => {
    expect(describeEvent({ action: "Registry_Assigned", signerRole: "RegistryBot" }, "en")).toBe(
      "Registry number assigned, signed by Registry",
    );
    expect(describeEvent({ action: "Request_Resolved", signerRole: "PublicServant" }, "ro")).toBe(
      "Răspuns comunicat, semnat de Funcționar public",
    );
  });
});
