import { describe, expect, it } from "vitest";
import type { DemoIdentity } from "../identity/types";
import type { Law544Request } from "./types";
import { assertAllowedTransition } from "./stateMachine";

function actor(role: DemoIdentity["role"]): DemoIdentity {
  return {
    did: `did:demo:${role}`,
    displayName: role,
    role,
    publicKeyJwk: {},
    privateKey: {} as CryptoKey,
    credential: {
      id: `vc:${role}`,
      subjectDid: `did:demo:${role}`,
      issuerDid: "did:demo:issuer",
      role,
      issuedAt: new Date().toISOString(),
    },
    credentialHash: role,
  };
}

const request: Law544Request = {
  id: "REQ-2026-test",
  institution: "Ministry of Finance",
  subject: "Budget data",
  citizenDidHash: "citizen-hash",
  status: "Created",
  createdAt: "2026-09-13T00:00:00.000Z",
  deadlineAt: "2026-10-13T00:00:00.000Z",
};

describe("assertAllowedTransition", () => {
  it("allows registry assignment from Created by a registry bot", () => {
    const rule = assertAllowedTransition({
      request,
      action: "Registry_Assigned",
      actor: actor("RegistryBot"),
    });

    expect(rule.to).toBe("Registered");
  });

  it("blocks citizens from assigning registry numbers", () => {
    expect(() =>
      assertAllowedTransition({
        request,
        action: "Registry_Assigned",
        actor: actor("Citizen"),
      }),
    ).toThrow("Citizen cannot perform Registry_Assigned.");
  });

  it("blocks skipping directly from Created to resolution", () => {
    expect(() =>
      assertAllowedTransition({
        request,
        action: "Request_Resolved",
        actor: actor("PublicServant"),
        documentHash: "response-hash",
      }),
    ).toThrow("Action Request_Resolved is not allowed from Created.");
  });

  it("blocks follow-up actions after a request is resolved", () => {
    expect(() =>
      assertAllowedTransition({
        request: { ...request, status: "Resolved" },
        action: "Document_Attached",
        actor: actor("PublicServant"),
        documentHash: "document-hash",
      }),
    ).toThrow("Action Document_Attached is not allowed from Resolved.");
  });

  it("requires a document hash for final resolution", () => {
    expect(() =>
      assertAllowedTransition({
        request: { ...request, status: "InProgress" },
        action: "Request_Resolved",
        actor: actor("PublicServant"),
      }),
    ).toThrow("Request_Resolved requires a document hash.");
  });

  it("blocks directors from starting processing work assigned to a public servant", () => {
    expect(() =>
      assertAllowedTransition({
        request: { ...request, status: "Routed" },
        action: "Processing_Started",
        actor: actor("Director"),
      }),
    ).toThrow("Director cannot perform Processing_Started.");
  });
});
