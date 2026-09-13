# Demo Script

Use this script to walk through the browser demo from request submission to
public verification.

## 1. Open the App

Open the deployed demo or run it locally:

```bash
pnpm install
pnpm dev
```

The app starts with browser-local demo state only.

## 2. Create a Law 544 Request

Submit a sample public information request to an institution. The app creates a
request event, hashes the payload, signs it with the citizen identity, and
stores a `Request_Created` transition in the local ledger.

Expected public view:

- new request appears in the feed
- status is `Created`
- citizen identity is shown only as a DID hash

## 3. Assign Registry Number

Run the registry step. The demo signs a `Registry_Assigned` transition with the
registry automation identity.

Expected public view:

- status advances to `Registered`
- audit trail shows the registry actor
- previous and current state hashes remain valid

## 4. Route the File

Run the director routing step. The file is assigned to a public servant DID hash.

Expected public view:

- status advances to `Routed`
- machinery graph shows institution -> director -> assigned servant

## 5. Process the Request

Run processing actions such as attaching a document hash or requesting an
extension. The state machine allows only legal transitions.

Expected public view:

- audit trail lists each signed action
- document content is not public
- hashes are public integrity references

## 6. Resolve the Request

Upload or simulate a final response and resolve the request. The app records
`Request_Resolved` with the final document hash.

Expected public view:

- status is `Resolved`
- final response hash is visible
- ledger verification passes

## 7. Verify a Document

Use the hash verifier with the received response file. The browser hashes the
file locally and compares it with the recorded hash.

Expected result:

- matching file: integrity verified
- changed file: hash mismatch

## 8. Export and Import

Export the demo state as JSON, then import it into another browser session.

Expected result:

- valid chain imports successfully
- tampered chain is refused

## Talking Points

- Bureaucratic action is modeled as signed state transition.
- The ledger records minimal public evidence, not personal data.
- Citizens can inspect status, responsibility, and audit history.
- The browser ledger is a local demo. Production needs external anchoring or a
  real ledger provider.
