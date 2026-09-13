import type { Law544Action, Law544Status } from "../law544/types";
import type { DemoContext } from "./scenarioLaw544";

export type DemoActorKey = keyof DemoContext["identities"];

export type GuidedScenarioId = "happy-path" | "extension" | "overdue" | "rejected";

export type GuidedScenarioStep = {
  id: string;
  action: Law544Action;
  fromStatus: Law544Status;
  toStatus: Law544Status;
  actor: DemoActorKey;
  metadata?: "registry-number" | "routing-assignment" | "extension-reason" | "overdue-check";
  document?: {
    name: string;
    type: string;
  };
};

export type GuidedScenario = {
  id: GuidedScenarioId;
  label: string;
  description: string;
  finalStatus: Law544Status;
  steps: GuidedScenarioStep[];
};

const createRegisteredRoutedStartedSteps: GuidedScenarioStep[] = [
  {
    id: "create",
    action: "Request_Created",
    fromStatus: "Draft",
    toStatus: "Created",
    actor: "citizen",
  },
  {
    id: "register",
    action: "Registry_Assigned",
    fromStatus: "Created",
    toStatus: "Registered",
    actor: "registryBot",
    metadata: "registry-number",
  },
  {
    id: "route",
    action: "Task_Routed",
    fromStatus: "Registered",
    toStatus: "Routed",
    actor: "director",
    metadata: "routing-assignment",
  },
  {
    id: "start",
    action: "Processing_Started",
    fromStatus: "Routed",
    toStatus: "InProgress",
    actor: "publicServant",
  },
];

export const browserGuidedScenarios: GuidedScenario[] = [
  {
    id: "happy-path",
    label: "Happy path",
    description: "Submit, register, route, attach evidence, and resolve with a signed response.",
    finalStatus: "Resolved",
    steps: [
      ...createRegisteredRoutedStartedSteps,
      {
        id: "attach",
        action: "Document_Attached",
        fromStatus: "InProgress",
        toStatus: "InProgress",
        actor: "publicServant",
        document: { name: "internal-evidence-note.pdf", type: "application/pdf" },
      },
      {
        id: "resolve",
        action: "Request_Resolved",
        fromStatus: "InProgress",
        toStatus: "Resolved",
        actor: "publicServant",
        document: { name: "final-response.pdf", type: "application/pdf" },
      },
    ],
  },
  {
    id: "extension",
    label: "Extension",
    description: "Request an allowed extension, then resolve from the extended state.",
    finalStatus: "Resolved",
    steps: [
      ...createRegisteredRoutedStartedSteps,
      {
        id: "extension",
        action: "Extension_Requested",
        fromStatus: "InProgress",
        toStatus: "ExtensionRequested",
        actor: "publicServant",
        metadata: "extension-reason",
      },
      {
        id: "resolve-after-extension",
        action: "Request_Resolved",
        fromStatus: "ExtensionRequested",
        toStatus: "Resolved",
        actor: "publicServant",
        document: { name: "extended-final-response.pdf", type: "application/pdf" },
      },
    ],
  },
  {
    id: "overdue",
    label: "Overdue",
    description: "Run the normal intake path, then mark the file overdue with a registry check.",
    finalStatus: "Overdue",
    steps: [
      ...createRegisteredRoutedStartedSteps,
      {
        id: "mark-overdue",
        action: "Request_Marked_Overdue",
        fromStatus: "InProgress",
        toStatus: "Overdue",
        actor: "registryBot",
        metadata: "overdue-check",
      },
    ],
  },
  {
    id: "rejected",
    label: "Rejected",
    description: "Run intake and processing, then close with a signed refusal document.",
    finalStatus: "Rejected",
    steps: [
      ...createRegisteredRoutedStartedSteps,
      {
        id: "reject",
        action: "Request_Rejected",
        fromStatus: "InProgress",
        toStatus: "Rejected",
        actor: "publicServant",
        document: { name: "refusal-response.pdf", type: "application/pdf" },
      },
    ],
  },
];

export function getBrowserGuidedScenario(id: GuidedScenarioId): GuidedScenario {
  const scenario = browserGuidedScenarios.find((candidate) => candidate.id === id);
  if (!scenario) {
    throw new Error(`Unknown guided scenario: ${id}`);
  }

  return scenario;
}
