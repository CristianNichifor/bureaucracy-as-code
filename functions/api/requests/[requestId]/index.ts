import { HttpError, errorResponse, jsonResponse, optionsResponse } from "../../../_shared/http";
import type { PagesHandler } from "../../../_shared/pages";
import { apiRuntime } from "../../../_shared/runtime";

export const onRequestOptions: PagesHandler<{ requestId: string }> = () => optionsResponse();

export const onRequestGet: PagesHandler<{ requestId: string }> = async ({ params }) => {
  try {
    const request = await apiRuntime.requests.get(params.requestId);

    if (!request) {
      throw new HttpError(404, "REQUEST_NOT_FOUND", `Request ${params.requestId} does not exist.`);
    }

    const anchor = await apiRuntime.ledger.getHeadAnchor(params.requestId);

    return jsonResponse({
      request,
      trail: await apiRuntime.ledger.getRequestTrail(params.requestId),
      integrity: await apiRuntime.ledger.verifyChain(params.requestId, anchor),
      anchor,
    });
  } catch (error) {
    return errorResponse(error);
  }
};

