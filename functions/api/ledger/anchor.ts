import { errorResponse, jsonResponse, optionsResponse } from "../../_shared/http";
import type { PagesHandler } from "../../_shared/pages";
import { resolveApiRuntime } from "../../_shared/runtime";

export const onRequestOptions: PagesHandler = ({ request }) => optionsResponse(request);

export const onRequestGet: PagesHandler = async ({ request, env }) => {
  try {
    const url = new URL(request.url);
    const requestId = url.searchParams.get("requestId") ?? undefined;
    const apiRuntime = resolveApiRuntime(env);
    const anchor = await apiRuntime.ledger.getHeadAnchor(requestId);
    const integrity = await apiRuntime.ledger.verifyChain(requestId, anchor);

    return jsonResponse(request, {
      anchor,
      integrity,
    });
  } catch (error) {
    return errorResponse(request, error);
  }
};
