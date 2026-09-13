import { isOverdue } from "../law544/deadlines";
import type { DemoRole } from "../identity/types";
import type { Dictionary } from "../i18n";
import type { Law544Status } from "../law544/types";
import {
  DEFAULT_EXPLORER_FILTERS,
  filterRequestExplorerItems,
  getInstitutionOptions,
  getRequestEventCount,
  getRequestLatestRole,
  type RequestExplorerFilters,
  type RequestExplorerItem,
} from "./requestExplorer";

const statusOptions: Array<Law544Status | "All"> = [
  "All",
  "Draft",
  "Created",
  "Registered",
  "Routed",
  "InProgress",
  "ExtensionRequested",
  "Resolved",
  "Rejected",
  "Overdue",
];

const roleOptions: Array<DemoRole | "All"> = ["All", "Citizen", "RegistryBot", "Director", "PublicServant"];

function RequestFeedRow({
  item,
  selected,
  onSelect,
  labels,
}: {
  item: RequestExplorerItem;
  selected: boolean;
  onSelect: (requestId: string) => void;
  labels: Dictionary["feed"];
}) {
  const { request, events, source } = item;
  const latestRole = getRequestLatestRole(events);

  return (
    <button
      aria-pressed={selected}
      className={`feedRow ${selected ? "selected" : ""}`}
      onClick={() => onSelect(request.id)}
      type="button"
    >
      <div>
        <strong>{request.id}</strong>
        <span>{request.subject}</span>
      </div>
      <div>{request.institution}</div>
      <div>
        <span className={`status status-${request.status.toLowerCase()}`}>{request.status}</span>
      </div>
      <div>{latestRole ?? labels.noSigner}</div>
      <div>{getRequestEventCount(events)} {labels.events}</div>
      <div className={isOverdue(request.deadlineAt) ? "danger" : ""}>
        {new Date(request.deadlineAt).toLocaleDateString()}
      </div>
      <div>
        <span className="pill">{source === "active" ? labels.live : labels.seed}</span>
      </div>
    </button>
  );
}

export function RequestFeed({
  items,
  selectedRequestId,
  filters,
  onFiltersChange,
  onSelectRequest,
  labels,
}: {
  items: RequestExplorerItem[];
  selectedRequestId: string | null;
  filters: RequestExplorerFilters;
  onFiltersChange: (filters: RequestExplorerFilters) => void;
  onSelectRequest: (requestId: string) => void;
  labels: Dictionary["feed"];
}) {
  const filteredItems = filterRequestExplorerItems(items, filters);
  const institutions = getInstitutionOptions(items);

  return (
    <section className="panel requestFeedPanel">
      <div className="panelHeader">
        <h2>{labels.title}</h2>
        <span className="pill">{filteredItems.length} {labels.visible}</span>
      </div>

      <div className="filterBar" aria-label="Request filters">
        <label>
          <span>{labels.status}</span>
          <select
            value={filters.status}
            onChange={(event) =>
              onFiltersChange({ ...filters, status: event.target.value as RequestExplorerFilters["status"] })
            }
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>{labels.institution}</span>
          <select
            value={filters.institution}
            onChange={(event) => onFiltersChange({ ...filters, institution: event.target.value })}
          >
            <option value={DEFAULT_EXPLORER_FILTERS.institution}>{labels.all}</option>
            {institutions.map((institution) => (
              <option key={institution} value={institution}>
                {institution}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>{labels.signerRole}</span>
          <select
            value={filters.role}
            onChange={(event) =>
              onFiltersChange({ ...filters, role: event.target.value as RequestExplorerFilters["role"] })
            }
          >
            {roleOptions.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="feedTable" role="list">
        <div className="feedHeader" aria-hidden="true">
          <span>Request</span>
          <span>{labels.institution}</span>
          <span>{labels.status}</span>
          <span>{labels.latestRole}</span>
          <span>{labels.trail}</span>
          <span>{labels.deadline}</span>
          <span>{labels.source}</span>
        </div>
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <RequestFeedRow
              item={item}
              key={item.request.id}
              onSelect={onSelectRequest}
              labels={labels}
              selected={item.request.id === selectedRequestId}
            />
          ))
        ) : (
          <p className="emptyState">{labels.empty}</p>
        )}
      </div>
    </section>
  );
}
