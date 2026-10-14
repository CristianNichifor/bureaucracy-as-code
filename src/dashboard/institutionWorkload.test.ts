import { describe, expect, it } from "vitest";
import { seededRequestScenarios } from "../demo/seededRequests";
import { getInstitutionWorkloads, isRequestOverdue } from "./institutionWorkload";
import type { RequestExplorerItem } from "./requestExplorer";

const now = new Date("2026-09-13T09:00:00.000Z");
const items: RequestExplorerItem[] = seededRequestScenarios.map((scenario) => ({ ...scenario, source: "seed" }));

describe("getInstitutionWorkloads", () => {
  it("puts the institution with an overdue file first and closed ones last", () => {
    const rows = getInstitutionWorkloads(items, now);

    expect(rows[0]).toMatchObject({ institution: "National Agency for Cadastre", overdue: 1, open: 1, queue: "escalation" });
    expect(rows[0].daysUntil).toBe(-36);
    expect(rows.at(-1)?.open).toBe(0);
    expect(rows.at(-1)?.queue).toBe("closed");
    expect(rows.at(-1)?.daysUntil).toBeNull();
  });

  it("counts one row per institution with totals that add up", () => {
    const rows = getInstitutionWorkloads(items, now);

    expect(rows).toHaveLength(new Set(items.map((item) => item.request.institution)).size);
    expect(rows.reduce((sum, row) => sum + row.total, 0)).toBe(items.length);
    for (const row of rows) expect(row.open + row.resolved).toBe(row.total);
  });

  it("picks the earliest open deadline as the next file", () => {
    const rows = getInstitutionWorkloads(items, now);
    const health = rows.find((row) => row.institution === "Ministry of Health");

    expect(health?.urgent?.id).toBe("REQ-2026-0003");
    expect(health?.daysUntil).toBe(3);
    expect(health?.queue).toBe("officer");
  });
});

describe("isRequestOverdue", () => {
  it("treats a closed request past its deadline as not overdue", () => {
    expect(isRequestOverdue({ status: "Resolved", deadlineAt: "2026-09-05T09:00:00.000Z" }, now)).toBe(false);
    expect(isRequestOverdue({ status: "InProgress", deadlineAt: "2026-09-05T09:00:00.000Z" }, now)).toBe(true);
  });
});
