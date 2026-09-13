import type { Language } from "../i18n";
import type { Law544Request } from "../law544/types";
import type { LedgerEvent } from "../ledger/types";
import type { RequestExplorerItem } from "./requestExplorer";

export type PublicAuditReceipt = ReturnType<typeof buildPublicAuditReceipt>;

export type PublicAuditReceiptVerification = {
  valid: boolean;
  checkedEvents: number;
  receiptId?: string;
  headHash?: string;
  responseDocumentHash?: string;
  reason?: string;
};

export function buildPublicAuditReceipt({
  exportedAt,
  item,
  language,
}: {
  exportedAt: string;
  item: RequestExplorerItem;
  language: Language;
}) {
  const finalEvent = item.events.at(-1);
  const request = toPublicRequest(item.request);

  return {
    schema: "law544-public-audit-receipt/v2",
    exportedAt,
    displayLanguage: language,
    title: `Public audit receipt for ${request.id}`,
    caveat:
      "This browser-demo receipt contains public verification evidence only. It does not contain raw documents, private keys, or personal data.",
    source: item.source === "active" ? "live-browser-chain" : "seeded-public-scenario",
    request,
    summary: {
      currentStatus: request.status,
      institution: request.institution,
      eventCount: item.events.length,
      firstRecordedAt: item.events[0]?.timestamp,
      lastRecordedAt: finalEvent?.timestamp,
      latestSignerRole: finalEvent?.signerRole,
      finalResponseDocumentHash: request.responseDocumentHash,
      chainHead: finalEvent?.stateHash,
    },
    privacy: {
      citizenIdentity: "pseudonymous-did-hash",
      documents: "off-receipt",
      personalData: "not-included",
    },
    verification: [
      "Check each event stateHash against the previous event previousStateHash.",
      "Verify every payloadHash, signerDidHash, credentialHash, and signature with the authoritative ledger and identity provider.",
      "Hash the response document locally and compare it with finalResponseDocumentHash.",
      "Treat this receipt as portable evidence for review, not as the production source of truth.",
    ],
    evidence: item.events.map((event, index) => ({
      sequence: index + 1,
      ledgerIndex: event.index,
      action: event.action,
      state: {
        from: event.fromStatus,
        to: event.toStatus,
      },
      recordedAt: event.timestamp,
      signer: {
        role: event.signerRole,
        didHash: event.signerDidHash,
        credentialHash: event.credentialHash,
      },
      hashes: {
        payload: event.payloadHash,
        document: event.documentHash,
        previousState: event.previousStateHash,
        state: event.stateHash,
      },
      metadata: event.metadata,
      proof: {
        eventSchemaVersion: event.schemaVersion ?? "law544-ledger-event/v1",
        eventType: event.eventType ?? "law544.transition",
        signedPayloadHash: event.payloadHash,
        signature: event.signature,
        signatureScope: "canonical transition payload hash",
      },
    })),
  };
}

export function verifyPublicAuditReceipt(receipt: unknown): PublicAuditReceiptVerification {
  if (!isReceiptObject(receipt)) {
    return { valid: false, checkedEvents: 0, reason: "Receipt is not a JSON object." };
  }

  const evidence = Array.isArray(receipt.evidence) ? receipt.evidence : null;
  if (receipt.schema !== "law544-public-audit-receipt/v2" || !evidence) {
    return { valid: false, checkedEvents: 0, reason: "Receipt schema is not supported." };
  }

  const summary = isReceiptObject(receipt.summary) ? receipt.summary : {};
  const request = isReceiptObject(receipt.request) ? receipt.request : {};
  const expectedEventCount = typeof summary.eventCount === "number" ? summary.eventCount : undefined;

  if (expectedEventCount !== evidence.length) {
    return {
      valid: false,
      checkedEvents: evidence.length,
      receiptId: stringValue(request.id),
      reason: "Receipt event count does not match the evidence trail.",
    };
  }

  let previousStateHash: string | undefined;

  for (const [index, entry] of evidence.entries()) {
    if (!isReceiptObject(entry)) {
      return {
        valid: false,
        checkedEvents: index,
        receiptId: stringValue(request.id),
        reason: "Evidence entry is not an object.",
      };
    }

    const sequence = typeof entry.sequence === "number" ? entry.sequence : undefined;
    const hashes = isReceiptObject(entry.hashes) ? entry.hashes : {};
    const proof = isReceiptObject(entry.proof) ? entry.proof : {};
    const stateHash = stringValue(hashes.state);
    const entryPreviousStateHash = stringValue(hashes.previousState);
    const signedPayloadHash = stringValue(proof.signedPayloadHash);
    const payloadHash = stringValue(hashes.payload);
    const signature = stringValue(proof.signature);

    if (sequence !== index + 1) {
      return {
        valid: false,
        checkedEvents: index,
        receiptId: stringValue(request.id),
        reason: "Evidence sequence is out of order.",
      };
    }

    if (!stateHash || !entryPreviousStateHash || !payloadHash || !signedPayloadHash || !signature) {
      return {
        valid: false,
        checkedEvents: index,
        receiptId: stringValue(request.id),
        reason: "Evidence is missing hash or signature proof fields.",
      };
    }

    if (signedPayloadHash !== payloadHash) {
      return {
        valid: false,
        checkedEvents: index + 1,
        receiptId: stringValue(request.id),
        reason: "Signed payload hash no longer matches the event payload hash.",
      };
    }

    if (previousStateHash && entryPreviousStateHash !== previousStateHash) {
      return {
        valid: false,
        checkedEvents: index + 1,
        receiptId: stringValue(request.id),
        reason: "Receipt hash chain is broken between evidence entries.",
      };
    }

    previousStateHash = stateHash;
  }

  const headHash = previousStateHash;
  if (stringValue(summary.chainHead) !== headHash) {
    return {
      valid: false,
      checkedEvents: evidence.length,
      receiptId: stringValue(request.id),
      headHash,
      reason: "Receipt summary chain head does not match the evidence trail.",
    };
  }

  const responseDocumentHash = stringValue(summary.finalResponseDocumentHash);
  const requestResponseHash = stringValue(request.responseDocumentHash);
  if (responseDocumentHash && requestResponseHash && responseDocumentHash !== requestResponseHash) {
    return {
      valid: false,
      checkedEvents: evidence.length,
      receiptId: stringValue(request.id),
      headHash,
      reason: "Receipt response hash does not match the public request summary.",
    };
  }

  return {
    valid: true,
    checkedEvents: evidence.length,
    receiptId: stringValue(request.id),
    headHash,
    responseDocumentHash,
  };
}

function toPublicRequest(request: Law544Request) {
  return {
    id: request.id,
    institution: request.institution,
    subject: request.subject,
    status: request.status,
    createdAt: request.createdAt,
    deadlineAt: request.deadlineAt,
    registryNumber: request.registryNumber,
    citizenDidHash: request.citizenDidHash,
    assignedToDidHash: request.assignedToDidHash,
    responseDocumentHash: request.responseDocumentHash,
  };
}

export function eventProofSummary(event: LedgerEvent) {
  return {
    signerRole: event.signerRole,
    signerDidHash: event.signerDidHash,
    credentialHash: event.credentialHash,
    payloadHash: event.payloadHash,
    previousStateHash: event.previousStateHash,
    stateHash: event.stateHash,
    signature: event.signature,
  };
}

function isReceiptObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stringValue(value: unknown): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}
