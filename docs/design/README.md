# Design screens — target state

Static, self-contained mockups of the four screens that matter most, drawn
with Civic UI 0.8 token values (copied inline from civic-ui
`src/foundations.css` and `themes/neutral.css`; no external requests, no
scripts). Each file renders the desktop layout at 1440 px and the phone layout
at 390 px through one media query; the PNGs next to each file are Playwright
screenshots at both widths. The "before" screenshots are the live site on
2026-10-14 (`before-1440.png`, `before-390.png`, `before-presenter-1440.png`).

Inputs: [the app guideline](../ux-guidelines.md), the fleet guideline in
civic-ui (`docs/ux-guidelines.md`), the live UX review of 2026-10-14, and the
current `src/` on `dev`. Data in the mockups comes from
`src/demo/seededRequests.ts` (as of 2026-09-13) and `src/demo/demoText.ts`;
values the app computes at run time are shown as `—` or `REQ-2026-········`.
Romanian copy in the mockups was written by an agent: **needs human review**.

Spec items: BAC-16 to BAC-19 in
[production-readiness.md](../specs/production-readiness.md).

## Index

| # | Screen | User task | Guideline sections | What changes vs today |
| --- | --- | --- | --- | --- |
| 01 | [First screen, three acts](screens/01-first-screen.html) ([1440](screens/01-first-screen-1440.png), [390](screens/01-first-screen-390.png)) | Start the request and see the Law 544/2001 terms | app §1, §2, §5 loading; fleet §1, §2, §5 | Adds the family bar with hub link and "Date demonstrative" badge (UXG-1, UXG-2), the provenance line, the H1 from the naming registry ("Birocrație ca program", UXG-6), a staged loading state (UXG-5), an error state with retry, and a footer with method, privacy, source and contact (UXG-3). Scenario shortcuts and tools move behind `details` so the one primary button stands alone. |
| 02 | [Request detail with proof](screens/02-request-detail-proof.html) ([1440](screens/02-request-detail-proof-1440.png), [390](screens/02-request-detail-proof-390.png)) | Check who holds the file, what each step signed, and verify the answer locally | app §4, §5 tampered; fleet §4, §5 | Merges the evidence brief and request detail into one header; the handoff lane plus the signed trail table become the text alternative to the machinery graph (fleet §4); hash verifier and integrity panel get designed waiting / match / mismatch / tampered states in words with a retry action (UXG-7 glosses "jurnal verificabil", "amprentă (hash)"). |
| 03 | [Public explorer](screens/03-explorer.html) ([1440](screens/03-explorer-1440.png), [390](screens/03-explorer-390.png)) | Find a request by status, institution or deadline | app §5 empty; fleet §4 stat tiles, §5, §6 | Count tiles replace hand-rolled cards; one filter toolbar with a reset button; status as symbol + word, deadline as date + words; empty state names the filters and offers "Resetează filtrele" (UXG-9); institution load as a table; cards at 390 px. |
| 04 | [Presenter mode](screens/04-presenter-mode.html) ([1440](screens/04-presenter-mode-1440.png), [390](screens/04-presenter-mode-390.png)) | Run the five-minute demo and show the release checks | app §1 presenter, §3 banned terms (allowed here); fleet §7 | A "Mod prezentare" badge and a status banner make the mode visible; the checklist tracks the real demo state and links to each act; release readiness, operator commands and the completeness table are grouped and come first. |

## Shared rules every screen follows

- Page anatomy: family bar → H1 → purpose → "Date: …" line → primary task →
  secondary views → footer (method, Law 544/2001 caveat, privacy, source,
  contact, build metadata).
- Status vocabulary: the family bar badge is always "Date demonstrative"
  (`warning` tone); request statuses use the labels in `src/locale.ts`.
- Colour is never the only signal: badges carry a symbol and a word, lanes
  carry text, the graph has a table.
- Targets ≥ 24 px everywhere, 44 px for primary buttons and form controls;
  visible focus with `--civic-focus`; `prefers-reduced-motion` and
  `forced-colors` rules included.
- AA contrast: text uses `--civic-text`/`--civic-muted` on `--civic-surface`;
  status badges use the paired `--civic-on-*` tokens.
- No horizontal scroll at 390 px (checked by the screenshot script:
  `scrollWidth` equals the viewport for all eight shots).

## Implementation notes

- Family bar, footer and the provenance line are the same markup on every
  screen; implement once in `src/App.tsx` (or adopt civic-ui `SiteShell`
  when BAC-6 lands) and reuse.
- The hero button label flips to "Continuă cererea" after the first signed
  event; the act bar text "pasul n/6" comes from `getCurrentStepIndex`.
- Loading stages map to the three steps `createBrowserDemoRuntime` already
  performs (identities, credentials, empty chain).
- Hash strings in screen 02 are the padded fixture values from
  `seededRequests.ts`, truncated with `…` in tables; show the full value in
  the per-event proof `details`.
- Explorer counts in screen 03 are derived from the nine seeded requests plus
  the live draft (9 institutions, 7 open, 1 overdue, 3 closed); compute them,
  do not hard-code.
- The screens do not add new strings beyond those in `src/i18n.ts` except:
  the purpose line, the provenance line, the loading stage names, the error
  texts, the mismatch/tampered sentences and the empty-state sentence. Add
  them to both dictionaries (BAC-11).

## Acceptance criteria

See BAC-16 to BAC-19 in the spec; each bullet there is phrased as a test.
