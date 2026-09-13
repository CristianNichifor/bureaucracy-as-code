# DPIA Notes

These notes are a starting point for a future Data Protection Impact Assessment.
They are not a completed DPIA.

## Processing Purpose

Demonstrate how public information requests could expose administrative
accountability while minimizing personal data in the public record.

## Data Categories

Public demo data:

- request identifier
- institution
- status
- action type
- timestamp
- signer DID hash
- credential hash
- document hash
- state hashes

Private or restricted data:

- citizen identity attributes
- contact details
- raw request text
- raw response documents where they contain personal data
- internal notes and drafts
- private signing keys

## Privacy Principles

- Minimize on-ledger data.
- Treat hashes as integrity references, not anonymization.
- Keep raw documents off-ledger.
- Export public state without signing keys.
- Prefer role proofs over full identity disclosure.

## DPIA Questions For Production

- Who is the controller for each institution and shared service?
- What legal basis applies to each processing step?
- Which fields are public by law and which must stay restricted?
- How are access requests, corrections, and appeals handled?
- How are off-chain records retained, archived, and deleted?
- How are compromised keys revoked without rewriting history?
- How are children, vulnerable people, and sensitive requests protected?
- What external anchoring data becomes public and for how long?

## Residual Demo Risk

The browser demo intentionally uses local state. It does not prove durable
public publication, institution custody, or real-world identity assurance.
