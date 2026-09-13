# Production Readiness Checklist

The current repository is a browser-only demonstrator. A production system needs
the following work before handling real requests or personal data.

## Identity And Authorization

- Institution-controlled issuer model.
- Verifiable credential revocation.
- Key rotation and recovery.
- Role proof verification on every transition.
- Separation between citizen, official, registry bot, and system identities.

## Ledger And Integrity

- External ledger or timestamp anchor.
- Signature verification during chain verification.
- Head-hash publication and monitoring.
- Event schema versioning and migration policy.
- Replay and duplicate-transition protection.

## Privacy And Security

- Completed DPIA.
- Threat model reviewed by security and legal counsel.
- Strict public/private data contract.
- Encrypted off-chain storage with access logging.
- Incident response and breach notification process.
- CSP tightened after removing inline style needs.

## Operations

- Uptime and backup plan.
- Disaster recovery testing.
- Observability for failed submissions and overdue cases.
- Accessibility testing.
- Cross-browser testing.
- Change management and public changelog.

## Legal And Governance

- Formal Law 544/2001 workflow validation.
- Institution onboarding agreement.
- Record retention schedule.
- Appeal and correction processes.
- Open-source contribution governance.
- Public documentation for citizens.
