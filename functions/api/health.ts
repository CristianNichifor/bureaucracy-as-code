import { jsonResponse, optionsResponse } from "../_shared/http";
import type { PagesHandler } from "../_shared/pages";

export const onRequestOptions: PagesHandler = ({ request }) => optionsResponse(request);

export const onRequestGet: PagesHandler = ({ request }) =>
  jsonResponse(request, {
    ok: true,
    service: "bureaucracy-as-code-pages-api",
    mode: "demo-memory",
  });
