import { exportPublicKey, hashJson, sha256Hex, signText, verifyText } from "../shared/crypto";
import {
  CREDENTIAL_PRESENTATION_SCHEMA_VERSION,
  type CredentialPresentation,
  type DemoCredential,
  type DemoIdentity,
  type DemoRole,
  type IdentityProvider,
  type PresentationVerificationInput,
  type PresentationVerificationResult,
  type SignedPayload,
} from "./types";

const ISSUER_DID = "did:demo:romanian-civic-lab";

export class BrowserIdentityProvider implements IdentityProvider {
  async createIdentity(input: {
    displayName: string;
    role: DemoRole;
    institution?: string;
  }): Promise<DemoIdentity> {
    const keyPair = await crypto.subtle.generateKey(
      { name: "ECDSA", namedCurve: "P-256" },
      true,
      ["sign", "verify"],
    );

    const publicKeyJwk = await exportPublicKey(keyPair.publicKey);
    const didSeed = await hashJson({
      displayName: input.displayName,
      role: input.role,
      institution: input.institution,
      publicKeyJwk,
    });
    const did = `did:demo:${didSeed.slice(0, 24)}`;
    const issuedAt = new Date().toISOString();
    const credential: DemoCredential = {
      id: `vc:${didSeed.slice(0, 16)}`,
      subjectDid: did,
      issuerDid: ISSUER_DID,
      role: input.role,
      institution: input.institution,
      issuedAt,
    };

    return {
      did,
      displayName: input.displayName,
      role: input.role,
      institution: input.institution,
      publicKeyJwk,
      privateKey: keyPair.privateKey,
      credential,
      credentialHash: await hashJson(credential),
    };
  }

  async signPayload(identity: DemoIdentity, payload: unknown): Promise<SignedPayload> {
    const payloadHash = await hashJson(payload);
    return {
      payloadHash,
      signature: await signText(identity.privateKey, payloadHash),
      signerDid: identity.did,
      signerDidHash: await sha256Hex(identity.did),
      signingKeyId: `${identity.did}#p256-demo-key`,
      signedAt: new Date().toISOString(),
    };
  }

  async verifySignature(input: {
    publicKeyJwk: JsonWebKey;
    payloadHash: string;
    signature: string;
  }): Promise<boolean> {
    return verifyText(input.publicKeyJwk, input.signature, input.payloadHash);
  }

  async verifyCredential(credential: DemoCredential): Promise<boolean> {
    const expiresAt = credential.expiresAt ? Date.parse(credential.expiresAt) : undefined;

    return (
      credential.issuerDid === ISSUER_DID &&
      credential.subjectDid.startsWith("did:demo:") &&
      (!expiresAt || expiresAt > Date.now())
    );
  }

  async presentCredential(input: {
    identity: DemoIdentity;
    purpose: string;
    disclose?: {
      role?: boolean;
      institution?: boolean;
    };
  }): Promise<CredentialPresentation> {
    const disclosedClaims = {
      role: input.disclose?.role === false ? undefined : input.identity.role,
      institution: input.disclose?.institution === false ? undefined : input.identity.institution,
    };
    const credentialHash = await hashJson(input.identity.credential);
    const proofPayload = {
      schemaVersion: CREDENTIAL_PRESENTATION_SCHEMA_VERSION,
      presentationType: "credential.role-proof",
      subjectDid: input.identity.did,
      credentialHash,
      disclosedClaims,
      purpose: input.purpose,
    };

    return {
      ...proofPayload,
      schemaVersion: CREDENTIAL_PRESENTATION_SCHEMA_VERSION,
      presentationType: "credential.role-proof",
      publicKeyJwk: input.identity.publicKeyJwk,
      credential: input.identity.credential,
      proof: await this.signPayload(input.identity, proofPayload),
    };
  }

  async verifyPresentation(input: PresentationVerificationInput): Promise<PresentationVerificationResult> {
    const { presentation } = input;

    if (
      presentation.schemaVersion !== CREDENTIAL_PRESENTATION_SCHEMA_VERSION ||
      presentation.presentationType !== "credential.role-proof"
    ) {
      return { valid: false, reason: "Unsupported credential presentation schema." };
    }

    if (presentation.subjectDid !== presentation.credential.subjectDid) {
      return { valid: false, reason: "Presentation subject does not match credential subject." };
    }

    if (!(await this.verifyCredential(presentation.credential))) {
      return { valid: false, reason: "Credential is not valid." };
    }

    if ((await hashJson(presentation.credential)) !== presentation.credentialHash) {
      return { valid: false, reason: "Credential hash does not match presented credential." };
    }

    if (presentation.disclosedClaims.role && presentation.disclosedClaims.role !== presentation.credential.role) {
      return { valid: false, reason: "Disclosed role does not match credential." };
    }

    if (
      presentation.disclosedClaims.institution &&
      presentation.disclosedClaims.institution !== presentation.credential.institution
    ) {
      return { valid: false, reason: "Disclosed institution does not match credential." };
    }

    if (input.purpose && input.purpose !== presentation.purpose) {
      return { valid: false, reason: "Presentation purpose does not match." };
    }

    if (input.requiredRole && presentation.disclosedClaims.role !== input.requiredRole) {
      return { valid: false, reason: "Required role was not proven." };
    }

    if (input.requiredInstitution && presentation.disclosedClaims.institution !== input.requiredInstitution) {
      return { valid: false, reason: "Required institution was not proven." };
    }

    const proofPayload = {
      schemaVersion: presentation.schemaVersion,
      presentationType: presentation.presentationType,
      subjectDid: presentation.subjectDid,
      credentialHash: presentation.credentialHash,
      disclosedClaims: presentation.disclosedClaims,
      purpose: presentation.purpose,
    };
    const payloadHash = await hashJson(proofPayload);

    if (presentation.proof.signerDid !== presentation.subjectDid || presentation.proof.payloadHash !== payloadHash) {
      return { valid: false, reason: "Presentation proof payload does not match." };
    }

    const signatureValid = await this.verifySignature({
      publicKeyJwk: presentation.publicKeyJwk,
      payloadHash,
      signature: presentation.proof.signature,
    });

    return signatureValid ? { valid: true } : { valid: false, reason: "Presentation signature is invalid." };
  }
}
