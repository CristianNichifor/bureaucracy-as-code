import { describe, expect, it } from "vitest";
import { dictionaries } from "../i18n";
import { detailDeadline } from "./RequestDetail";

// BAC-17: the request header says the deadline status in words, with the explorer's wording.
const now = new Date("2026-09-13T09:00:00.000Z");
const at = (days: number) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000).toISOString();

describe("detailDeadline", () => {
  it("says a closed request is closed, not how many days it had left", () => {
    const d = detailDeadline({ status: "Resolved", deadlineAt: at(5) }, dictionaries.ro.detail, "ro", now);
    expect(d).toMatchObject({ tone: "closed", label: "Închisă", copy: "" });
  });

  it("uses Romanian plurals for days overdue and remaining", () => {
    expect(detailDeadline({ status: "InProgress", deadlineAt: at(-36) }, dictionaries.ro.detail, "ro", now).copy)
      .toBe("36 de zile întârziere");
    expect(detailDeadline({ status: "InProgress", deadlineAt: at(3) }, dictionaries.ro.detail, "ro", now).copy)
      .toBe("3 zile rămase");
    expect(detailDeadline({ status: "InProgress", deadlineAt: at(1) }, dictionaries.en.detail, "en", now).copy)
      .toBe("1 day remaining");
  });

  it("does not count days for a draft, whose deadline starts at submission", () => {
    const d = detailDeadline({ status: "Draft", deadlineAt: at(10) }, dictionaries.en.detail, "en", now);
    expect(d).toMatchObject({ tone: "unset", copy: "" });
    expect(d.label).toBe(dictionaries.en.detail.deadlineUnset);
  });
});
