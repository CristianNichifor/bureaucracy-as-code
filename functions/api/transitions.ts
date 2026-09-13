import type { IngestTransitionCommand } from "../../src/api/types";
import { apiRuntime } from "../_shared/runtime";
import { errorResponse, jsonResponse, optionsResponse, readJson } from "../_shared/http";
import type { PagesHandler } from "../_shared/pages";

export const onRequestOptions: PagesHandler = () => optionsResponse();

export const onRequestPost: PagesHandler = async ({ request }) => {
  try {
    const command = (await readJson(request)) as IngestTransitionCommand;
    const result = await apiRuntime.ingestion.ingest(command);
    const anchor = await apiRuntime.ledger.getHeadAnchor();

    return jsonResponse(
      {
        event: result.event,
        request: result.request,
        anchor,
      },
      { status: 201 },
    );
  } catch (error) {
    return errorResponse(error);
  }
};

