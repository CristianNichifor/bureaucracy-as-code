# Privacy Model

The demo is designed to show public accountability without publishing personal
data.

## Public Data

The dashboard may show:

- request identifier
- institution
- current status
- action type
- timestamp
- signer DID hash
- credential hash
- document hash
- previous and current state hashes

## Private Data

The ledger must not contain:

- names
- addresses
- CNPs
- email addresses
- phone numbers
- raw request text
- raw documents
- private signing keys

## Hashes Are Not Anonymization

Hashes reduce exposure, but they are not a complete anonymization strategy. If
the input space is small or guessable, a hash can sometimes be matched by
brute force. The demo therefore treats hashes as integrity references, not as a
replacement for GDPR analysis.

## Browser Demo Limits

The browser ledger proves local tamper evidence. It cannot prove that a user did
not delete the end of a chain unless an external anchor exists, such as a
published head hash, timestamp service, countersignature, or real blockchain.

Imported state does not include private signing keys. New transitions after an
import are signed by identities in the importing browser.

## Production Direction

A production system would need:

- formal DPIA and legal review
- separation between public and restricted views
- institution-controlled keys
- key rotation and revocation
- auditable access controls
- off-chain encrypted storage
- external anchoring of ledger heads
- retention and deletion policies for off-chain data
