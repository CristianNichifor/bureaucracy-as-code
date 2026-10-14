import { describe, expect, it } from "vitest";
import {
  LAW544_EXTENDED_RESPONSE_DAYS,
  LAW544_REFUSAL_DAYS,
  LAW544_RESPONSE_DAYS,
  calculateExtendedLaw544Deadline,
  calculateLaw544Deadline,
  isOverdue,
} from "./deadlines";

const createdAt = "2026-10-01T09:00:00.000Z";

describe("Law 544/2001 deadlines", () => {
  it("uses the art. 7 terms: 10 days, 30 when extended, 5 for a refusal", () => {
    expect(LAW544_RESPONSE_DAYS).toBe(10);
    expect(LAW544_EXTENDED_RESPONSE_DAYS).toBe(30);
    expect(LAW544_REFUSAL_DAYS).toBe(5);
  });

  it("sets the answer deadline 10 days after registration", () => {
    expect(calculateLaw544Deadline(createdAt)).toBe("2026-10-11T09:00:00.000Z");
  });

  it("sets the extended deadline 30 days after registration", () => {
    expect(calculateExtendedLaw544Deadline(createdAt)).toBe("2026-10-31T09:00:00.000Z");
  });

  it("reports a deadline as overdue only after it passes", () => {
    expect(isOverdue("2026-10-11T09:00:00.000Z", new Date("2026-10-11T08:59:59.000Z"))).toBe(false);
    expect(isOverdue("2026-10-11T09:00:00.000Z", new Date("2026-10-11T09:00:01.000Z"))).toBe(true);
  });
});
