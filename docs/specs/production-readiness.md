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

## Needs human (out of scope here)

- BAC-7 hub CSP parity — lives in the hub repository.
- Legal review of Law 544/2001 workflow wording and the DPIA decision.
- BAC-6 civic-ui package adoption — later wave.
