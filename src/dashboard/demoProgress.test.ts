import { describe, expect, it } from "vitest";
import { demoSteps, getCurrentStepIndex, isStepAvailable } from "./demoProgress";

describe("demo progress", () => {
  it("starts with the submission step", () => {
    expect(getCurrentStepIndex("Draft", 0)).toBe(0);
    expect(isStepAvailable({ step: demoSteps[0], status: "Draft", eventsCount: 0 })).toBe(true);
  });

  it("keeps the evidence step active until a document has been attached", () => {
    expect(getCurrentStepIndex("InProgress", 4)).toBe(4);
    expect(getCurrentStepIndex("InProgress", 5)).toBe(5);
  });

  it("marks terminal states as complete", () => {
    expect(getCurrentStepIndex("Resolved", 6)).toBe(demoSteps.length);
    expect(isStepAvailable({ step: demoSteps[5], status: "Resolved", eventsCount: 6 })).toBe(false);
  });
});
