# Demo Script

Use this script to walk through the browser demo from request submission to
public verification. The goal is to show a citizen-facing explorer, not a
production public administration system.

## 1. Open the App

Open the deployed demo or run it locally:

```bash
pnpm install
pnpm dev
```

The app starts with browser-local demo state only.

Presenter note:

- standalone URL: `https://bureaucracy-as-code.pages.dev/`
- target digital URL: `https://digital.cristian-nichifor.com/bureaucracy-as-code/`
- all identities, credentials, documents, and ledger events are local demo data
- open the deployed demo once while online to warm the offline presentation cache

Point out the public feed first. It already contains seeded anonymized requests
so the dashboard looks useful before the guided scenario begins.

Before running the scenario, briefly anchor the audience on the release panels:

- **Demo completeness** maps the browser-only milestone to the agreed finish
  criteria.
- **Transfer safety** explains export/import behavior and why private signing
  keys never leave the browser.
- **Release readiness** and **Presenter checklist** show the commands and live
  walkthrough order for operators.

Use the language toggle in the top-right corner to switch between English and
Romanian presenter modes. The Romanian copy is intentionally concise and public
demo-oriented, so it works well for walking through the civic concept without
turning the screen into implementation documentation.

## 2. Create a Law 544 Request

Submit a sample public information request to an institution. The app creates a
request event, hashes the payload, signs it with the citizen identity, and
stores a `Request_Created` transition in the local ledger.

Expected public view:

- new request appears in the feed
- status is `Created`
- citizen identity is shown only as a DID hash
- the request detail panel marks it as the active browser-created run

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
- the graph continues to show where the file currently sits

## 6. Resolve the Request

Upload or simulate a final response and resolve the request. The app records
`Request_Resolved` with the final document hash.

Expected public view:

- status is `Resolved`
- final response hash is visible
- ledger verification passes
- the response hash verifier now has an on-ledger value to compare against

## 7. Verify a Document

Use the hash verifier with the received response file. The browser hashes the
file locally and compares it with the recorded hash. The file is not uploaded
by the verifier; only its hash is computed in the browser.

Expected result:

- matching file: integrity verified
- changed file: hash mismatch

## 8. Export and Import

Export the demo state as JSON, then import it into another browser session.

Expected result:

- valid chain imports successfully
- tampered chain is refused
- imported requests remain verifiable public evidence
- imported state cannot impersonate original actors for new transitions

Then use **Test edited export** in the ledger integrity panel. Explain that the
demo edits an exported event and proves the import path refuses it because the
event no longer matches the hash chain.

## 9. Export Public Evidence

Select any request from the public feed and use **Export receipt**. The browser
downloads a JSON receipt containing the selected request metadata, public hashes,
signed event trail, and current chain head.

Expected result:

- filename follows `<request-id>-audit-receipt.json`
- receipt schema is `law544-public-audit-receipt/v2`
- receipt includes summary, privacy notes, verification steps, and event evidence
- receipt includes no raw document, private key, or personal data
- seeded requests and the live browser-created request can both be exported
- receipt is explainable as public evidence, not as the production source of truth

Open the receipt during the demo only after the audience has seen the dashboard.
The most useful fields to point at are `summary.chainHead`,
`summary.finalResponseDocumentHash`, `privacy`, and the `evidence` sequence.

Then use **Export proof report** to show the wider public snapshot. The proof
report packages visible requests, chain status, privacy notes, and the
verification checklist without exporting raw documents or signing keys.

## 10. Capture the Demo

For README screenshots or a short product walkthrough, use the seeded public
view first, then run:

```bash
pnpm demo:capture
```

The automated capture pack records:

- desktop public explorer with seeded anonymized requests
- desktop completed guided Law 544 request
- desktop proof report export path
- Romanian mobile presentation mode
- ultrawide layout centered above 1920px

## Talking Points

- Bureaucratic action is modeled as signed state transition.
- The ledger records minimal public evidence, not personal data.
- Citizens can inspect status, responsibility, and audit history.
- Demo completeness is visible in-app, so the scope is auditable during the
  presentation.
- Romanian/English mode makes the same demo usable for local stakeholders and
  international technical reviewers.
- Audit receipt and proof report exports give portable artifacts for
  conversations, procurement notes, or issue reports while keeping the canonical
  state in the ledger path.
- The browser ledger is the canonical source for this demo milestone.
- Cloudflare Pages Functions and D1/KV adapters are available as engineering
  references, but the live walkthrough does not depend on them.
