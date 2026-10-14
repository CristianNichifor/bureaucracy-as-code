import { localizeDemoText } from "../demo/demoText";
import { formatDate, useLanguage } from "../locale";
import { AlertTriangle, Building2, CheckCircle2, UsersRound } from "lucide-react";
import type { Dictionary } from "../i18n";
import type { RequestExplorerFilters, RequestExplorerItem } from "./requestExplorer";
import { formatLaw544Status, getExplorerCounts } from "./requestExplorer";
import { getInstitutionWorkloads, type InstitutionWorkload, type QueueKey } from "./institutionWorkload";
import "./operations.css";

/**
 * Institution workload as a table: one row per institution with its counts, next
 * deadline and the queue that holds the most urgent file. The table is the text
 * alternative the design asks for; the metric buttons above it filter the feed.
 */
export function OperationsPanel({
  items,
  labels,
  onApplyFilters,
  onSelectRequest,
}: {
  items: RequestExplorerItem[];
  labels: Dictionary["operations"];
  onApplyFilters: (filters: Partial<RequestExplorerFilters>) => void;
  onSelectRequest: (requestId: string) => void;
}) {
  const language = useLanguage();
  const workloads = getInstitutionWorkloads(items);
  const counts = getExplorerCounts(items);

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
        <button onClick={() => onApplyFilters({ institution: "All", status: "All" })} type="button">
          <Building2 size={18} />
          <span>{labels.institutions}</span>
          <strong>{counts.institutions}</strong>
        </button>
        <button
          onClick={() => onApplyFilters({ institution: "All", status: "All", sort: "deadline-asc" })}
          type="button"
        >
          <UsersRound size={18} />
          <span>{labels.open}</span>
          <strong>{counts.open}</strong>
        </button>
        <button onClick={() => onApplyFilters({ institution: "All", status: "Overdue" })} type="button">
          <AlertTriangle size={18} />
          <span>{labels.overdue}</span>
          <strong>{counts.overdue}</strong>
        </button>
        <button onClick={() => onApplyFilters({ institution: "All", status: "Resolved" })} type="button">
          <CheckCircle2 size={18} />
          <span>{labels.finalized}</span>
          <strong>{counts.finished}</strong>
        </button>
      </div>
      <div className="operationsScroll">
        <table className="operationsTable" aria-label={labels.title}>
          <thead>
            <tr>
              <th scope="col">{labels.institutions}</th>
              <th scope="col" className="num">{labels.open}</th>
              <th scope="col" className="num">{labels.overdue}</th>
              <th scope="col" className="num">{labels.finalized}</th>
              <th scope="col">{labels.nextDeadline}</th>
              <th scope="col">{labels.ownerQueue}</th>
              <th scope="col">{labels.nextFile}</th>
            </tr>
          </thead>
          <tbody>
            {workloads.map((workload) => (
              <tr className={workload.overdue > 0 ? "operationsOverdue" : undefined} key={workload.institution}>
                <th scope="row">
                  <button
                    className="operationsRow"
                    onClick={() => {
                      onApplyFilters({ institution: workload.institution, status: "All", sort: "deadline-asc" });
                      if (workload.urgent) onSelectRequest(workload.urgent.id);
                    }}
                    type="button"
                  >
                    {localizeDemoText(workload.institution, language)}
                  </button>
                </th>
                <td className="num">{workload.open}</td>
                <td className="num">{workload.overdue}</td>
                <td className="num">{workload.resolved}</td>
                <td>
                  {workload.urgent ? formatDate(workload.urgent.deadlineAt, language) : labels.none}
                  <span className="operationsNote">{getUrgencyReason(workload, labels)}</span>
                </td>
                <td>{queueLabel(workload.queue, labels)}</td>
                <td>
                  {workload.urgent ? (
                    <>
                      <code>{workload.urgent.id}</code>
                      <span className="operationsNote">{formatLaw544Status(workload.urgent.status, language)}</span>
                    </>
                  ) : (
                    labels.noOpenFiles
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function queueLabel(queue: QueueKey, labels: Dictionary["operations"]): string {
  const names: Record<QueueKey, string> = {
    citizen: labels.citizenQueue,
    registry: labels.registryQueue,
    director: labels.directorQueue,
    officer: labels.officerQueue,
    escalation: labels.escalationQueue,
    closed: labels.closedQueue,
  };
  return names[queue];
}

function getUrgencyReason(workload: InstitutionWorkload, labels: Dictionary["operations"]): string {
  if (!workload.urgent || workload.daysUntil === null) return labels.noOpenFiles;
  const days = workload.daysUntil;
  if (workload.urgent.status === "Overdue" || days < 0) return labels.urgentOverdue.replace("{days}", Math.abs(days).toString());
  if (days <= 7) return labels.urgentDueSoon.replace("{days}", days.toString());
  return labels.urgentEarliest.replace("{days}", days.toString());
}
