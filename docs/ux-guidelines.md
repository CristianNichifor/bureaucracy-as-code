# UX/UI guidelines — Bureaucracy as Code

This is the app-level guideline. The fleet guideline in civic-ui
(`docs/ux-guidelines.md`) is the parent: where this file is silent, that one
applies; where they differ, fix this file. It refines, and does not replace,
[civic-ui-alignment.md](civic-ui-alignment.md), [qa.md](qa.md) and the
[production-readiness spec](specs/production-readiness.md).

Product language is Romanian first (`ro`), English second (`en`). This document
is in English, like the rest of `docs/`.

## 1. Users and top tasks

| User | Top task |
| --- | --- |
| Citizen or journalist | See what happens to a Law 544/2001 request, step by step, and when the institution must answer |
| Civil servant, reviewer | Check that each step is signed, dated and verifiable without trusting the server |
| Presenter (`?presenter=1`) | Run the guided scenario and the release checks in front of an audience |

**The one job of the first screen:** start the request. One primary button
("Începe cererea" / "Start the request"), the Law 544 deadlines (10 days, 30
with notice) next to it, nothing else competing (BAC-12).

## 2. Page anatomy

In order, top to bottom:

1. Family bar — link back to the Digital Public Administration Lab hub and the
   app name as registered in civic-ui.
2. H1 (`Birocrație ca Software` / `Bureaucracy as Code`) and one-line purpose.
3. Provenance line: `Date: demo sintetice, generate în browser` /
   `Data: synthetic demo, generated in the browser`. This app has no live
   data; the line must say so.
4. Primary task: the request (act 1), then machinery (act 2), then proof
   (act 3) — the three-act layout in BAC-14.
5. Secondary views: public explorer (`#explorer`), tools menu (export, import,
   reset), presenter panels only behind `?presenter=1`.
6. Footer: method (link to `docs/architecture.md` / the Law 544 caveat),
   privacy notice (`#privacy`), source (GitHub), contact (issues), build
   metadata.

## 3. Content rules

- Romanian uses comma-below `ș ț` (never cedilla `ş ţ`); every string in
  `src/i18n.ts` and `src/demo/demoText.ts` has both languages (BAC-1, BAC-11,
  BAC-13).
- Dates through `src/locale.ts` only: `ro-RO` `14 octombrie 2026, 09:30`; `en`
  day-month-year, never US numeric (BAC-10). Times are 24 h.
- Deadlines in days, with the unit written out: `10 zile`, `30 de zile`.
- Numbers: `ro-RO` grouping (`1.234`), `en` (`1,234`). Counts in copy use the
  plural form of the language, not `(s)`.
- Abbreviations: `Legea 544/2001` on first use, `L544` never in public copy.
- Tone: plain, second person, short sentences; explain the law, do not give
  legal advice (see [law-544-legal-caveat.md](law-544-legal-caveat.md)).
- Banned in public copy (allowed in presenter mode and docs): `ledger`
  without explanation, `nonce`, `P0`, `seed`, `fixture`, `D1`, `KV`,
  `Hardhat`, `adapter`, internal ticket IDs. Prefer `jurnal verificabil`,
  `amprentă (hash)`, `date demo`.

## 4. Data-visualisation rules

The machinery graph is the only chart-like view.

- Colours from the civic-ui viz palette via `src/civic-ui-adapter.css`
  tokens; no hard-coded hex in new CSS.
- Status is never colour-only: every node and trail entry carries a text
  label or icon plus text.
- Labels on the nodes, no legend-only meaning; no dual axes.
- A text alternative exists: the request trail list is the table equivalent
  of the graph and stays reachable by keyboard.
- Every view that shows data carries the provenance line from §2 and the
  demo badge from §7.

## 5. States

| State | Rule |
| --- | --- |
| Loading | Identities and the empty chain are created in the browser. If it takes > 2 s, show staged progress (identities → credentials → chain) instead of one sentence |
| Empty | Explorer filters with no match say so ("Nicio cerere găsită") and should offer a one-click way to clear the filters (UXG-9) |
| Error | Import, verification and export failures use `role="status"`/`alert` text with a retry or reset action; never only a red border |
| Demo data | Always on: the app runs on synthetic data only, so the demo badge never disappears |
| Tampered | The tamper demo shows a failed verification in words ("Verificarea a eșuat"), not only an icon |

## 6. Mobile, touch and accessibility

- Works at 390 px (and the 320 px floor in `ui:verify`): no horizontal body
  scroll, no clipped button text, no overlapping graph labels.
- Touch targets ≥ 24 px, 44 px preferred for primary and toggle buttons.
- WCAG 2.1 AA; axe reports 0 serious or critical violations in both
  languages, both themes, after the guided run and on mobile.
- Keyboard: skip link to the explorer, visible focus (`--civic-focus`), the
  tools menu and toggles are native `details`/`button`.
- `prefers-reduced-motion: reduce` disables the auto-run animation delay
  effects and transitions.
- `forced-colors: active` keeps borders, focus and status visible.

## 7. Status vocabulary

| RO | EN | Use here |
| --- | --- | --- |
| Date live | Live data | Not used: there is no live data |
| Date demo | Demo data | Always shown — every request is synthetic |
| Prototip | Prototype | The app's status on the hub |
| Arhivat | Archived | Not used |

## 8. Conformance checklist

| Rule | Test |
| --- | --- |
| One primary action and the Law 544 terms on the first screen | `tests/e2e/ux.pw.ts` "leads the first screen…" |
| No English, and Romanian dates, in Romanian mode | `tests/e2e/ux.pw.ts` "shows no English…"; `src/i18n.test.ts` |
| No US numeric dates in English | `tests/e2e/ux.pw.ts` "writes English dates…"; `src/locale.test.ts` |
| Romanian demo data parity, comma-below diacritics | `src/demo/demoText.test.ts` |
| Language persists and sets `html[lang]` | `src/language.test.ts`; `tests/e2e/demo.pw.ts` |
| Presenter content hidden by default | `tests/e2e/ux.pw.ts` "keeps release operations behind ?presenter=1" |
| axe clean: both themes, Romanian, after the run, mobile | `tests/e2e/accessibility.pw.ts` (`pnpm a11y:verify`) |
| No overflow 320–1728 px | `tests/e2e/demo.pw.ts` `@ui` (`pnpm ui:verify`) |
| Privacy notice reachable | `tests/e2e/privacy.pw.ts` |
| Family bar, provenance line, demo badge, reduced motion, forced colours | none yet — see backlog |

## 9. Known deviations backlog

From the live UX review (2026-10-14) and a code audit of `dev` at `d09eb7c`.
Not fixed here because the three-act layout (BAC-14) is changing `src/App.tsx`
and `src/styles.css`.

| ID | Deviation | Where |
| --- | --- | --- |
| UXG-1 | No family bar or visible link back to the hub; the hub link exists only in the presenter-only release panel | `src/App.tsx` header, `ReleaseReadiness.tsx` |
| UXG-2 | No `Date: …` provenance line and no persistent "Date demo" badge | `src/App.tsx` hero |
| UXG-3 | Footer has build metadata and privacy only; no method, source or contact links | `src/App.tsx` footer |
| UXG-4 | No `prefers-reduced-motion` or `forced-colors` rules | `src/styles.css` |
| UXG-5 | Loading state is a single sentence, no staged progress | `src/App.tsx` loading branch |
| UXG-6 | Name drift: hub catalogue vs app H1 (`Birocrație ca Software`); align to the civic-ui name registry | `src/i18n.ts`, hub catalogue |
| UXG-7 | Public copy still uses `ledger`/hash jargon without a plain-language gloss in places | `src/i18n.ts` |
| UXG-8 | Layout CSS mostly host-owned; adopt civic-ui SiteShell/SiteFooter/StatusMessage when the package is adopted (BAC-6) | `src/styles.css` |
| UXG-9 | Empty explorer state has no clear-filters action | `RequestFeed`/explorer |
