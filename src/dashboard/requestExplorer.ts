import type { DemoRole } from "../identity/types";
import type { Law544Request, Law544Status } from "../law544/types";
import type { LedgerEvent } from "../ledger/types";

export type RequestExplorerFilters = {
  status: Law544Status | "All";
  institution: string;
  role: DemoRole | "All";
};

export type RequestExplorerItem = {
  request: Law544Request;
  events: LedgerEvent[];
  source: "active" | "seed";
};

export type StatusSummary = {
  status: Law544Status;
  count: number;
};

export const DEFAULT_EXPLORER_FILTERS: RequestExplorerFilters = {
  status: "All",
  institution: "All",
  role: "All",
};

export function getRequestLatestRole(events: LedgerEvent[]): DemoRole | undefined {
  return events.at(-1)?.signerRole;
}

export function getRequestEventCount(events: LedgerEvent[]): number {
  return events.length;
}

export function formatLaw544Status(status: Law544Status | "All"): string {
  const labels: Record<Law544Status | "All", string> = {
    All: "All",
    Draft: "Draft",
    Created: "Created",
    Registered: "Registered",
    Routed: "Routed",
    InProgress: "In progress",
    ExtensionRequested: "Extension requested",
    Resolved: "Resolved",
    Rejected: "Rejected",
    Overdue: "Overdue",
  };

  return labels[status];
}

export function filterRequestExplorerItems(
  items: RequestExplorerItem[],
  filters: RequestExplorerFilters,
): RequestExplorerItem[] {
  return items.filter((item) => {
    const statusMatch = filters.status === "All" || item.request.status === filters.status;
    const institutionMatch = filters.institution === "All" || item.request.institution === filters.institution;
    const roleMatch =
      filters.role === "All" || item.events.some((event) => event.signerRole === filters.role);

    return statusMatch && institutionMatch && roleMatch;
  });
}

export function getInstitutionOptions(items: RequestExplorerItem[]): string[] {
  return Array.from(new Set(items.map((item) => item.request.institution))).sort((a, b) => a.localeCompare(b));
}

export function getStatusSummaries(items: RequestExplorerItem[]): StatusSummary[] {
  const counts = new Map<Law544Status, number>();

  for (const item of items) {
    counts.set(item.request.status, (counts.get(item.request.status) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([status, count]) => ({ status, count }))
    .sort((a, b) => a.status.localeCompare(b.status));
}

export function getSelectedExplorerItem(
  items: RequestExplorerItem[],
  selectedRequestId: string | null,
): RequestExplorerItem | null {
  return items.find((item) => item.request.id === selectedRequestId) ?? items[0] ?? null;
}
