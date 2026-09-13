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
  getStatusSummaries,
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
        <span className="cellLabel">{labels.request}</span>
        <strong>{request.id}</strong>
        <span>{request.subject}</span>
      </div>
      <div>
        <span className="cellLabel">{labels.institution}</span>
        <span>{request.institution}</span>
      </div>
      <div>
        <span className="cellLabel">{labels.status}</span>
        <span className={`status status-${request.status.toLowerCase()}`}>{request.status}</span>
      </div>
      <div>
        <span className="cellLabel">{labels.latestRole}</span>
        <span>{latestRole ?? labels.noSigner}</span>
      </div>
      <div>
        <span className="cellLabel">{labels.trail}</span>
        <span>{getRequestEventCount(events)} {labels.events}</span>
      </div>
      <div className={isOverdue(request.deadlineAt) ? "danger" : ""}>
        <span className="cellLabel">{labels.deadline}</span>
        <span>{new Date(request.deadlineAt).toLocaleDateString()}</span>
      </div>
      <div>
        <span className="cellLabel">{labels.source}</span>
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
  const statusSummaries = getStatusSummaries(items);
  const filtersActive =
    filters.status !== DEFAULT_EXPLORER_FILTERS.status ||
    filters.institution !== DEFAULT_EXPLORER_FILTERS.institution ||
    filters.role !== DEFAULT_EXPLORER_FILTERS.role;

  return (
    <section className="panel requestFeedPanel">
      <div className="panelHeader">
        <h2>{labels.title}</h2>
        <span className="pill">{filteredItems.length} {labels.visible}</span>
      </div>

      <div className="statusSummary" aria-label={labels.statusSummary}>
        <button
          aria-pressed={filters.status === "All"}
          className="statusSummaryChip"
          onClick={() => onFiltersChange({ ...filters, status: "All" })}
          type="button"
        >
          <span>{labels.all}</span>
          <strong>{items.length}</strong>
        </button>
        {statusSummaries.map(({ status, count }) => (
          <button
            aria-pressed={filters.status === status}
            className={`statusSummaryChip statusSummary-${status.toLowerCase()}`}
            key={status}
            onClick={() => onFiltersChange({ ...filters, status })}
            type="button"
          >
            <span>{status}</span>
            <strong>{count}</strong>
          </button>
        ))}
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
        <button
          className="filterReset"
          disabled={!filtersActive}
          onClick={() => onFiltersChange(DEFAULT_EXPLORER_FILTERS)}
          type="button"
        >
          {labels.resetFilters}
        </button>
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
          <div className="emptyState" role="status">
            <strong>{labels.emptyTitle}</strong>
            <p>{labels.empty}</p>
            <button onClick={() => onFiltersChange(DEFAULT_EXPLORER_FILTERS)} type="button">
              {labels.resetFilters}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
