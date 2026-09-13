import { ApiBoundaryError } from "../../src/api/types";

const DEFAULT_ALLOWED_ORIGINS = [
  "https://bureaucracy-as-code.pages.dev",
  "https://digital.cristian-nichifor.com",
] as const;

const sharedCorsHeaders = {
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
};

export function corsHeadersFor(request: Request, allowedOrigins: readonly string[] = DEFAULT_ALLOWED_ORIGINS) {
  const origin = request.headers.get("origin");
  const headers: Record<string, string> = {
    ...sharedCorsHeaders,
    Vary: "Origin",
  };

  if (origin && allowedOrigins.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }

  return headers;
}

export function optionsResponse(request: Request): Response {
  return new Response(null, { status: 204, headers: corsHeadersFor(request) });
}

export function jsonResponse(request: Request, body: unknown, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify(body, null, 2), {
    ...init,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...corsHeadersFor(request),
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

export function errorResponse(request: Request, error: unknown): Response {
  if (error instanceof HttpError) {
    return jsonResponse(request, error.toBody(), { status: error.status });
  }

  if (error instanceof ApiBoundaryError) {
    return jsonResponse(
      request,
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
    request,
    {
      error: {
        code: "INTERNAL_ERROR",
        message: "The API could not process this request.",
      },
    },
      { status: 500 },
  );
}

export class InMemoryRateLimiter {
  private readonly attempts = new Map<string, number[]>();

  constructor(
    private readonly options: {
      windowMs: number;
      maxRequests: number;
    },
  ) {}

  check(key: string, now = Date.now()): { allowed: boolean; retryAfterSeconds?: number } {
    const windowStart = now - this.options.windowMs;
    const recent = (this.attempts.get(key) ?? []).filter((timestamp) => timestamp > windowStart);

    if (recent.length >= this.options.maxRequests) {
      const retryAfterMs = recent[0] + this.options.windowMs - now;
      this.attempts.set(key, recent);
      return { allowed: false, retryAfterSeconds: Math.ceil(retryAfterMs / 1000) };
    }

    recent.push(now);
    this.attempts.set(key, recent);
    return { allowed: true };
  }

  reset(): void {
    this.attempts.clear();
  }
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
    case "REPLAY_REJECTED":
      return 400;
    case "REQUEST_NOT_FOUND":
      return 404;
  }
}
