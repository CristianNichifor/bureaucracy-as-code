import { describe, expect, it } from "vitest";
import { seededRequestScenarios } from "../demo/seededRequests";
import {
  DEFAULT_EXPLORER_FILTERS,
  filterRequestExplorerItems,
  formatLaw544Status,
  getExplorerCounts,
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

  it("searches by request subject and institution", () => {
    const result = filterRequestExplorerItems(items, {
      ...DEFAULT_EXPLORER_FILTERS,
      query: "rail",
    });

    expect(result.map((item) => item.request.id)).toEqual(["REQ-2026-0008"]);
  });

  it("filters requests by signer role anywhere in the trail", () => {
    const directorSigned = filterRequestExplorerItems(items, {
      ...DEFAULT_EXPLORER_FILTERS,
      role: "Director",
    });

    expect(directorSigned.map((item) => item.request.id)).toEqual([
      "REQ-2026-0006",
      "REQ-2026-0002",
      "REQ-2026-0007",
      "REQ-2026-0008",
      "REQ-2026-0010",
      "REQ-2026-0003",
      "REQ-2026-0009",
      "REQ-2026-0005",
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

  it("sorts visible requests by event count", () => {
    const result = filterRequestExplorerItems(items, {
      ...DEFAULT_EXPLORER_FILTERS,
      sort: "events-desc",
    });

    expect(result[0].events.length).toBeGreaterThanOrEqual(result[1].events.length);
  });

  it("returns the latest signer role for a request", () => {
    expect(getRequestLatestRole(items[0].events)).toBe("PublicServant");
  });

  it("falls back to the first request when selected id is missing", () => {
    expect(getSelectedExplorerItem(items, "missing")?.request.id).toBe("REQ-2026-0002");
  });

  it("counts institutions, open, overdue and finished requests for the explorer tiles", () => {
    // The seeds are dated around 2026-09-13T09:00Z.
    expect(getExplorerCounts(items, new Date("2026-09-13T09:00:00.000Z"))).toEqual({
      institutions: 9,
      open: 6,
      overdue: 1,
      finished: 3,
    });
  });

  it("counts open requests past their deadline as overdue", () => {
    expect(getExplorerCounts(items, new Date("2026-09-23T09:00:00.001Z")).overdue).toBe(6);
  });

  // docs/design/README.md: "the nine seeded requests plus the live draft (9 institutions,
  // 7 open, 1 overdue, 3 closed)" - the live draft counts as open, but has no deadline yet.
  it("counts the live draft as open but never as overdue", () => {
    const draft: RequestExplorerItem = {
      ...items[0],
      request: { ...items[0].request, id: "REQ-DRAFT", status: "Draft" },
      events: [],
      source: "active",
    };
    expect(getExplorerCounts([draft], new Date("2030-01-01T00:00:00.000Z"))).toEqual({
      institutions: 1,
      open: 1,
      overdue: 0,
      finished: 0,
    });
    expect(getExplorerCounts([...items, draft], new Date("2026-09-13T09:00:00.000Z")).open).toBe(7);
  });
});
