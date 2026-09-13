import { errorResponse, jsonResponse, optionsResponse } from "../_shared/http";
import type { PagesHandler } from "../_shared/pages";
import { resolveApiRuntime } from "../_shared/runtime";
import type { Law544Status } from "../../src/law544/types";

export const onRequestOptions: PagesHandler = ({ request }) => optionsResponse(request);

export const onRequestGet: PagesHandler = async ({ request, env }) => {
  try {
    const apiRuntime = resolveApiRuntime(env);
    const requests = await apiRuntime.requests.list();
    const events = await apiRuntime.ledger.listEvents();
    const now = Date.now();
    const byStatus = requests.reduce(
      (counts, item) => {
        counts[item.status] = (counts[item.status] ?? 0) + 1;
        return counts;
      },
      {} as Partial<Record<Law544Status, number>>,
    );
    const overdueOpenRequests = requests.filter(
      (item) =>
        item.status !== "Resolved" &&
        item.status !== "Rejected" &&
        item.status !== "Overdue" &&
        Date.parse(item.deadlineAt) < now,
    );

    return jsonResponse(request, {
      mode: apiRuntime.mode,
      requestCount: requests.length,
      eventCount: events.length,
      byStatus,
      overdueOpenRequestCount: overdueOpenRequests.length,
      generatedAt: new Date(now).toISOString(),
    });
  } catch (error) {
    return errorResponse(request, error);
  }
};
