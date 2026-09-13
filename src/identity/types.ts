export type DemoRole = "Citizen" | "RegistryBot" | "PublicServant" | "Director";

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
}
