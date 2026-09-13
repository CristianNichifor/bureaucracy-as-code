import { apiRuntime } from "../../_shared/runtime";
import { errorResponse, jsonResponse, optionsResponse } from "../../_shared/http";
import type { PagesHandler } from "../../_shared/pages";

export const onRequestOptions: PagesHandler = () => optionsResponse();

export const onRequestGet: PagesHandler = async () => {
  try {
    return jsonResponse({
      requests: await apiRuntime.requests.list(),
      events: await apiRuntime.ledger.listEvents(),
      anchor: await apiRuntime.ledger.getHeadAnchor(),
    });
  } catch (error) {
    return errorResponse(error);
  }
};

