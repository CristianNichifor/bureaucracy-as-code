import { isOverdue } from "../law544/deadlines";
import type { Law544Request, Law544Status } from "../law544/types";
import type { RequestExplorerItem } from "./requestExplorer";

export type QueueKey = "citizen" | "registry" | "director" | "officer" | "escalation" | "closed";

export type InstitutionWorkload = {
  institution: string;
  total: number;
  open: number;
  overdue: number;
  resolved: number;
  /** The open request with the earliest deadline, or null when everything is closed. */
  urgent: Law544Request | null;
  queue: QueueKey;
  /** Days until the urgent request's deadline; negative when overdue; null when none. */
  daysUntil: number | null;
};

const DAY_MS = 24 * 60 * 60 * 1000;

const queueByStatus: Record<Law544Status, QueueKey> = {
  Draft: "citizen",
  Created: "registry",
  Registered: "director",
  Routed: "officer",
  InProgress: "officer",
  ExtensionRequested: "officer",
  Overdue: "escalation",
  Resolved: "closed",
  Rejected: "closed",
};

export function isClosed(request: Pick<Law544Request, "status">): boolean {
  return request.status === "Resolved" || request.status === "Rejected";
}

export function isRequestOverdue(request: Pick<Law544Request, "status" | "deadlineAt">, now = new Date()): boolean {
  return request.status === "Overdue" || (!isClosed(request) && isOverdue(request.deadlineAt, now));
}

/** One row per institution: counts, the most urgent open file, its queue and days to its deadline. */
export function getInstitutionWorkloads(items: RequestExplorerItem[], now = new Date()): InstitutionWorkload[] {
  const workloads = new Map<string, InstitutionWorkload>();

  for (const { request } of items) {
    const existing = workloads.get(request.institution) ?? {
      institution: request.institution,
      total: 0,
      open: 0,
      overdue: 0,
      resolved: 0,
      urgent: null,
      queue: "closed" as QueueKey,
      daysUntil: null,
    };
    const closed = isClosed(request);

    existing.total += 1;
    existing.open += closed ? 0 : 1;
    existing.overdue += isRequestOverdue(request, now) ? 1 : 0;
    existing.resolved += closed ? 1 : 0;
    existing.urgent = moreUrgent(existing.urgent, closed ? null : request);
    existing.queue = existing.urgent ? queueByStatus[existing.urgent.status] : "closed";
    existing.daysUntil = existing.urgent
      ? Math.ceil((Date.parse(existing.urgent.deadlineAt) - now.getTime()) / DAY_MS)
      : null;
    workloads.set(request.institution, existing);
  }

  return Array.from(workloads.values()).sort(
    (a, b) =>
      b.overdue - a.overdue ||
      b.open - a.open ||
      deadlineTime(a.urgent) - deadlineTime(b.urgent) ||
      a.institution.localeCompare(b.institution),
  );
}

function moreUrgent(current: Law544Request | null, candidate: Law544Request | null): Law544Request | null {
  if (!candidate) return current;
  if (!current) return candidate;
  return Date.parse(candidate.deadlineAt) < Date.parse(current.deadlineAt) ? candidate : current;
}

function deadlineTime(request: Law544Request | null): number {
  return request ? Date.parse(request.deadlineAt) : Number.POSITIVE_INFINITY;
}
