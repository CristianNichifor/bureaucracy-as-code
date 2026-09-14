import { AlertTriangle, Building2, CheckCircle2, Clock3, UsersRound } from "lucide-react";
import type { Dictionary } from "../i18n";
import { isOverdue } from "../law544/deadlines";
import type { Law544Request } from "../law544/types";
import type { RequestExplorerItem } from "./requestExplorer";
import { formatLaw544Status } from "./requestExplorer";

type InstitutionWorkload = {
  institution: string;
  total: number;
  open: number;
  overdue: number;
  resolved: number;
  urgent: Law544Request | null;
};

export function OperationsPanel({
  items,
  labels,
  onSelectRequest,
}: {
  items: RequestExplorerItem[];
  labels: Dictionary["operations"];
  onSelectRequest: (requestId: string) => void;
}) {
  const workloads = getInstitutionWorkloads(items);
  const totals = getOperationsTotals(items);

  return (
    <section className="panel operationsPanel" aria-labelledby="operations-panel-title">
      <div className="panelHeader">
        <div>
          <h2 id="operations-panel-title">{labels.title}</h2>
          <p className="panelCopy">{labels.copy}</p>
        </div>
        <span className="pill">{labels.browserOnly}</span>
      </div>
      <div className="operationsMetrics" aria-label={labels.summary}>
        <div>
          <UsersRound size={18} />
          <span>{labels.open}</span>
          <strong>{totals.open}</strong>
        </div>
        <div>
          <AlertTriangle size={18} />
          <span>{labels.overdue}</span>
          <strong>{totals.overdue}</strong>
        </div>
        <div>
          <CheckCircle2 size={18} />
          <span>{labels.finalized}</span>
          <strong>{totals.finalized}</strong>
        </div>
        <div>
          <Building2 size={18} />
          <span>{labels.institutions}</span>
          <strong>{workloads.length}</strong>
        </div>
      </div>
      <div className="operationsQueue">
        {workloads.map((workload) => (
          <button
            className="operationsRow"
            key={workload.institution}
            onClick={() => workload.urgent && onSelectRequest(workload.urgent.id)}
            type="button"
          >
            <div>
              <strong>{workload.institution}</strong>
              <span>{workload.urgent ? `${labels.nextFile}: ${workload.urgent.id}` : labels.noOpenFiles}</span>
            </div>
            <dl>
              <div>
                <dt>{labels.open}</dt>
                <dd>{workload.open}</dd>
              </div>
              <div>
                <dt>{labels.overdue}</dt>
                <dd>{workload.overdue}</dd>
              </div>
              <div>
                <dt>{labels.finalized}</dt>
                <dd>{workload.resolved}</dd>
              </div>
              <div>
                <dt>{labels.nextDeadline}</dt>
                <dd>{workload.urgent ? new Date(workload.urgent.deadlineAt).toLocaleDateString() : labels.none}</dd>
              </div>
            </dl>
            <small>
              <Clock3 size={14} />
              {workload.urgent ? formatLaw544Status(workload.urgent.status) : labels.closedQueue}
            </small>
          </button>
        ))}
      </div>
    </section>
  );
}

function getOperationsTotals(items: RequestExplorerItem[]) {
  return items.reduce(
    (totals, item) => ({
      open: totals.open + (isClosed(item.request) ? 0 : 1),
      overdue: totals.overdue + (isRequestOverdue(item.request) ? 1 : 0),
      finalized: totals.finalized + (isClosed(item.request) ? 1 : 0),
    }),
    { open: 0, overdue: 0, finalized: 0 },
  );
}

function getInstitutionWorkloads(items: RequestExplorerItem[]): InstitutionWorkload[] {
  const workloads = new Map<string, InstitutionWorkload>();

  for (const item of items) {
    const existing = workloads.get(item.request.institution) ?? {
      institution: item.request.institution,
      total: 0,
      open: 0,
      overdue: 0,
      resolved: 0,
      urgent: null,
    };

    const closed = isClosed(item.request);
    const overdue = isRequestOverdue(item.request);

    existing.total += 1;
    existing.open += closed ? 0 : 1;
    existing.overdue += overdue ? 1 : 0;
    existing.resolved += closed ? 1 : 0;
    existing.urgent = getMoreUrgentRequest(existing.urgent, closed ? null : item.request);
    workloads.set(item.request.institution, existing);
  }

  return Array.from(workloads.values()).sort(
    (a, b) =>
      b.overdue - a.overdue ||
      b.open - a.open ||
      getDeadlineTime(a.urgent) - getDeadlineTime(b.urgent) ||
      a.institution.localeCompare(b.institution),
  );
}

function getMoreUrgentRequest(current: Law544Request | null, candidate: Law544Request | null): Law544Request | null {
  if (!candidate) return current;
  if (!current) return candidate;

  return Date.parse(candidate.deadlineAt) < Date.parse(current.deadlineAt) ? candidate : current;
}

function getDeadlineTime(request: Law544Request | null): number {
  return request ? Date.parse(request.deadlineAt) : Number.POSITIVE_INFINITY;
}

function isRequestOverdue(request: Law544Request): boolean {
  return request.status === "Overdue" || (!isClosed(request) && isOverdue(request.deadlineAt));
}

function isClosed(request: Law544Request): boolean {
  return request.status === "Resolved" || request.status === "Rejected";
}
