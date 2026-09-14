import { ArrowRight, Clock3, FileCheck2, Route, ShieldAlert } from "lucide-react";
import type { Dictionary } from "../i18n";
import type { Law544Status } from "../law544/types";
import type { RequestExplorerItem } from "./requestExplorer";
import { formatLaw544Status } from "./requestExplorer";

type ScenarioComparisonPanelProps = {
  items: RequestExplorerItem[];
  labels: Dictionary["scenarioComparison"];
  onSelectRequest: (requestId: string) => void;
  selectedRequestId: string;
};

type ShowcasedStatus = "Resolved" | "ExtensionRequested" | "Overdue" | "Rejected" | "InProgress";

const showcasedStatuses: ShowcasedStatus[] = [
  "Resolved",
  "ExtensionRequested",
  "Overdue",
  "Rejected",
  "InProgress",
];

export function ScenarioComparisonPanel({
  items,
  labels,
  onSelectRequest,
  selectedRequestId,
}: ScenarioComparisonPanelProps) {
  const scenarios = showcasedStatuses
    .map((status) => getScenarioForStatus(items, status))
    .filter((item): item is RequestExplorerItem => Boolean(item));

  return (
    <section className="panel scenarioComparisonPanel" aria-labelledby="scenario-comparison-title">
      <div className="panelHeader">
        <div>
          <h2 id="scenario-comparison-title">{labels.title}</h2>
          <p className="panelCopy">{labels.copy}</p>
        </div>
        <span className="pill">{labels.browserOnly}</span>
      </div>
      <div className="scenarioComparisonGrid">
        {scenarios.map((item) => {
          const status = item.request.status as ShowcasedStatus;
          const selected = item.request.id === selectedRequestId;

          return (
            <button
              aria-pressed={selected}
              className={`scenarioComparisonCard ${selected ? "selected" : ""}`}
              key={item.request.id}
              onClick={() => onSelectRequest(item.request.id)}
              type="button"
            >
              <span className={`status status-${status.toLowerCase()}`}>{formatLaw544Status(status)}</span>
              <div>
                {getScenarioIcon(status)}
                <strong>{labels.scenarios[status]}</strong>
              </div>
              <p>{item.request.subject}</p>
              <dl>
                <div>
                  <dt>{labels.events}</dt>
                  <dd>{item.events.length}</dd>
                </div>
                <div>
                  <dt>{labels.deadline}</dt>
                  <dd>{new Date(item.request.deadlineAt).toLocaleDateString()}</dd>
                </div>
                <div>
                  <dt>{labels.owner}</dt>
                  <dd>{getOwnerLabel(status, labels)}</dd>
                </div>
              </dl>
              <small>
                {labels.inspect}
                <ArrowRight size={14} />
              </small>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function getScenarioForStatus(items: RequestExplorerItem[], status: Law544Status): RequestExplorerItem | undefined {
  return items.find((item) => item.source === "seed" && item.request.status === status);
}

function getScenarioIcon(status: Law544Status) {
  if (status === "Resolved") return <FileCheck2 size={18} />;
  if (status === "Overdue" || status === "Rejected") return <ShieldAlert size={18} />;
  if (status === "ExtensionRequested") return <Clock3 size={18} />;
  return <Route size={18} />;
}

function getOwnerLabel(status: Law544Status, labels: Dictionary["scenarioComparison"]): string {
  if (status === "Resolved") return labels.closed;
  if (status === "Rejected") return labels.refusal;
  if (status === "Overdue") return labels.escalation;
  return labels.officer;
}
