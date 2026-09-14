import { describe, expect, it } from "vitest";
import { seededRequestScenarios } from "../demo/seededRequests";
import {
  DEFAULT_EXPLORER_FILTERS,
  filterRequestExplorerItems,
  formatLaw544Status,
  getInstitutionOptions,
  getRequestLatestRole,
  getSelectedExplorerItem,
  getStatusSummaries,
  type RequestExplorerItem,
} from "./requestExplorer";

const items: RequestExplorerItem[] = seededRequestScenarios.map((scenario) => ({
  ...scenario,
  source: "seed",
}));

describe("request explorer helpers", () => {
  it("formats status values for public UI labels", () => {
    expect(formatLaw544Status("All")).toBe("All");
    expect(formatLaw544Status("InProgress")).toBe("In progress");
    expect(formatLaw544Status("ExtensionRequested")).toBe("Extension requested");
  });

  it("filters requests by status", () => {
    const resolved = filterRequestExplorerItems(items, {
      ...DEFAULT_EXPLORER_FILTERS,
      status: "Resolved",
    });

    expect(resolved.map((item) => item.request.id)).toEqual(["REQ-2026-0002", "REQ-2026-0008"]);
  });

  it("filters requests by institution", () => {
    const health = filterRequestExplorerItems(items, {
      ...DEFAULT_EXPLORER_FILTERS,
      institution: "Ministry of Health",
    });

    expect(health.map((item) => item.request.id)).toEqual(["REQ-2026-0003"]);
  });

  it("filters requests by signer role anywhere in the trail", () => {
    const directorSigned = filterRequestExplorerItems(items, {
      ...DEFAULT_EXPLORER_FILTERS,
      role: "Director",
    });

    expect(directorSigned.map((item) => item.request.id)).toEqual([
      "REQ-2026-0002",
      "REQ-2026-0003",
      "REQ-2026-0005",
      "REQ-2026-0006",
      "REQ-2026-0007",
      "REQ-2026-0008",
      "REQ-2026-0009",
      "REQ-2026-0010",
    ]);
  });

  it("returns sorted institution options", () => {
    expect(getInstitutionOptions(items)).toEqual([
      "City Hall Bucharest Sector 1",
      "Ministry of Education",
      "Ministry of Energy",
      "Ministry of Environment",
      "Ministry of Finance",
      "Ministry of Health",
      "Ministry of Transport",
      "National Agency for Cadastre",
      "National Authority for Consumer Protection",
    ]);
  });

  it("returns deterministic status summary counts", () => {
    expect(getStatusSummaries(items)).toEqual([
      { status: "ExtensionRequested", count: 2 },
      { status: "InProgress", count: 2 },
      { status: "Overdue", count: 1 },
      { status: "Registered", count: 1 },
      { status: "Rejected", count: 1 },
      { status: "Resolved", count: 2 },
    ]);
  });

  it("returns the latest signer role for a request", () => {
    expect(getRequestLatestRole(items[0].events)).toBe("PublicServant");
  });

  it("falls back to the first request when selected id is missing", () => {
    expect(getSelectedExplorerItem(items, "missing")?.request.id).toBe("REQ-2026-0002");
  });
});
