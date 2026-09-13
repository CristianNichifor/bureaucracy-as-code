import type { DemoRole } from "../identity/types";

export type Law544Status =
  | "Draft"
  | "Created"
  | "Registered"
  | "Routed"
  | "InProgress"
  | "ExtensionRequested"
  | "Resolved"
  | "Rejected"
  | "Overdue";

export type Law544Action =
  | "Request_Created"
  | "Registry_Assigned"
  | "Task_Routed"
  | "Processing_Started"
  | "Extension_Requested"
  | "Document_Attached"
  | "Request_Resolved"
  | "Request_Rejected"
  | "Request_Marked_Overdue";

export type Law544Request = {
  id: string;
  institution: string;
  subject: string;
  citizenDidHash: string;
  status: Law544Status;
  createdAt: string;
  deadlineAt: string;
  registryNumber?: string;
  assignedToDidHash?: string;
  responseDocumentHash?: string;
};

export type TransitionRule = {
  action: Law544Action;
  from: Law544Status;
  to: Law544Status;
  allowedRoles: DemoRole[];
  requiresDocumentHash?: boolean;
};
