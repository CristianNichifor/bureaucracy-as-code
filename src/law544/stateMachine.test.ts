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
});
