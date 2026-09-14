# Civic UI Usage

This app owns its domain components, but they should stay aligned to the
CSS-only Civic UI token contract in `src/civic-ui-adapter.css`.

## Token Contract

- Use `--civic-bg`, `--civic-surface`, and `--civic-raised` for page and panel
  surfaces.
- Use `--civic-text`, `--civic-muted`, and `--civic-subtle` for text hierarchy.
- Use semantic tokens for state: `--civic-success`, `--civic-danger`,
  `--civic-warning`, and `--civic-accent`.
- Use `--civic-radius`, `--civic-panel-radius`, and
  `--civic-control-height` for shared component geometry.
- Keep the page width at `--civic-page-max`: full-width under 1920px and
  centered above 1920px.

## Components

- `.panel`: dashboard sections and tool surfaces.
- `.civicButton`: primary actions.
- `.civicButtonSecondary`: secondary toolbar and utility actions.
- `.segmentedToggle`: language and theme controls.
- `.pill`: compact state or metadata indicator.
- `.status`: request lifecycle status.
- `.metric`: request detail facts.
- `.explainBox`: short civic-facing explanation inside complex panels.

## Theme Rules

The app supports light and dark themes with `document.documentElement.dataset.theme`.
The explicit user selection is stored as `bac-theme` in local storage. Without a
saved preference, the app follows `prefers-color-scheme`.

When adding UI:

- test both themes
- avoid hard-coded colors
- preserve visible focus states
- keep text wrapping inside panels and buttons
- check 320px, 768px, 1440px, 1920px, and 2560px viewports
