# Threat Model

This document captures the security boundary of the browser-only demo. It is
not a production accreditation document.

## Assets

- private signing keys generated in the browser
- encrypted local documents and their hashes
- exported demo state JSON
- public audit events and state hashes
- role credentials used by the demo identities

## Trust Boundaries

- The browser is trusted for local signing and storage during the demo.
- Exported state is untrusted input and must verify before import.
- Ledger events are public evidence, not private data storage.
- Cloudflare Pages serves static assets only; it is not a trusted signer.

## Main Threats

| Threat | Demo mitigation | Production requirement |
| --- | --- | --- |
| Editing an exported event | Import re-runs hash-chain verification and rejects modified events. | Verify signatures and anchor ledger heads externally. |
| Truncating the end of a chain | Documented limitation. A shorter chain can still be internally valid. | Publish head hashes, timestamp heads, or write to a real ledger. |
| Leaking PII through fixtures | `pnpm privacy:scan` checks repo-authored text for obvious PII patterns. | Data classification, review gates, DLP, and DPIA controls. |
| Exposing signing keys | Export excludes private key material. | Institution HSM/KMS keys, rotation, revocation, and audit logging. |
| XSS in a static app | CSP and restrictive Cloudflare headers. | Strict CSP without unsafe inline styles, dependency review, and security testing. |
| Role forgery | State transitions check demo role boundaries. | Verifiable credential issuer trust registry and revocation checks. |
| Replaying a signed transition | API ingestion rejects repeated signer nonce values. | Atomic nonce persistence, signature expiry windows, and replay alerting. |
| Cross-origin API abuse | Functions reflect only configured CORS origins. | Environment-specific origin allowlists and edge/WAF policy. |
| Transition flooding | Lightweight rate-limit helper documented for demo/runtime adapters. | Cloudflare edge rate limits plus per-signer durable counters. |

## Non-Goals

- No ROeID integration.
- No claim of legal validity.
- No real multi-party consensus.
- No production-grade key custody.
- No promise that hashes alone anonymize personal data.
