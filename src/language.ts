import type { Language } from "./i18n";

export const LANGUAGE_STORAGE_KEY = "bac-language";

function isLanguage(value: unknown): value is Language {
  return value === "en" || value === "ro";
}

/** The saved choice wins; otherwise a Romanian browser (`ro`, `ro-*`) gets Romanian and everyone else English. */
export function resolveInitialLanguage(storage: Storage | undefined, navigatorLanguage: string | undefined): Language {
  try {
    const saved = storage?.getItem(LANGUAGE_STORAGE_KEY);
    if (isLanguage(saved)) return saved;
  } catch {
    // Storage can be blocked (private mode, site data off); fall through to the browser language.
  }

  return /^ro(-|$)/i.test(navigatorLanguage ?? "") ? "ro" : "en";
}

export function saveLanguage(storage: Storage | undefined, language: Language): void {
  try {
    storage?.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch {
    // Persisting is a convenience; the switch itself must still work.
  }
}

export function browserStorage(): Storage | undefined {
  try {
    return typeof window === "undefined" ? undefined : window.localStorage;
  } catch {
    return undefined;
  }
}
