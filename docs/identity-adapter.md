# Identity Adapter

The demo depends on an `IdentityProvider` interface, not on ROeID directly. The
browser implementation is a local test double. A custom identity demo repo can
replace it by implementing the same contract.

## Required Boundary

An adapter must provide:

- DID-backed subject creation or session restore.
- Credential verification for `Citizen`, `RegistryBot`, `PublicServant`, and
  `Director` roles.
- Payload signing that returns a payload hash, DID, DID hash, key id, signature,
  and signing timestamp.
- Signature verification from a public JWK and payload hash.
- Credential presentations scoped to a purpose, with optional claim
  minimization.
- Presentation verification for role, institution, purpose, credential hash, and
  proof signature.

The canonical TypeScript boundary is
[`src/identity/types.ts`](../src/identity/types.ts).

## Adapter Shape

```ts
import type {
  CredentialPresentation,
  DemoCredential,
  DemoIdentity,
  DemoRole,
  IdentityProvider,
  PresentationVerificationInput,
  PresentationVerificationResult,
  SignedPayload,
} from "../src/identity/types";

export class CustomIdentityRepoProvider implements IdentityProvider {
  async createIdentity(input: {
    displayName: string;
    role: DemoRole;
    institution?: string;
  }): Promise<DemoIdentity> {
    // Call the custom identity repo session/DID API here.
    throw new Error("not implemented");
  }

  async signPayload(identity: DemoIdentity, payload: unknown): Promise<SignedPayload> {
    // Hash canonically, then ask the identity repo to sign the hash.
    throw new Error("not implemented");
  }

  async verifySignature(input: {
    publicKeyJwk: JsonWebKey;
    payloadHash: string;
    signature: string;
  }): Promise<boolean> {
    throw new Error("not implemented");
  }

  async verifyCredential(credential: DemoCredential): Promise<boolean> {
    throw new Error("not implemented");
  }

  async presentCredential(input: {
    identity: DemoIdentity;
    purpose: string;
    disclose?: { role?: boolean; institution?: boolean };
  }): Promise<CredentialPresentation> {
    throw new Error("not implemented");
  }

  async verifyPresentation(
    input: PresentationVerificationInput,
  ): Promise<PresentationVerificationResult> {
    throw new Error("not implemented");
  }
}
```

## Contract Tests

Every implementation should run the same behavioral checks now covered by
[`IdentityProvider.contract.test.ts`](../src/identity/IdentityProvider.contract.test.ts):

- identities produce DIDs and valid credentials
- signatures verify and fail after payload hash edits
- role, institution, and purpose proofs verify
- minimized presentations can omit unneeded claims

When the custom identity repo is added, export its provider from this repo and
call the same contract runner against it. That gives the future ROeID adapter a
clear target without adding ROeID to this demo.

## Privacy Notes

The adapter must keep raw personal data and private keys off the public ledger.
Public events should contain only DID hashes, credential hashes, signatures,
timestamps, action types, and document hashes. Credential presentations should
disclose the minimum claim set needed for the transition being attempted.

