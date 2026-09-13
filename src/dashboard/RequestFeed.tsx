import { isOverdue } from "../law544/deadlines";
import type { DemoRole } from "../identity/types";
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
}: {
  item: RequestExplorerItem;
  selected: boolean;
  onSelect: (requestId: string) => void;
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
      <div>{latestRole ?? "No signer"}</div>
      <div>{getRequestEventCount(events)} events</div>
      <div className={isOverdue(request.deadlineAt) ? "danger" : ""}>
        {new Date(request.deadlineAt).toLocaleDateString()}
      </div>
      <div>
        <span className="pill">{source === "active" ? "live" : "seed"}</span>
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
}: {
  items: RequestExplorerItem[];
  selectedRequestId: string | null;
  filters: RequestExplorerFilters;
  onFiltersChange: (filters: RequestExplorerFilters) => void;
  onSelectRequest: (requestId: string) => void;
}) {
  const filteredItems = filterRequestExplorerItems(items, filters);
  const institutions = getInstitutionOptions(items);

  return (
    <section className="panel requestFeedPanel">
      <div className="panelHeader">
        <h2>Public request explorer</h2>
        <span className="pill">{filteredItems.length} visible</span>
      </div>

      <div className="filterBar" aria-label="Request filters">
        <label>
          <span>Status</span>
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
          <span>Institution</span>
          <select
            value={filters.institution}
            onChange={(event) => onFiltersChange({ ...filters, institution: event.target.value })}
          >
            <option value={DEFAULT_EXPLORER_FILTERS.institution}>All</option>
            {institutions.map((institution) => (
              <option key={institution} value={institution}>
                {institution}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Signer role</span>
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
          <span>Institution</span>
          <span>Status</span>
          <span>Latest role</span>
          <span>Trail</span>
          <span>Deadline</span>
          <span>Source</span>
        </div>
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <RequestFeedRow
              item={item}
              key={item.request.id}
              onSelect={onSelectRequest}
              selected={item.request.id === selectedRequestId}
            />
          ))
        ) : (
          <p className="emptyState">No requests match these filters.</p>
        )}
      </div>
    </section>
  );
}
