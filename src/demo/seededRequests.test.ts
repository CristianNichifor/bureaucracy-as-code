import { describe, expect, it } from "vitest";
import { calculateExtendedLaw544Deadline, calculateLaw544Deadline } from "../law544/deadlines";
import { seededRequestScenarios } from "./seededRequests";

const DAY_MS = 24 * 60 * 60 * 1000;

function daysAfterCreation(createdAt: string, timestamp: string): number {
  return (Date.parse(timestamp) - Date.parse(createdAt)) / DAY_MS;
}

describe.each(seededRequestScenarios.map((scenario) => [scenario.request.id, scenario] as const))(
  "seeded request %s",
  (_id, { request, events }) => {
    const extension = events.find((event) => event.action === "Extension_Requested");
    const refusal = events.find((event) => event.action === "Request_Rejected");

    it("has the Law 544 deadline for its status", () => {
      const expected = extension
        ? calculateExtendedLaw544Deadline(request.createdAt)
        : calculateLaw544Deadline(request.createdAt);
      expect(request.deadlineAt).toBe(expected);
    });

    it("signs an extension within the first 10 days", () => {
      if (!extension) return;
      expect(daysAfterCreation(request.createdAt, extension.timestamp)).toBeLessThanOrEqual(10);
      expect(extension.metadata?.extensionDeadlineAt ?? request.deadlineAt).toBe(request.deadlineAt);
    });

    it("signs a refusal within 5 days", () => {
      if (!refusal) return;
      expect(daysAfterCreation(request.createdAt, refusal.timestamp)).toBeLessThanOrEqual(5);
    });
  },
);
