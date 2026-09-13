import { describe, expect, it } from "vitest";
import { seededRequestScenarios } from "../demo/seededRequests";
import {
  DEFAULT_EXPLORER_FILTERS,
  filterRequestExplorerItems,
  getInstitutionOptions,
  getRequestLatestRole,
  getSelectedExplorerItem,
  type RequestExplorerItem,
} from "./requestExplorer";

const items: RequestExplorerItem[] = seededRequestScenarios.map((scenario) => ({
  ...scenario,
  source: "seed",
}));

describe("request explorer helpers", () => {
  it("filters requests by status", () => {
    const resolved = filterRequestExplorerItems(items, {
      ...DEFAULT_EXPLORER_FILTERS,
      status: "Resolved",
    });

    expect(resolved.map((item) => item.request.id)).toEqual(["REQ-2026-0002"]);
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

    expect(directorSigned.map((item) => item.request.id)).toEqual(["REQ-2026-0002", "REQ-2026-0003"]);
  });

  it("returns sorted institution options", () => {
    expect(getInstitutionOptions(items)).toEqual([
      "City Hall Bucharest Sector 1",
      "Ministry of Finance",
      "Ministry of Health",
    ]);
  });

  it("returns the latest signer role for a request", () => {
    expect(getRequestLatestRole(items[0].events)).toBe("PublicServant");
  });

  it("falls back to the first request when selected id is missing", () => {
    expect(getSelectedExplorerItem(items, "missing")?.request.id).toBe("REQ-2026-0002");
  });
});
