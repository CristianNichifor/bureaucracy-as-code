import { z } from "zod";
import type { Law544Action, Law544Request, Law544Status } from "../law544/types";
import { verifyLedgerEvents } from "../ledger/hashChain";
import type { LedgerEvent, LedgerProvider } from "../ledger/types";
import type { DemoRole } from "../identity/types";

export const DEMO_STATE_FORMAT = "bureaucracy-as-code/demo-state";
export const DEMO_STATE_VERSION = 1;

// Written as Records rather than arrays so the type checker demands every member: adding a
// status, action or role without listing it here is a compile error, and the validator cannot
// quietly fall behind the domain it is meant to validate.
const STATUS_VALUES: Record<Law544Status, true> = {
  Draft: true,
  Created: true,
  Registered: true,
  Routed: true,
  InProgress: true,
  ExtensionRequested: true,
  Resolved: true,
  Rejected: true,
  Overdue: true,
};

const ACTION_VALUES: Record<Law544Action, true> = {
  Request_Created: true,
  Registry_Assigned: true,
  Task_Routed: true,
  Processing_Started: true,
  Extension_Requested: true,
  Document_Attached: true,
  Request_Resolved: true,
  Request_Rejected: true,
  Request_Marked_Overdue: true,
};

const ROLE_VALUES: Record<DemoRole, true> = {
  Citizen: true,
  RegistryBot: true,
  PublicServant: true,
  Director: true,
};

function valuesOf<Key extends string>(lookup: Record<Key, true>): [Key, ...Key[]] {
  return Object.keys(lookup) as [Key, ...Key[]];
}

const STATUSES = valuesOf(STATUS_VALUES);
const ACTIONS = valuesOf(ACTION_VALUES);
const ROLES = valuesOf(ROLE_VALUES);

const hash = z.string().regex(/^[0-9a-f]{64}$/, "expected a 64-character hex hash");

const requestSchema = z.object({
  id: z.string().min(1),
  institution: z.string().min(1),
  subject: z.string().min(1),
  citizenDidHash: z.string().min(1),
  status: z.enum(STATUSES),
  createdAt: z.string().min(1),
  deadlineAt: z.string().min(1),
  registryNumber: z.string().optional(),
  assignedToDidHash: z.string().optional(),
  responseDocumentHash: z.string().optional(),
});

const eventSchema = z.object({
  requestId: z.string().min(1),
  action: z.enum(ACTIONS),
  fromStatus: z.enum(STATUSES),
  toStatus: z.enum(STATUSES),
  payloadHash: z.string().min(1),
  documentHash: z.string().optional(),
  signerDidHash: z.string().min(1),
  signerRole: z.enum(ROLES),
  credentialHash: z.string().min(1),
  signature: z.string().min(1),
  timestamp: z.string().min(1),
  metadata: z.record(z.string(), z.string()).optional(),
  index: z.number().int().nonnegative(),
  previousStateHash: hash,
  stateHash: hash,
});

const demoStateSchema = z.object({
  format: z.literal(DEMO_STATE_FORMAT),
  version: z.literal(DEMO_STATE_VERSION),
  exportedAt: z.string().min(1),
  request: requestSchema,
  events: z.array(eventSchema),
});

export type DemoStateFile = {
  format: typeof DEMO_STATE_FORMAT;
  version: typeof DEMO_STATE_VERSION;
  exportedAt: string;
  request: Law544Request;
  events: LedgerEvent[];
};

export async function exportDemoState(input: {
  ledger: LedgerProvider;
  request: Law544Request;
  exportedAt?: string;
}): Promise<DemoStateFile> {
  return {
    format: DEMO_STATE_FORMAT,
    version: DEMO_STATE_VERSION,
    exportedAt: input.exportedAt ?? new Date().toISOString(),
    request: input.request,
    events: await input.ledger.listEvents(),
  };
}

export function serializeDemoState(state: DemoStateFile): string {
  return `${JSON.stringify(state, null, 2)}\n`;
}

export function parseDemoState(json: string): DemoStateFile {
  let raw: unknown;

  try {
    raw = JSON.parse(json);
  } catch {
    throw new Error("That file is not JSON.");
  }

  const parsed = demoStateSchema.safeParse(raw);

  if (!parsed.success) {
    const [first] = parsed.error.issues;
    const where = first.path.join(".");
    throw new Error(
      where ? `That file is not a demo state export: ${where} ${first.message}.` : `That file is not a demo state export: ${first.message}.`,
    );
  }

  return parsed.data as DemoStateFile;
}

/**
 * Reads an exported file back into the ledger. The chain is verified before anything is
 * written, so an edited export is refused rather than loaded and then reported as broken.
 *
 * Private keys are deliberately not part of an export. An imported demo can be read and
 * re-verified; signing new transitions as the original actors is not possible, and should
 * not be — exporting a signing key to a JSON file is the habit this demo argues against.
 */
export async function importDemoState(input: {
  ledger: LedgerProvider;
  json: string;
}): Promise<DemoStateFile> {
  const state = parseDemoState(input.json);
  const firstInvalidEvent = await verifyLedgerEvents(state.events);

  if (firstInvalidEvent !== null) {
    throw new Error(`That export does not verify — the chain breaks at event ${firstInvalidEvent}.`);
  }

  await input.ledger.replaceEvents(state.events);
  return state;
}
