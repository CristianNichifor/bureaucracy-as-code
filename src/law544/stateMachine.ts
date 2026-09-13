import type { DemoIdentity } from "../identity/types";
import { findTransitionRule } from "./transitions";
import type { Law544Action, Law544Request } from "./types";

export function assertAllowedTransition(input: {
  request: Law544Request;
  action: Law544Action;
  actor: DemoIdentity;
  documentHash?: string;
}) {
  const rule = findTransitionRule({ action: input.action, from: input.request.status });

  if (!rule) {
    throw new Error(`Action ${input.action} is not allowed from ${input.request.status}.`);
  }

  if (!rule.allowedRoles.includes(input.actor.role)) {
    throw new Error(`${input.actor.role} cannot perform ${input.action}.`);
  }

  if (rule.requiresDocumentHash && !input.documentHash) {
    throw new Error(`${input.action} requires a document hash.`);
  }

  return rule;
}
