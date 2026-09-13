import { describe, expect, it } from "vitest";
import { seededRequestScenarios } from "../demo/seededRequests";
import { buildPublicAuditReceipt } from "./auditReceipt";

describe("public audit receipt", () => {
  it("exports portable public evidence without raw document data", () => {
    const receipt = buildPublicAuditReceipt({
      exportedAt: "2026-09-14T12:00:00.000Z",
      item: { ...seededRequestScenarios[0], source: "seed" },
      language: "en",
    });

    expect(receipt.schema).toBe("law544-public-audit-receipt/v2");
    expect(receipt.source).toBe("seeded-public-scenario");
    expect(receipt.summary.chainHead).toBe(seededRequestScenarios[0].events.at(-1)?.stateHash);
    expect(receipt.evidence[0]).toMatchObject({
      sequence: 1,
      action: "Request_Created",
      signer: { role: "Citizen" },
    });
    expect(JSON.stringify(receipt)).not.toContain("rawDocument");
    expect(JSON.stringify(receipt)).not.toContain("privateKey");
  });

  it("includes human verification steps for the selected response hash", () => {
    const receipt = buildPublicAuditReceipt({
      exportedAt: "2026-09-14T12:00:00.000Z",
      item: { ...seededRequestScenarios[0], source: "seed" },
      language: "ro",
    });

    expect(receipt.displayLanguage).toBe("ro");
    expect(receipt.verification.join(" ")).toContain("finalResponseDocumentHash");
    expect(receipt.summary.finalResponseDocumentHash).toBe(seededRequestScenarios[0].request.responseDocumentHash);
  });
});
