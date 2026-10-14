import { describe, expect, it } from "vitest";
import { describeDeadline, formatDays, statusSymbols, summarizeDeadline } from "./deadlineSummary";

const now = new Date("2026-09-13T09:00:00.000Z");
const day = (offset: number) => new Date(now.getTime() + offset * 24 * 60 * 60 * 1000).toISOString();

const ro = { daysRemaining: "{days} rămase", daysOverdue: "{days} întârziere", closed: "închisă", deadlineUnset: "se calculează la depunere" };

describe("summarizeDeadline", () => {
  it("counts overdue days for open requests past the deadline", () => {
    expect(summarizeDeadline({ status: "Overdue", deadlineAt: day(-36) }, now)).toEqual({ tone: "danger", days: 36 });
  });

  it("warns within seven days and is on track beyond", () => {
    expect(summarizeDeadline({ status: "InProgress", deadlineAt: day(3) }, now)).toEqual({ tone: "warning", days: 3 });
    expect(summarizeDeadline({ status: "Registered", deadlineAt: day(8) }, now)).toEqual({ tone: "ok", days: 8 });
  });

  it("closes resolved and rejected requests and leaves drafts unset", () => {
    expect(summarizeDeadline({ status: "Resolved", deadlineAt: day(-8) }, now).tone).toBe("closed");
    expect(summarizeDeadline({ status: "Rejected", deadlineAt: day(-3) }, now).tone).toBe("closed");
    expect(summarizeDeadline({ status: "Draft", deadlineAt: day(10) }, now).tone).toBe("unset");
  });
});

describe("formatDays", () => {
  it("uses the Romanian plural with 'de' from 20 upward", () => {
    expect(formatDays(1, "ro")).toBe("1 zi");
    expect(formatDays(3, "ro")).toBe("3 zile");
    expect(formatDays(19, "ro")).toBe("19 zile");
    expect(formatDays(36, "ro")).toBe("36 de zile");
    expect(formatDays(1, "en")).toBe("1 day");
    expect(formatDays(36, "en")).toBe("36 days");
  });
});

describe("describeDeadline", () => {
  it("writes the deadline state in words", () => {
    expect(describeDeadline({ tone: "danger", days: 36 }, ro, "ro")).toBe("36 de zile întârziere");
    expect(describeDeadline({ tone: "warning", days: 1 }, ro, "ro")).toBe("1 zi rămase");
    expect(describeDeadline({ tone: "closed", days: 0 }, ro, "ro")).toBe("închisă");
    expect(describeDeadline({ tone: "unset", days: 0 }, ro, "ro")).toBe("se calculează la depunere");
  });
});

describe("statusSymbols", () => {
  it("gives every status a symbol so colour is never the only signal", () => {
    expect(Object.keys(statusSymbols)).toHaveLength(9);
    expect(new Set(Object.values(statusSymbols)).size).toBeGreaterThan(3);
  });
});
