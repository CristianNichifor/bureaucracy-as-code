import type { Language } from "../i18n";
import type { Law544Request } from "../law544/types";
import type { RequestExplorerItem } from "./requestExplorer";

export type PublicAuditReceipt = ReturnType<typeof buildPublicAuditReceipt>;

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
    })),
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
