import type { Language } from "../i18n";
import type { Law544Request, Law544Status } from "../law544/types";

export type DeadlineTone = "closed" | "danger" | "warning" | "ok" | "unset";

export type DeadlineSummary = { tone: DeadlineTone; days: number };

const DAY_MS = 24 * 60 * 60 * 1000;

/** Days until the legal deadline (negative when overdue) and the tone the UI shows it in. */
export function summarizeDeadline(request: Pick<Law544Request, "status" | "deadlineAt">, now = new Date()): DeadlineSummary {
  if (request.status === "Draft") return { tone: "unset", days: 0 };

  const days = Math.ceil((new Date(request.deadlineAt).getTime() - now.getTime()) / DAY_MS);
  if (request.status === "Resolved" || request.status === "Rejected") return { tone: "closed", days: Math.max(days, 0) };
  if (days < 0) return { tone: "danger", days: Math.abs(days) };
  if (days <= 7) return { tone: "warning", days };
  return { tone: "ok", days };
}

/** "1 zi", "3 zile", "36 de zile" / "1 day", "36 days". */
export function formatDays(days: number, language: Language): string {
  if (language === "ro") {
    if (days === 1) return "1 zi";
    return days >= 20 ? `${days} de zile` : `${days} zile`;
  }
  return days === 1 ? "1 day" : `${days} days`;
}

export type DeadlineLabels = { daysRemaining: string; daysOverdue: string; closed: string; deadlineUnset: string };

/** The words next to the deadline date: "3 zile rămase", "36 de zile întârziere", "închisă". */
export function describeDeadline(summary: DeadlineSummary, labels: DeadlineLabels, language: Language): string {
  if (summary.tone === "unset") return labels.deadlineUnset;
  if (summary.tone === "closed") return labels.closed;
  const template = summary.tone === "danger" ? labels.daysOverdue : labels.daysRemaining;
  return template.replace("{days}", formatDays(summary.days, language));
}

/** A symbol that pairs with the status word so colour is never the only signal. */
export const statusSymbols: Record<Law544Status, string> = {
  Draft: "○",
  Created: "○",
  Registered: "○",
  Routed: "○",
  InProgress: "●",
  ExtensionRequested: "◔",
  Resolved: "✓",
  Rejected: "✕",
  Overdue: "⚠",
};
