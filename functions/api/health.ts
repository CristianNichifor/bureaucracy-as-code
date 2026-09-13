import { jsonResponse, optionsResponse } from "../_shared/http";
import type { PagesHandler } from "../_shared/pages";

export const onRequestOptions: PagesHandler = () => optionsResponse();

export const onRequestGet: PagesHandler = () =>
  jsonResponse({
    ok: true,
    service: "bureaucracy-as-code-pages-api",
    mode: "demo-memory",
  });

