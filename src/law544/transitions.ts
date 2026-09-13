import type { Law544Action, Law544Status, TransitionRule } from "./types";

export const transitionRules: TransitionRule[] = [
  { action: "Request_Created", from: "Draft", to: "Created", allowedRoles: ["Citizen"] },
  { action: "Registry_Assigned", from: "Created", to: "Registered", allowedRoles: ["RegistryBot"] },
  { action: "Task_Routed", from: "Registered", to: "Routed", allowedRoles: ["Director"] },
  { action: "Processing_Started", from: "Routed", to: "InProgress", allowedRoles: ["PublicServant"] },
  { action: "Extension_Requested", from: "InProgress", to: "ExtensionRequested", allowedRoles: ["PublicServant"] },
  { action: "Document_Attached", from: "InProgress", to: "InProgress", allowedRoles: ["PublicServant"], requiresDocumentHash: true },
  { action: "Request_Resolved", from: "InProgress", to: "Resolved", allowedRoles: ["PublicServant"], requiresDocumentHash: true },
  { action: "Request_Resolved", from: "ExtensionRequested", to: "Resolved", allowedRoles: ["PublicServant"], requiresDocumentHash: true },
  { action: "Request_Rejected", from: "InProgress", to: "Rejected", allowedRoles: ["PublicServant"], requiresDocumentHash: true },
  { action: "Request_Marked_Overdue", from: "InProgress", to: "Overdue", allowedRoles: ["RegistryBot"] },
];

export function findTransitionRule(input: {
  action: Law544Action;
  from: Law544Status;
}) {
  return transitionRules.find((rule) => rule.action === input.action && rule.from === input.from);
}
