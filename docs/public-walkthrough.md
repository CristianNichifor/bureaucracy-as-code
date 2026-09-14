# Public Walkthrough

Use this version when showing the demo to citizens, journalists, civic
technologists, or public-sector reviewers. Keep the story about visibility and
accountability, not infrastructure.

## Five-minute flow

1. Open the public request explorer.
2. Point to the seeded Law 544 requests and explain that personal data is hidden.
3. Run the guided request from submission to final response.
4. Show the audit trail: every step has a signer role, DID hash, payload hash,
   previous state hash, new state hash, timestamp, and signature.
5. Open the machinery graph and show where the file sits.
6. Export an audit receipt for the selected request.
7. Verify a final response file against the on-ledger hash.
8. Switch to Romanian mode and repeat the core accountability message.

## Plain-language explanation

This demo treats every bureaucratic action as a signed state change. A request
is not just "in progress"; it has a public sequence of signed steps that can be
checked later. The browser demo uses a local hash-chain ledger, so it works
without accounts, secrets, or external infrastructure.

## What to emphasize

- Citizens see request status and responsibility without seeing personal data.
- Public servants are represented by role and DID hash, not private details.
- Documents stay off-ledger; hashes prove whether a received file matches.
- A changed export or receipt is refused by the verifier.
- The current milestone is browser-only and ready for Cloudflare Pages hosting.

## What not to claim

- Do not claim this is connected to ROeID.
- Do not claim this is legally validated for production use.
- Do not claim the browser ledger is a national production ledger.
- Do not upload or paste real Law 544 request data into the demo.
