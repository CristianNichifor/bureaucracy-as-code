import { createContext, useContext } from "react";
import type { DemoRole } from "./identity/types";
import type { Language } from "./i18n";
import type { Law544Action, Law544Status } from "./law544/types";

/** The active language for components that format domain values; App provides it. */
export const LanguageContext = createContext<Language>("en");

export function useLanguage(): Language {
  return useContext(LanguageContext);
}

export const statusLabels: Record<Language, Record<Law544Status | "All", string>> = {
  en: {
    All: "All",
    Draft: "Draft",
    Created: "Submitted",
    Registered: "Registered",
    Routed: "Routed",
    InProgress: "In progress",
    ExtensionRequested: "Extension requested",
    Resolved: "Resolved",
    Rejected: "Rejected",
    Overdue: "Overdue",
  },
  ro: {
    All: "Toate",
    Draft: "Ciornă",
    Created: "Depusă",
    Registered: "Înregistrată",
    Routed: "Repartizată",
    InProgress: "În lucru",
    ExtensionRequested: "Termen prelungit",
    Resolved: "Soluționată",
    Rejected: "Respinsă",
    Overdue: "Întârziată",
  },
};

export const roleLabels: Record<Language, Record<DemoRole | "All", string>> = {
  en: {
    All: "All",
    Citizen: "Citizen",
    RegistryBot: "Registry",
    Director: "Director",
    PublicServant: "Public servant",
  },
  ro: {
    All: "Toate",
    Citizen: "Cetățean",
    RegistryBot: "Registratură",
    Director: "Director",
    PublicServant: "Funcționar public",
  },
};

export const actionLabels: Record<Language, Record<Law544Action, string>> = {
  en: {
    Request_Created: "Request submitted",
    Registry_Assigned: "Registry number assigned",
    Task_Routed: "Routed to a public servant",
    Processing_Started: "Processing started",
    Extension_Requested: "Deadline extended to 30 days",
    Document_Attached: "Evidence attached",
    Request_Resolved: "Answer sent",
    Request_Rejected: "Request refused",
    Request_Marked_Overdue: "Marked as overdue",
  },
  ro: {
    Request_Created: "Cerere depusă",
    Registry_Assigned: "Număr de registru alocat",
    Task_Routed: "Repartizată unui funcționar public",
    Processing_Started: "Procesare începută",
    Extension_Requested: "Termen prelungit la 30 de zile",
    Document_Attached: "Dovadă atașată",
    Request_Resolved: "Răspuns comunicat",
    Request_Rejected: "Cerere respinsă",
    Request_Marked_Overdue: "Marcată ca întârziată",
  },
};

const signedBy: Record<Language, string> = { en: "signed by", ro: "semnat de" };

export function formatLaw544Status(status: Law544Status | "All", language: Language = "en"): string {
  return statusLabels[language][status] ?? status;
}

export function formatRole(role: DemoRole | "All" | string, language: Language = "en"): string {
  return roleLabels[language][role as DemoRole] ?? role;
}

export function formatAction(action: Law544Action | string, language: Language = "en"): string {
  return actionLabels[language][action as Law544Action] ?? action;
}

export function describeEvent(event: { action: string; signerRole: string }, language: Language): string {
  return `${formatAction(event.action, language)}, ${signedBy[language]} ${formatRole(event.signerRole, language)}`;
}

const dateFormats: Record<Language, Intl.DateTimeFormatOptions & { locale: string }> = {
  ro: { locale: "ro-RO", day: "2-digit", month: "2-digit", year: "numeric" },
  en: { locale: "en-GB", day: "numeric", month: "short", year: "numeric" },
};

function format(value: string, language: Language, withTime: boolean): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const { locale, ...options } = dateFormats[language];
  const day = new Intl.DateTimeFormat(locale, options).format(date);
  if (!withTime) return day;

  const time = new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit", hour12: false }).format(date);
  return `${day}, ${time}`;
}

/** Romanian: dd.mm.yyyy. English: "4 Oct 2026", which no reader mistakes for a numeric date. */
export function formatDate(value: string, language: Language): string {
  return format(value, language, false);
}

export function formatDateTime(value: string, language: Language): string {
  return format(value, language, true);
}
