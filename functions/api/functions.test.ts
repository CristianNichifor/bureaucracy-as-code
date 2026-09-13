import { beforeEach, describe, expect, it } from "vitest";
import { createRequestInputSchema, type ApiTransitionPayload, type CreateRequestInput } from "../../src/api/types";
import { createCanonicalSigningEnvelope, transitionPurpose } from "../../src/api/transitionIngestion";
import { BrowserIdentityProvider } from "../../src/identity/BrowserIdentityProvider";
import type { DemoIdentity } from "../../src/identity/types";
import { calculateLaw544Deadline } from "../../src/law544/deadlines";
import { sha256Hex } from "../../src/shared/crypto";
import * as health from "./health";
import * as transitions from "./transitions";
import * as requestList from "./requests/index";
import * as requestDetail from "./requests/[requestId]/index";
import { apiRuntime } from "../_shared/runtime";
import { InMemoryRateLimiter } from "../_shared/http";

describe("Cloudflare Pages Functions API", () => {
  let identity: BrowserIdentityProvider;
  let citizen: DemoIdentity;
  let createRequest: CreateRequestInput;

  beforeEach(async () => {
    await apiRuntime.ledger.reset();
    await apiRuntime.nonces.reset();

    identity = new BrowserIdentityProvider();
    citizen = await identity.createIdentity({ displayName: "Citizen Demo", role: "Citizen" });
    const createdAt = "2026-09-14T09:00:00.000Z";
    createRequest = createRequestInputSchema.parse({
      id: `REQ-functions-${crypto.randomUUID()}`,
      institution: "Ministry of Finance",
      subject: "Budget execution data",
      citizenDidHash: await sha256Hex(citizen.did),
      createdAt,
      deadlineAt: calculateLaw544Deadline(createdAt),
    });
  });

  it("answers the health route", async () => {
    const response = await health.onRequestGet({ request: new Request("https://example.test/api/health"), params: {} });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toMatchObject({ ok: true, mode: "demo-memory" });
  });

  it("ingests a signed transition and exposes public request reads", async () => {
    const payload: ApiTransitionPayload = {
      requestId: createRequest.id,
      action: "Request_Created",
      fromStatus: "Draft",
      toStatus: "Created",
    };
    const envelope = await createCanonicalSigningEnvelope(payload);
    const command = {
      payload,
      envelope,
      proof: await identity.signPayload(citizen, envelope),
      presentation: await identity.presentCredential({
        identity: citizen,
        purpose: transitionPurpose(payload),
      }),
      createRequest,
    };

    const ingestResponse = await transitions.onRequestPost({
      request: jsonRequest("https://example.test/api/transitions", command),
      params: {},
    });
    const ingestBody = await ingestResponse.json();

    expect(ingestResponse.status).toBe(201);
    expect(ingestBody.request).toMatchObject({ id: createRequest.id, status: "Created" });
    expect(ingestBody.event).toMatchObject({ action: "Request_Created", index: 0 });

    const listResponse = await requestList.onRequestGet({
      request: new Request("https://example.test/api/requests"),
      params: {},
    });
    const listBody = await listResponse.json();
    expect(listBody.requests).toContainEqual(expect.objectContaining({ id: createRequest.id }));

    const detailResponse = await requestDetail.onRequestGet({
      request: new Request(`https://example.test/api/requests/${createRequest.id}`),
      params: { requestId: createRequest.id },
    });
    const detailBody = await detailResponse.json();
    expect(detailBody.trail).toHaveLength(1);
    expect(detailBody.integrity).toMatchObject({ valid: true, checkedEvents: 1 });
  });

  it("maps malformed JSON to a stable HTTP error", async () => {
    const response = await transitions.onRequestPost({
      request: new Request("https://example.test/api/transitions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{nope",
      }),
      params: {},
    });
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toMatchObject({ error: { code: "INVALID_JSON" } });
  });

  it("rejects a repeated signed transition envelope nonce", async () => {
    const payload: ApiTransitionPayload = {
      requestId: createRequest.id,
      action: "Request_Created",
      fromStatus: "Draft",
      toStatus: "Created",
    };
    const envelope = await createCanonicalSigningEnvelope(payload, {
      nonce: "replay-test-nonce-0001",
      signedAt: "2026-09-14T09:01:00.000Z",
    });
    const command = {
      payload,
      envelope,
      proof: await identity.signPayload(citizen, envelope),
      presentation: await identity.presentCredential({
        identity: citizen,
        purpose: transitionPurpose(payload),
      }),
      createRequest,
    };

    const first = await transitions.onRequestPost({
      request: jsonRequest("https://example.test/api/transitions", command),
      params: {},
    });
    const replay = await transitions.onRequestPost({
      request: jsonRequest("https://example.test/api/transitions", command),
      params: {},
    });
    const body = await replay.json();

    expect(first.status).toBe(201);
    expect(replay.status).toBe(400);
    expect(body).toMatchObject({ error: { code: "REPLAY_REJECTED" } });
  });

  it("only reflects configured CORS origins", async () => {
    const allowed = await health.onRequestOptions({
      request: new Request("https://example.test/api/health", {
        method: "OPTIONS",
        headers: { Origin: "https://bureaucracy-as-code.pages.dev" },
      }),
      params: {},
    });
    const denied = await health.onRequestOptions({
      request: new Request("https://example.test/api/health", {
        method: "OPTIONS",
        headers: { Origin: "https://evil.example" },
      }),
      params: {},
    });

    expect(allowed.headers.get("Access-Control-Allow-Origin")).toBe("https://bureaucracy-as-code.pages.dev");
    expect(allowed.headers.get("Vary")).toBe("Origin");
    expect(denied.headers.get("Access-Control-Allow-Origin")).toBeNull();
  });

  it("rate-limits repeated keys inside a time window", () => {
    const limiter = new InMemoryRateLimiter({ windowMs: 1_000, maxRequests: 2 });

    expect(limiter.check("signer-a", 1_000)).toMatchObject({ allowed: true });
    expect(limiter.check("signer-a", 1_100)).toMatchObject({ allowed: true });
    expect(limiter.check("signer-a", 1_200)).toMatchObject({
      allowed: false,
      retryAfterSeconds: 1,
    });
    expect(limiter.check("signer-a", 2_100)).toMatchObject({ allowed: true });
  });
});

function jsonRequest(url: string, body: unknown): Request {
  return new Request(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
