import { exportPublicKey, hashJson, sha256Hex, signText, verifyText } from "../shared/crypto";
import type { DemoCredential, DemoIdentity, DemoRole, IdentityProvider, SignedPayload } from "./types";

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
    return credential.issuerDid === ISSUER_DID && credential.subjectDid.startsWith("did:demo:");
  }
}
