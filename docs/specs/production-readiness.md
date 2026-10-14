# Production-readiness spec

Status legend: `todo` · `done` · `blocked` · `needs-human`.

Verify gate: `pnpm verify`, `pnpm verify:e2e`, `pnpm a11y:verify`, `pnpm ui:verify`.

## Theme A — Language

### BAC-2 Persist the chosen language — `done`

- Given a first visit with `navigator.language` starting with `ro`
  When the app loads
  Then the dashboard renders in Romanian and `<html lang="ro">`.
- Given any other `navigator.language`
  When the app loads with nothing saved
  Then the dashboard renders in English and `<html lang="en">`.
- Given the reader picks a language
  When the page reloads
  Then the same language is shown and `<html lang>` matches it.
- Given `localStorage` throws (private mode, blocked storage)
  When the app loads or the language changes
  Then the app still renders and switches language.

Tests: `src/language.test.ts` (initial-language resolution, guarded storage);
`tests/e2e/demo.pw.ts` "switches the public dashboard between English and
Romanian" (reload + `html[lang]`) and "with a Romanian browser › defaults to
Romanian on the first visit". Playwright pins `locale: "en-US"` so the host
locale cannot change the default.

### BAC-1 Romanian diacritics — `done` (wording: needs human review)

- Given the Romanian dictionary in `src/i18n.ts`
  When it is scanned
  Then it contains no cedilla characters (ş Ş ţ Ţ), none of the denylisted
  ASCII-only spellings (for example "tranzitie", "semnata", "si", "in"),
  and has exactly the same key structure as the English dictionary.

Tests: `src/i18n.test.ts`.

Translations rewritten here, in particular legal terms (Law 544/2001 vocabulary:
"prelungire", "divulgare parțială" (the law says "comunicare parțială"?), "redirecționare", "refuz"), are
**needs human review** by a Romanian public-law reader.

## Theme B — Accessibility

### BAC-3 Colour contrast checked by axe — `done`

- Given the landing state (desktop and mobile), the Romanian landing state and
  the full guided scenario, in both light and dark theme
  When axe runs with every rule enabled (including `color-contrast`)
  Then there are no violations.

Tests: `tests/e2e/accessibility.pw.ts` (`@a11y`), `pnpm a11y:verify`.

## Theme C — Trust

### BAC-4 Social sharing metadata — `done`

- Given the built `index.html`
  When it is served
  Then it carries `og:image` (absolute URL to `og.png`, 1200x630), `og:url`
  `https://projects.cristian-nichifor.com/bureaucracy-as-code/`, `og:type`
  `website`, `og:image:width/height/alt` and `twitter:card`
  `summary_large_image`, and `og.png` is served as a 1200x630 PNG
  (regenerate with `node scripts/render-og-image.mjs`).

Tests: `tests/e2e/meta.pw.ts`.

### BAC-5 In-app bilingual privacy notice — `done` (Romanian text: needs human review)

- Given any page state
  When the reader follows the footer "Privacy" link (or opens `#privacy`)
  Then a privacy notice dialog opens stating: the demo runs in the browser only,
  demo state lives in this browser's `localStorage` and IndexedDB, there are
  no cookies, analytics or trackers, hosting is Cloudflare Pages, the operator
  is Cristian Nichifor and contact is the repository's GitHub issues.
- Given Romanian is selected
  Then the notice is shown in Romanian.

Tests: `tests/e2e/privacy.pw.ts`. The Romanian notice text is
**needs human review**.

### BAC-8 Owners and dates for open readiness items — `done` (owners and dates: needs human confirmation)

- Given `docs/production-readiness.md`
  When a reader looks for an open legal, identity or DPIA item
  Then each one names an owner and a target or review date (docs only).

Test: review only (documentation). See the "Open Items: Owner And Review Date"
table in `docs/production-readiness.md`.

## Theme D — UX review follow-up

### BAC-9 Law 544/2001 deadlines — `done`

Law 544/2001 art. 7(1): the answer is due "în termen de 10 zile sau, după caz,
în cel mult 30 de zile de la înregistrarea solicitării"; the longer term needs
written notice to the applicant within the first 10 days. Art. 7(2): a refusal
is reasoned and communicated within 5 days. (Checked against the consolidated
text on legislatie.just.ro, 2026-10-14.)

- Given a new request created at T
  When its deadline is computed
  Then it is T + 10 days.
- Given a request in progress
  When the public servant signs `Extension_Requested`
  Then its deadline becomes T + 30 days and the signed metadata carries that
  extended deadline.
- Given the seeded public requests
  When they are checked
  Then each deadline is creation + 10 days (creation + 30 days when extended),
  every extension is signed within the first 10 days, and every refusal within
  5 days.

Tests: `src/law544/deadlines.test.ts`, `src/demo/DemoRuntime.test.ts`,
`src/demo/seededRequests.test.ts`.

### BAC-10 Dates follow the chosen language — `done`

- Given Romanian is selected
  When a deadline or timestamp is shown
  Then it uses dd.mm.yyyy whatever the browser locale is.
- Given English is selected
  Then dates read "14 Oct 2026" (day, short month, year), which no reader can
  confuse with a US or EU numeric date.

Tests: `src/locale.test.ts`; `tests/e2e/ux.pw.ts` (an `en-US` browser in RO
shows dd.mm.yyyy).

### BAC-11 No English left in Romanian mode — `done` (new Romanian labels: needs human review)

- Given Romanian is selected and the full scenario has run
  When the visible page text is read
  Then it contains no request statuses, roles or event codes in English
  ("Resolved", "PublicServant", "Registry_Assigned", …), no "Replayed …",
  "No transfer action yet" or "Skip to public request explorer".
- Given any language
  When the latest event is shown
  Then it reads as a sentence ("Registry number assigned by the registry"),
  not as `Registry_Assigned · RegistryBot · <hash>`. Raw codes stay only inside
  the expandable technical proof.

Tests: `src/locale.test.ts` (every status, role and action has a label in
both languages); `tests/e2e/ux.pw.ts`.

Seeded institution names and request subjects are covered by BAC-13.

### BAC-12 A first screen with one primary action — `done`

- Given a first visit
  When the page loads
  Then the top of the page shows a one-line Law 544 explainer (answer within
  10 days, 30 if extended) and a single primary button "Start the request".
- Given the reader opens "Tools"
  Then export state, export receipt, export report, import, reset and the
  transfer-safety summary are there, and not on the first screen.
- Given the URL has no `?presenter=1`
  Then the release operations section (completeness, presenter checklist,
  release readiness) is hidden; with `?presenter=1` it is shown.

Tests: `tests/e2e/ux.pw.ts`, updated `tests/e2e/demo.pw.ts`.

## Theme E — Demo flow

### BAC-13 Romanian demo data — `done` (Romanian names and subjects: needs human review)

- Given Romanian is selected
  When the explorer, request detail, machinery graph or operations panel show
  a seeded institution name or request subject
  Then they show the Romanian version ("Ministerul Finanțelor"); English mode
  keeps the English text.
- Given the stored request data
  Then it stays unchanged (English keys), so filters, identity checks,
  receipts and exported state keep working across languages.
- Given any institution or subject in the seeded and scripted demo data
  Then it has a non-empty Romanian version with comma-below ș and ț.

Tests: `src/demo/demoText.test.ts` (parity); `tests/e2e/ux.pw.ts` (no
English demo strings in Romanian mode).

### BAC-14 Three-act layout — `done` (new Romanian labels: needs human review)

- Given the main view
  Then the page reads as three sections in order: Request, Machinery, Proof,
  each a labelled landmark with a heading.
- Given the reader scrolls or steps through the scenario
  Then a sticky progress indicator shows "Step n/6" for the guided run and
  stays visible.
- Given the reader follows the "Explorer" link (`#explorer`)
  Then the public request explorer and the operations panel are shown in a
  second view, and the three acts are hidden; `#` or the "Demo" link returns.
- Given no `?presenter=1`
  Then presenter content stays hidden in both views.
- axe finds no violations in either view.

Tests: `tests/e2e/ux.pw.ts`, `tests/e2e/demo.pw.ts`,
`tests/e2e/accessibility.pw.ts`.

### BAC-15 UX/UI guideline — `done` (Romanian example strings: needs human review)

- Given `docs/ux-guidelines.md`
  Then it covers users and the first-screen job, page anatomy, content rules,
  data-viz rules, states, mobile and accessibility, status vocabulary, a
  conformance checklist mapped to tests, and a known-deviations backlog.
- Given a rule in the conformance checklist
  Then it names an existing test, or is listed as untested with a backlog ID.
- Given the fleet guideline in civic-ui `docs/ux-guidelines.md`
  Then this guideline refines it and does not contradict it.

Tests: documentation only; the mapped tests are `tests/e2e/ux.pw.ts`,
`tests/e2e/accessibility.pw.ts`, `tests/e2e/demo.pw.ts` (`@ui`),
`src/demo/demoText.test.ts`, `src/locale.test.ts`. Backlog UXG-1…UXG-9 is
untested and waits for BAC-14 to land.

## Theme F — Design screens (target state)

Static mockups in `docs/design/screens/`, indexed in `docs/design/README.md`.
Each item below is one screen; the acceptance criteria are what an
implementation session turns into tests. Romanian copy in the mockups was
written by an agent: needs human review.

### BAC-16 First screen, three acts — `done` (#119)

- Given the app loads in Romanian
  When the first screen renders at 1440 and 390 px
  Then, in order: family bar (hub link "Proiecte civice", tool name
  "Birocrație ca program", badge "Date demonstrative", language switch), one
  H1 "Birocrație ca program", one purpose line, the provenance line
  "Date: demo sintetice, generate în browser", then one primary button
  "Începe cererea" with the 10-day and 30-day terms beside it, then the act
  bar (Cererea · Mecanismul · Dovada) with "pasul n/6".
- Given the local registry takes more than 2 s to create
  Then the loading screen shows three staged lines (identități → credențiale
  → lanț) with a progress bar, not one sentence.
- Given local storage fails
  Then an alert names the failure in plain words and offers "Reîncearcă".
- Test: `tests/e2e/ux.pw.ts` (first-screen order, provenance line, family
  bar), `tests/e2e/demo.pw.ts` `@ui` (no overflow at 390).

### BAC-17 Request detail with proof — `done` (header words and symbol here; trail #123, verifier #122, tamper #126)

- Given a request is selected (seeded `REQ-2026-0002` or the live one)
  Then one header shows id, status badge with a symbol and a word, source
  badge, subject, institution, registry number, submitted date, legal deadline
  and deadline status in words ("Închisă", "3 zile rămase", "36 de zile
  întârziere").
- Given the machinery graph
  Then the handoff lane and the signed trail table are its text alternative,
  reachable by keyboard, with "Copiază" on each state hash.
- Given the response hash verifier
  Then it has three designed states: waiting, match (`role="status"`),
  mismatch (`role="alert"` with "Alege alt fișier").
- Given the tamper test runs
  Then the integrity panel reads "Verificarea a eșuat" with the reason and a
  way back to the verified state; never an icon alone. (Done: the panel shows a
  `role="alert"` result with the rejection reason, says the stored chain is
  unchanged, and offers "Înapoi la lanțul verificat"; the chain pill stays valid
  because the edited copy never enters the ledger.)
- Test: `tests/e2e/demo.pw.ts` (trail table, hash verifier states),
  `tests/e2e/accessibility.pw.ts`.

### BAC-18 Public explorer — `done` (tiles here; feed, filters, empty state #120; workload table #124)

- Given the explorer view
  Then it shows four count tiles (instituții, deschise, întârziate,
  finalizate), the filter toolbar (search, status, institution, sort,
  "Resetează filtrele"), a `role="status"` count line and the request table
  with status as symbol + word and the deadline as date + words.
- Given no request matches the filters
  Then the empty state names the active filters and offers one
  "Resetează filtrele" button (UXG-9).
- Given 390 px
  Then rows become cards with the same fields in the same order and no
  horizontal page scroll.
- Test: `tests/e2e/ux.pw.ts` (empty state + reset), `tests/e2e/demo.pw.ts`
  `@ui`.
- Tiles: `getExplorerCounts` feeds the four buttons in the design's order. Open counts the
  live draft, as the design's worked numbers do (7 with the draft); a draft is never
  overdue. Test: `src/dashboard/requestExplorer.test.ts`, `tests/e2e/operations.pw.ts`.

### BAC-19 Presenter mode — `done`

- Given `?presenter=1`
  Then the family bar adds the "Mod prezentare" badge, a `role="status"`
  banner says the panels are not public and links out of presenter mode, and
  the checklist, release readiness, operator commands and completeness table
  render before the three acts.
- Given no `?presenter=1`
  Then none of those panels or strings are in the DOM.
- Given `?presenter=1` and the exit link
  Then the page reloads without the query and the presenter panels are gone.
- Test: `tests/e2e/ux.pw.ts` "keeps release operations behind ?presenter=1".

### BAC-20 Reduced motion and forced colours — `done`

- Given `prefers-reduced-motion: reduce`
  Then no transition, animation or smooth scroll runs (the skip link appears
  without sliding).
- Given `forced-colors: active`
  Then the pressed language/theme toggle is marked by an outline, not only
  by its background, which forced colours drop.

Tests: `src/styles.test.ts`. Closes backlog UXG-4.

### BAC-21 Footer links back to the hub — `done` (Romanian labels: needs human review)

- Given the footer
  Then it links to the hub home in the visitor's language
  (`https://projects.cristian-nichifor.com/` or `/ro/`) and to the source
  repository, next to the privacy notice.

Tests: `src/dashboard/FamilyLinks.test.tsx`. Partly closes backlog UXG-1 and
UXG-3 (a full civic-ui family bar still waits for BAC-6).

## Needs human (out of scope here)

- BAC-7 hub CSP parity — lives in the hub repository.
- Legal review of Law 544/2001 workflow wording and the DPIA decision.
- BAC-6 civic-ui package adoption — later wave.
