# Identity Adapter

The demo depends on an `IdentityProvider` interface, not on ROeID directly. The
browser implementation is a local test double. A custom identity demo repo can
replace it by implementing the same contract.

During Phase 15 readiness, no local custom identity repo was found under
`/home/cristianvn/Work/Dev/Repos/civic` or nearby. This repo therefore exposes a
concrete external adapter slot instead of guessing a package name or API shape.

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

## Adapter Slot

```ts
import type {
  DemoRole,
} from "../src/identity/types";
import {
  ExternalIdentityDemoRepoProvider,
  type ExternalIdentityDemoRepoClient,
} from "../src/identity/external/ExternalIdentityDemoRepoProvider";

const customIdentityRepoClient: ExternalIdentityDemoRepoClient = {
  source: "custom-identity-demo",

  async createSubject(input: {
    displayName: string;
    role: DemoRole;
    institution?: string;
  }) {
    // Call the custom identity repo session/DID API here.
    // Return the canonical DemoIdentity shape used by this backend.
  },

  async signPayload({ identity, payload }) {
    // Ask the custom identity repo to hash/sign the payload or hash canonically
    // before signing. Return SignedPayload.
  },

  async verifySignature(input) {
    // Delegate signature verification to the custom identity demo repo.
  },

  async verifyCredential(credential) {
    // Verify VC issuer, subject DID, role, institution, and expiry.
  },

  async presentCredential(input) {
    // Return a purpose-bound role proof with minimized disclosed claims.
  },

  async verifyPresentation(input) {
    // Verify role, institution, purpose, credential hash, and proof signature.
  },
};

export const identityProvider = new ExternalIdentityDemoRepoProvider(customIdentityRepoClient);
```

The adapter intentionally accepts only `source: "custom-identity-demo"` and fails
closed for any other source label. ROeID is not part of this demo; a future ROeID
adapter should be a separate implementation of the same `IdentityProvider`
interface.

## Contract Tests

Every implementation should run the same behavioral checks now covered by
[`IdentityProvider.contract.test.ts`](../src/identity/IdentityProvider.contract.test.ts):

- identities produce DIDs and valid credentials
- signatures verify and fail after payload hash edits
- role, institution, and purpose proofs verify
- minimized presentations can omit unneeded claims

When the custom identity repo is added, implement
[`ExternalIdentityDemoRepoClient`](../src/identity/external/ExternalIdentityDemoRepoProvider.ts)
with that repo's APIs and call the same contract runner against
`ExternalIdentityDemoRepoProvider`. That gives the future ROeID adapter a clear
target without adding ROeID to this demo.

## Wiring Checklist

1. Install or link the custom identity demo repo package.
2. Implement `ExternalIdentityDemoRepoClient` in this repo or in a thin package
   owned by the identity repo.
3. Map identity sessions to `DemoIdentity`, including DID, public JWK,
   credential, and credential hash.
4. Delegate `signPayload`, `verifySignature`, `presentCredential`, and
   `verifyPresentation` to the identity repo.
5. Add a test beside
   [`ExternalIdentityDemoRepoProvider.test.ts`](../src/identity/external/ExternalIdentityDemoRepoProvider.test.ts)
   that calls `runIdentityProviderContract` with the real client.
6. Keep ROeID out of this adapter; add it later as a separate provider that
   implements the same `IdentityProvider` interface.

## Privacy Notes

The adapter must keep raw personal data and private keys off the public ledger.
Public events should contain only DID hashes, credential hashes, signatures,
timestamps, action types, and document hashes. Credential presentations should
disclose the minimum claim set needed for the transition being attempted.
