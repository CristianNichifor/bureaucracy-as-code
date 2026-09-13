import { describe, expect, it } from "vitest";
import { seededRequestScenarios } from "../demo/seededRequests";
import { buildPublicAuditReceipt, eventProofSummary, verifyPublicAuditReceipt } from "./auditReceipt";

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
      proof: {
        eventType: "law544.transition",
        signedPayloadHash: seededRequestScenarios[0].events[0].payloadHash,
        signature: seededRequestScenarios[0].events[0].signature,
      },
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

  it("verifies an unchanged public audit receipt", () => {
    const receipt = buildPublicAuditReceipt({
      exportedAt: "2026-09-14T12:00:00.000Z",
      item: { ...seededRequestScenarios[0], source: "seed" },
      language: "en",
    });

    expect(verifyPublicAuditReceipt(receipt)).toMatchObject({
      valid: true,
      checkedEvents: seededRequestScenarios[0].events.length,
      receiptId: seededRequestScenarios[0].request.id,
      headHash: seededRequestScenarios[0].events.at(-1)?.stateHash,
      responseDocumentHash: seededRequestScenarios[0].request.responseDocumentHash,
    });
  });

  it("rejects a receipt whose signed payload reference was edited", () => {
    const receipt = buildPublicAuditReceipt({
      exportedAt: "2026-09-14T12:00:00.000Z",
      item: { ...seededRequestScenarios[0], source: "seed" },
      language: "en",
    });
    const tampered = {
      ...receipt,
      evidence: receipt.evidence.map((entry, index) =>
        index === 0
          ? {
              ...entry,
              proof: { ...entry.proof, signedPayloadHash: "edited" },
            }
          : entry,
      ),
    };

    expect(verifyPublicAuditReceipt(tampered)).toMatchObject({
      valid: false,
      reason: "Signed payload hash no longer matches the event payload hash.",
    });
  });

  it("rejects a receipt whose hash-chain link was edited", () => {
    const receipt = buildPublicAuditReceipt({
      exportedAt: "2026-09-14T12:00:00.000Z",
      item: { ...seededRequestScenarios[0], source: "seed" },
      language: "en",
    });
    const tampered = {
      ...receipt,
      evidence: receipt.evidence.map((entry, index) =>
        index === 1
          ? {
              ...entry,
              hashes: { ...entry.hashes, previousState: "edited" },
            }
          : entry,
      ),
    };

    expect(verifyPublicAuditReceipt(tampered)).toMatchObject({
      valid: false,
      reason: "Receipt hash chain is broken between evidence entries.",
    });
  });

  it("summarizes the event proof fields displayed in the audit trail", () => {
    const event = seededRequestScenarios[0].events[0];

    expect(eventProofSummary(event)).toEqual({
      signerRole: event.signerRole,
      signerDidHash: event.signerDidHash,
      credentialHash: event.credentialHash,
      payloadHash: event.payloadHash,
      previousStateHash: event.previousStateHash,
      stateHash: event.stateHash,
      signature: event.signature,
    });
  });
});
