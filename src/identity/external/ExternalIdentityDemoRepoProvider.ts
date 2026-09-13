import type {
  CredentialPresentation,
  DemoCredential,
  DemoIdentity,
  DemoRole,
  IdentityProvider,
  PresentationVerificationInput,
  PresentationVerificationResult,
  SignedPayload,
} from "../types";

export type ExternalIdentitySubjectInput = {
  displayName: string;
  role: DemoRole;
  institution?: string;
};

export interface ExternalIdentityDemoRepoClient {
  readonly source: "custom-identity-demo";
  createSubject(input: ExternalIdentitySubjectInput): Promise<DemoIdentity>;
  signPayload(input: { identity: DemoIdentity; payload: unknown }): Promise<SignedPayload>;
  verifySignature(input: {
    publicKeyJwk: JsonWebKey;
    payloadHash: string;
    signature: string;
  }): Promise<boolean>;
  verifyCredential(credential: DemoCredential): Promise<boolean>;
  presentCredential(input: {
    identity: DemoIdentity;
    purpose: string;
    disclose?: {
      role?: boolean;
      institution?: boolean;
    };
  }): Promise<CredentialPresentation>;
  verifyPresentation(input: PresentationVerificationInput): Promise<PresentationVerificationResult>;
}

export class ExternalIdentityDemoRepoProvider implements IdentityProvider {
  constructor(private readonly client: ExternalIdentityDemoRepoClient) {}

  async createIdentity(input: ExternalIdentitySubjectInput): Promise<DemoIdentity> {
    this.assertCustomDemoSource();
    return this.client.createSubject(input);
  }

  async signPayload(identity: DemoIdentity, payload: unknown): Promise<SignedPayload> {
    this.assertCustomDemoSource();
    return this.client.signPayload({ identity, payload });
  }

  async verifySignature(input: {
    publicKeyJwk: JsonWebKey;
    payloadHash: string;
    signature: string;
  }): Promise<boolean> {
    this.assertCustomDemoSource();
    return this.client.verifySignature(input);
  }

  async verifyCredential(credential: DemoCredential): Promise<boolean> {
    this.assertCustomDemoSource();
    return this.client.verifyCredential(credential);
  }

  async presentCredential(input: {
    identity: DemoIdentity;
    purpose: string;
    disclose?: {
      role?: boolean;
      institution?: boolean;
    };
  }): Promise<CredentialPresentation> {
    this.assertCustomDemoSource();
    return this.client.presentCredential(input);
  }

  async verifyPresentation(input: PresentationVerificationInput): Promise<PresentationVerificationResult> {
    this.assertCustomDemoSource();
    return this.client.verifyPresentation(input);
  }

  private assertCustomDemoSource() {
    if (this.client.source !== "custom-identity-demo") {
      throw new Error("Only the custom identity demo source is supported by this adapter.");
    }
  }
}
