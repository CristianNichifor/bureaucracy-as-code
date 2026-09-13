import { describe, expect, it } from "vitest";
import { BrowserIdentityProvider } from "../BrowserIdentityProvider";
import { runIdentityProviderContract } from "../IdentityProvider.contract.test";
import type {
  CredentialPresentation,
  DemoCredential,
  DemoIdentity,
  PresentationVerificationInput,
  PresentationVerificationResult,
  SignedPayload,
} from "../types";
import {
  ExternalIdentityDemoRepoProvider,
  type ExternalIdentityDemoRepoClient,
  type ExternalIdentitySubjectInput,
} from "./ExternalIdentityDemoRepoProvider";

class MockCustomIdentityDemoClient implements ExternalIdentityDemoRepoClient {
  readonly source = "custom-identity-demo" as const;
  private readonly provider = new BrowserIdentityProvider();

  async createSubject(input: ExternalIdentitySubjectInput): Promise<DemoIdentity> {
    return this.provider.createIdentity(input);
  }

  async signPayload(input: { identity: DemoIdentity; payload: unknown }): Promise<SignedPayload> {
    return this.provider.signPayload(input.identity, input.payload);
  }

  async verifySignature(input: {
    publicKeyJwk: JsonWebKey;
    payloadHash: string;
    signature: string;
  }): Promise<boolean> {
    return this.provider.verifySignature(input);
  }

  async verifyCredential(credential: DemoCredential): Promise<boolean> {
    return this.provider.verifyCredential(credential);
  }

  async presentCredential(input: {
    identity: DemoIdentity;
    purpose: string;
    disclose?: { role?: boolean; institution?: boolean };
  }): Promise<CredentialPresentation> {
    return this.provider.presentCredential(input);
  }

  async verifyPresentation(input: PresentationVerificationInput): Promise<PresentationVerificationResult> {
    return this.provider.verifyPresentation(input);
  }
}

runIdentityProviderContract(
  "ExternalIdentityDemoRepoProvider",
  () => new ExternalIdentityDemoRepoProvider(new MockCustomIdentityDemoClient()),
);

describe("ExternalIdentityDemoRepoProvider", () => {
  it("fails closed when configured with a non-custom identity source", async () => {
    const client = new MockCustomIdentityDemoClient();
    Object.defineProperty(client, "source", { value: "roeid" });
    const provider = new ExternalIdentityDemoRepoProvider(client);

    await expect(
      provider.createIdentity({
        displayName: "Citizen Demo",
        role: "Citizen",
      }),
    ).rejects.toThrow("Only the custom identity demo source is supported by this adapter.");
  });
});
