import { ApiBoundaryError } from "../../src/api/types";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
};

export function optionsResponse(): Response {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export function jsonResponse(body: unknown, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify(body, null, 2), {
    ...init,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...corsHeaders,
      ...init.headers,
    },
  });
}

export async function readJson(request: Request): Promise<unknown> {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    throw new HttpError(415, "UNSUPPORTED_MEDIA_TYPE", "Expected application/json.");
  }

  try {
    return await request.json();
  } catch {
    throw new HttpError(400, "INVALID_JSON", "Request body is not valid JSON.");
  }
}

export function errorResponse(error: unknown): Response {
  if (error instanceof HttpError) {
    return jsonResponse(error.toBody(), { status: error.status });
  }

  if (error instanceof ApiBoundaryError) {
    return jsonResponse(
      {
        error: {
          code: error.code,
          message: error.message,
        },
      },
      { status: apiStatus(error.code) },
    );
  }

  return jsonResponse(
    {
      error: {
        code: "INTERNAL_ERROR",
        message: "The API could not process this request.",
      },
    },
    { status: 500 },
  );
}

export class HttpError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "HttpError";
  }

  toBody() {
    return {
      error: {
        code: this.code,
        message: this.message,
      },
    };
  }
}

function apiStatus(code: ApiBoundaryError["code"]): number {
  switch (code) {
    case "INVALID_COMMAND":
    case "REQUEST_ALREADY_EXISTS":
    case "STATE_MISMATCH":
    case "TRANSITION_REJECTED":
    case "PRESENTATION_REJECTED":
    case "SIGNATURE_REJECTED":
      return 400;
    case "REQUEST_NOT_FOUND":
      return 404;
  }
}

