import { HttpError, errorResponse, jsonResponse, optionsResponse } from "../../../_shared/http";
import type { PagesHandler } from "../../../_shared/pages";
import { resolveApiRuntime } from "../../../_shared/runtime";

export const onRequestOptions: PagesHandler<{ requestId: string }> = ({ request }) => optionsResponse(request);

export const onRequestGet: PagesHandler<{ requestId: string }> = async ({ request: httpRequest, params, env }) => {
  try {
    const apiRuntime = resolveApiRuntime(env);
    const savedRequest = await apiRuntime.requests.get(params.requestId);

    if (!savedRequest) {
      throw new HttpError(404, "REQUEST_NOT_FOUND", `Request ${params.requestId} does not exist.`);
    }

    const anchor = await apiRuntime.ledger.getHeadAnchor(params.requestId);

    return jsonResponse(httpRequest, {
      request: savedRequest,
      trail: await apiRuntime.ledger.getRequestTrail(params.requestId),
      integrity: await apiRuntime.ledger.verifyChain(params.requestId, anchor),
      anchor,
    });
  } catch (error) {
    return errorResponse(httpRequest, error);
  }
};
