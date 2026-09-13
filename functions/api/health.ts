import { jsonResponse, optionsResponse } from "../_shared/http";
import type { PagesHandler } from "../_shared/pages";
import { resolveApiRuntime } from "../_shared/runtime";

export const onRequestOptions: PagesHandler = ({ request }) => optionsResponse(request);

export const onRequestGet: PagesHandler = ({ request, env }) =>
  jsonResponse(request, {
    ok: true,
    service: "bureaucracy-as-code-pages-api",
    mode: resolveApiRuntime(env).mode,
  });
