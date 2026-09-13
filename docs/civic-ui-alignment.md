# Civic UI Alignment

This demo follows the CSS-only Civic UI adoption pattern used by sibling civic
apps: shared Civic UI tokens define the visual contract, while each app keeps
domain-specific components host-owned.

## Reference

- `civic/achizitii-deschise/docs/CIVIC_UI.md`
- `engineering/legislativ/app/civic-ui-adapter.css`
- `engineering/legislativ/app/vendor/civic-ui/*`

The upstream Civic UI release is CSS-only. This app does not need shared React
components or browser network dependencies for the browser-only milestone.

## Local Adapter

`src/civic-ui-adapter.css` maps the shared token names:

- surfaces: `--civic-bg`, `--civic-surface`, `--civic-raised`
- text: `--civic-text`, `--civic-muted`, `--civic-subtle`
- interaction: `--civic-action`, `--civic-action-hover`, `--civic-focus`
- status: `--civic-success`, `--civic-danger`, `--civic-warning`,
  `--civic-accent`
- structure: `--civic-border`, `--civic-radius`,
  `--civic-control-height`, `--civic-page-max`

`src/styles.css` should consume these tokens instead of hard-coded values as
the UI alignment work proceeds.

## Component Ownership

Host-owned components:

- request explorer table/cards
- guided scenario controls
- bureaucratic machinery graph
- audit trail proof disclosure
- response hash verifier
- audit receipt verifier

Use Civic UI conventions for controls and states, but keep these components
tailored to the Law 544 transparency workflow.

## Responsive Contract

The app should be verified at:

- 320px narrow mobile
- 375px standard mobile
- 768px tablet
- 1024px laptop
- 1440px desktop
- wide desktop

Release criteria:

- no horizontal body scroll
- no clipped button text
- no overlapping graph labels
- filters and action bars wrap predictably
- request detail, audit trail, and verifier panels remain readable
- keyboard focus is visible on every interactive control
