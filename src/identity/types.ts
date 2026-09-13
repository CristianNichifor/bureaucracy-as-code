export type DemoRole = "Citizen" | "RegistryBot" | "PublicServant" | "Director";

export const CREDENTIAL_PRESENTATION_SCHEMA_VERSION = "demo-credential-presentation/v1";

export type CredentialPresentationSchemaVersion = typeof CREDENTIAL_PRESENTATION_SCHEMA_VERSION;

export type DemoCredential = {
  id: string;
  subjectDid: string;
  issuerDid: string;
  role: DemoRole;
  institution?: string;
  issuedAt: string;
  expiresAt?: string;
};

export type DemoIdentity = {
  did: string;
  displayName: string;
  role: DemoRole;
  institution?: string;
  publicKeyJwk: JsonWebKey;
  privateKey: CryptoKey;
  credential: DemoCredential;
  credentialHash: string;
};

export type SignedPayload = {
  payloadHash: string;
  signature: string;
  signerDid: string;
  signerDidHash: string;
  signingKeyId: string;
  signedAt: string;
};

export type CredentialPresentation = {
  schemaVersion: CredentialPresentationSchemaVersion;
  presentationType: "credential.role-proof";
  subjectDid: string;
  publicKeyJwk: JsonWebKey;
  credential: DemoCredential;
  credentialHash: string;
  disclosedClaims: {
    role?: DemoRole;
    institution?: string;
  };
  purpose: string;
  proof: SignedPayload;
};

export type PresentationVerificationInput = {
  presentation: CredentialPresentation;
  requiredRole?: DemoRole;
  requiredInstitution?: string;
  purpose?: string;
};

export type PresentationVerificationResult = {
  valid: boolean;
  reason?: string;
};

export interface IdentityProvider {
  createIdentity(input: {
    displayName: string;
    role: DemoRole;
    institution?: string;
  }): Promise<DemoIdentity>;
  signPayload(identity: DemoIdentity, payload: unknown): Promise<SignedPayload>;
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
