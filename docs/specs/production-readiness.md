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

### BAC-9 Law 544/2001 deadlines — `todo`

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

### BAC-10 Dates follow the chosen language — `todo`

- Given Romanian is selected
  When a deadline or timestamp is shown
  Then it uses dd.mm.yyyy whatever the browser locale is.
- Given English is selected
  Then dates read "14 Oct 2026" (day, short month, year), which no reader can
  confuse with a US or EU numeric date.

Tests: `src/locale.test.ts`; `tests/e2e/ux.pw.ts` (an `en-US` browser in RO
shows dd.mm.yyyy).

### BAC-11 No English left in Romanian mode — `todo`

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

Seeded institution names and request subjects are demo data and stay in
English (needs human decision).

### BAC-12 A first screen with one primary action — `todo`

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

## Needs human (out of scope here)

- BAC-7 hub CSP parity — lives in the hub repository.
- Legal review of Law 544/2001 workflow wording and the DPIA decision.
- BAC-6 civic-ui package adoption — later wave.
