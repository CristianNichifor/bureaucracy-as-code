import { describe, expect, it } from "vitest";
import { BrowserIdentityProvider } from "./BrowserIdentityProvider";
import type { DemoIdentity, IdentityProvider } from "./types";

type SubjectFactory = {
  citizen: DemoIdentity;
  director: DemoIdentity;
  publicServant: DemoIdentity;
};

async function createSubjects(provider: IdentityProvider): Promise<SubjectFactory> {
  const citizen = await provider.createIdentity({
    displayName: "Citizen Demo",
    role: "Citizen",
  });
  const director = await provider.createIdentity({
    displayName: "Director Demo",
    role: "Director",
    institution: "Ministry of Finance",
  });
  const publicServant = await provider.createIdentity({
    displayName: "Public Servant Demo",
    role: "PublicServant",
    institution: "Ministry of Finance",
  });

  return { citizen, director, publicServant };
}

export function runIdentityProviderContract(name: string, createProvider: () => IdentityProvider) {
  describe(`${name} IdentityProvider contract`, () => {
    it("creates DID-backed identities with valid credentials", async () => {
      const provider = createProvider();
      const { citizen, director } = await createSubjects(provider);

      expect(citizen.did).toMatch(/^did:/);
      expect(citizen.credential.subjectDid).toBe(citizen.did);
      expect(citizen.credential.role).toBe("Citizen");
      expect(director.credential.institution).toBe("Ministry of Finance");
      await expect(provider.verifyCredential(citizen.credential)).resolves.toBe(true);
      await expect(provider.verifyCredential(director.credential)).resolves.toBe(true);
    });

    it("signs payload hashes and verifies signatures with the public key", async () => {
      const provider = createProvider();
      const { citizen } = await createSubjects(provider);
      const signature = await provider.signPayload(citizen, {
        requestId: "req-demo-contract",
        action: "Request_Created",
      });

      await expect(
        provider.verifySignature({
          publicKeyJwk: citizen.publicKeyJwk,
          payloadHash: signature.payloadHash,
          signature: signature.signature,
        }),
      ).resolves.toBe(true);
      await expect(
        provider.verifySignature({
          publicKeyJwk: citizen.publicKeyJwk,
          payloadHash: `${signature.payloadHash}-edited`,
          signature: signature.signature,
        }),
      ).resolves.toBe(false);
    });

    it("proves required role, institution, and purpose through a credential presentation", async () => {
      const provider = createProvider();
      const { director } = await createSubjects(provider);
      const presentation = await provider.presentCredential({
        identity: director,
        purpose: "route-law-544-request",
      });

      await expect(
        provider.verifyPresentation({
          presentation,
          requiredRole: "Director",
          requiredInstitution: "Ministry of Finance",
          purpose: "route-law-544-request",
        }),
      ).resolves.toEqual({ valid: true });
      await expect(
        provider.verifyPresentation({
          presentation,
          requiredRole: "PublicServant",
          requiredInstitution: "Ministry of Finance",
          purpose: "route-law-544-request",
        }),
      ).resolves.toEqual({ valid: false, reason: "Required role was not proven." });
    });

    it("allows claim minimization when a verifier does not require every credential claim", async () => {
      const provider = createProvider();
      const { publicServant } = await createSubjects(provider);
      const presentation = await provider.presentCredential({
        identity: publicServant,
        purpose: "attach-law-544-document",
        disclose: { institution: false },
      });

      expect(presentation.disclosedClaims.role).toBe("PublicServant");
      expect(presentation.disclosedClaims.institution).toBeUndefined();
      await expect(
        provider.verifyPresentation({
          presentation,
          requiredRole: "PublicServant",
          purpose: "attach-law-544-document",
        }),
      ).resolves.toEqual({ valid: true });
    });
  });
}

runIdentityProviderContract("BrowserIdentityProvider", () => new BrowserIdentityProvider());
