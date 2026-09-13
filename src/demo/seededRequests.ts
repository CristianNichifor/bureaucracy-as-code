import type { DemoRole } from "../identity/types";
import type { Law544Action, Law544Request, Law544Status } from "../law544/types";
import type { LedgerEvent } from "../ledger/types";

const now = Date.parse("2026-09-13T09:00:00.000Z");

function iso(daysOffset: number): string {
  return new Date(now + daysOffset * 24 * 60 * 60 * 1000).toISOString();
}

function hash(seed: string): string {
  return seed.padEnd(64, seed.at(-1) ?? "0").slice(0, 64);
}

function event(input: {
  requestId: string;
  index: number;
  action: Law544Action;
  fromStatus: Law544Status;
  toStatus: Law544Status;
  signerRole: DemoRole;
  day: number;
  documentHash?: string;
  metadata?: Record<string, string>;
}): LedgerEvent {
  return {
    requestId: input.requestId,
    action: input.action,
    fromStatus: input.fromStatus,
    toStatus: input.toStatus,
    payloadHash: hash(`${input.requestId}${input.index}a`),
    documentHash: input.documentHash,
    signerDidHash: hash(`${input.signerRole}${input.requestId}${input.index}b`),
    signerRole: input.signerRole,
    credentialHash: hash(`${input.signerRole}${input.requestId}${input.index}c`),
    signature: `demo-signature-${input.requestId}-${input.index}`,
    timestamp: iso(input.day),
    metadata: input.metadata,
    index: input.index,
    previousStateHash: input.index === 0 ? hash("0") : hash(`${input.requestId}${input.index - 1}d`),
    stateHash: hash(`${input.requestId}${input.index}d`),
  };
}

export type SeededRequestScenario = {
  request: Law544Request;
  events: LedgerEvent[];
};

export const seededRequestScenarios: SeededRequestScenario[] = [
  {
    request: {
      id: "REQ-2026-0002",
      institution: "Ministry of Finance",
      subject: "Budget execution for a county road program",
      citizenDidHash: hash("citizen-finance"),
      status: "Resolved",
      createdAt: iso(-18),
      deadlineAt: iso(12),
      registryNumber: "MF-544-2026-0002",
      assignedToDidHash: hash("finance-servant").slice(0, 24),
      responseDocumentHash: hash("finance-response"),
    },
    events: [
      event({ requestId: "REQ-2026-0002", index: 0, action: "Request_Created", fromStatus: "Draft", toStatus: "Created", signerRole: "Citizen", day: -18 }),
      event({
        requestId: "REQ-2026-0002",
        index: 1,
        action: "Registry_Assigned",
        fromStatus: "Created",
        toStatus: "Registered",
        signerRole: "RegistryBot",
        day: -17,
        metadata: { registryNumber: "MF-544-2026-0002" },
      }),
      event({
        requestId: "REQ-2026-0002",
        index: 2,
        action: "Task_Routed",
        fromStatus: "Registered",
        toStatus: "Routed",
        signerRole: "Director",
        day: -16,
        metadata: { assignedToDidHash: hash("finance-servant").slice(0, 24) },
      }),
      event({ requestId: "REQ-2026-0002", index: 3, action: "Processing_Started", fromStatus: "Routed", toStatus: "InProgress", signerRole: "PublicServant", day: -15 }),
      event({
        requestId: "REQ-2026-0002",
        index: 4,
        action: "Request_Resolved",
        fromStatus: "InProgress",
        toStatus: "Resolved",
        signerRole: "PublicServant",
        day: -9,
        documentHash: hash("finance-response"),
      }),
    ],
  },
  {
    request: {
      id: "REQ-2026-0003",
      institution: "Ministry of Health",
      subject: "Public procurement data for hospital equipment",
      citizenDidHash: hash("citizen-health"),
      status: "InProgress",
      createdAt: iso(-7),
      deadlineAt: iso(23),
      registryNumber: "MS-544-2026-0104",
      assignedToDidHash: hash("health-servant").slice(0, 24),
    },
    events: [
      event({ requestId: "REQ-2026-0003", index: 0, action: "Request_Created", fromStatus: "Draft", toStatus: "Created", signerRole: "Citizen", day: -7 }),
      event({
        requestId: "REQ-2026-0003",
        index: 1,
        action: "Registry_Assigned",
        fromStatus: "Created",
        toStatus: "Registered",
        signerRole: "RegistryBot",
        day: -7,
        metadata: { registryNumber: "MS-544-2026-0104" },
      }),
      event({
        requestId: "REQ-2026-0003",
        index: 2,
        action: "Task_Routed",
        fromStatus: "Registered",
        toStatus: "Routed",
        signerRole: "Director",
        day: -6,
        metadata: { assignedToDidHash: hash("health-servant").slice(0, 24) },
      }),
      event({ requestId: "REQ-2026-0003", index: 3, action: "Processing_Started", fromStatus: "Routed", toStatus: "InProgress", signerRole: "PublicServant", day: -5 }),
      event({
        requestId: "REQ-2026-0003",
        index: 4,
        action: "Document_Attached",
        fromStatus: "InProgress",
        toStatus: "InProgress",
        signerRole: "PublicServant",
        day: -4,
        documentHash: hash("health-evidence"),
      }),
    ],
  },
  {
    request: {
      id: "REQ-2026-0004",
      institution: "City Hall Bucharest Sector 1",
      subject: "Urban planning authorization register export",
      citizenDidHash: hash("citizen-cityhall"),
      status: "Registered",
      createdAt: iso(-2),
      deadlineAt: iso(28),
      registryNumber: "S1-544-2026-0788",
    },
    events: [
      event({ requestId: "REQ-2026-0004", index: 0, action: "Request_Created", fromStatus: "Draft", toStatus: "Created", signerRole: "Citizen", day: -2 }),
      event({
        requestId: "REQ-2026-0004",
        index: 1,
        action: "Registry_Assigned",
        fromStatus: "Created",
        toStatus: "Registered",
        signerRole: "RegistryBot",
        day: -1,
        metadata: { registryNumber: "S1-544-2026-0788" },
      }),
    ],
  },
];
