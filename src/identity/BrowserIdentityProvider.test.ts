import { describe, expect, it } from "vitest";
import { BrowserIdentityProvider } from "./BrowserIdentityProvider";

describe("BrowserIdentityProvider", () => {
  it("presents and verifies a role proof for a specific purpose", async () => {
    const provider = new BrowserIdentityProvider();
    const director = await provider.createIdentity({
      displayName: "Director Demo",
      role: "Director",
      institution: "Ministry of Finance",
    });

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
  });

  it("rejects a presentation for the wrong required role", async () => {
    const provider = new BrowserIdentityProvider();
    const publicServant = await provider.createIdentity({
      displayName: "Public Servant Demo",
      role: "PublicServant",
      institution: "Ministry of Finance",
    });

    const presentation = await provider.presentCredential({
      identity: publicServant,
      purpose: "route-law-544-request",
    });

    await expect(
      provider.verifyPresentation({
        presentation,
        requiredRole: "Director",
        purpose: "route-law-544-request",
      }),
    ).resolves.toEqual({ valid: false, reason: "Required role was not proven." });
  });

  it("rejects a presentation replayed for a different purpose", async () => {
    const provider = new BrowserIdentityProvider();
    const citizen = await provider.createIdentity({
      displayName: "Citizen Demo",
      role: "Citizen",
    });

    const presentation = await provider.presentCredential({
      identity: citizen,
      purpose: "submit-law-544-request",
    });

    await expect(
      provider.verifyPresentation({
        presentation,
        requiredRole: "Citizen",
        purpose: "route-law-544-request",
      }),
    ).resolves.toEqual({ valid: false, reason: "Presentation purpose does not match." });
  });

  it("rejects a presentation with edited disclosed claims", async () => {
    const provider = new BrowserIdentityProvider();
    const registryBot = await provider.createIdentity({
      displayName: "Registry Bot",
      role: "RegistryBot",
      institution: "Ministry of Finance",
    });
    const presentation = await provider.presentCredential({
      identity: registryBot,
      purpose: "assign-registry-number",
    });

    const forged = {
      ...presentation,
      disclosedClaims: {
        ...presentation.disclosedClaims,
        role: "Director" as const,
      },
    };

    await expect(
      provider.verifyPresentation({
        presentation: forged,
        requiredRole: "Director",
        purpose: "assign-registry-number",
      }),
    ).resolves.toEqual({ valid: false, reason: "Disclosed role does not match credential." });
  });

  it("can withhold institution when the verifier does not require it", async () => {
    const provider = new BrowserIdentityProvider();
    const director = await provider.createIdentity({
      displayName: "Director Demo",
      role: "Director",
      institution: "Ministry of Finance",
    });

    const presentation = await provider.presentCredential({
      identity: director,
      purpose: "prove-director-role",
      disclose: { institution: false },
    });

    expect(presentation.disclosedClaims.institution).toBeUndefined();
    await expect(
      provider.verifyPresentation({
        presentation,
        requiredRole: "Director",
        purpose: "prove-director-role",
      }),
    ).resolves.toEqual({ valid: true });
  });
});
