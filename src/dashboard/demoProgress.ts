import type { Law544Action, Law544Status } from "../law544/types";

export type DemoStep = {
  id: "create" | "register" | "route" | "start" | "attach" | "resolve";
  label: string;
  action: Law544Action;
  fromStatus: Law544Status;
  toStatus: Law544Status;
  actor: string;
};

export const demoSteps: DemoStep[] = [
  {
    id: "create",
    label: "Submit request",
    action: "Request_Created",
    fromStatus: "Draft",
    toStatus: "Created",
    actor: "Citizen",
  },
  {
    id: "register",
    label: "Assign registry number",
    action: "Registry_Assigned",
    fromStatus: "Created",
    toStatus: "Registered",
    actor: "Registry bot",
  },
  {
    id: "route",
    label: "Route to servant",
    action: "Task_Routed",
    fromStatus: "Registered",
    toStatus: "Routed",
    actor: "Director",
  },
  {
    id: "start",
    label: "Start processing",
    action: "Processing_Started",
    fromStatus: "Routed",
    toStatus: "InProgress",
    actor: "Public servant",
  },
  {
    id: "attach",
    label: "Attach evidence",
    action: "Document_Attached",
    fromStatus: "InProgress",
    toStatus: "InProgress",
    actor: "Public servant",
  },
  {
    id: "resolve",
    label: "Resolve request",
    action: "Request_Resolved",
    fromStatus: "InProgress",
    toStatus: "Resolved",
    actor: "Public servant",
  },
];

export function getCurrentStepIndex(status: Law544Status, eventsCount: number): number {
  if (status === "Draft") return 0;
  if (status === "Created") return 1;
  if (status === "Registered") return 2;
  if (status === "Routed") return 3;
  if (status === "InProgress") return eventsCount >= 5 ? 5 : 4;
  return demoSteps.length;
}

export function isStepAvailable(input: {
  step: DemoStep;
  status: Law544Status;
  eventsCount: number;
}): boolean {
  return demoSteps[getCurrentStepIndex(input.status, input.eventsCount)]?.id === input.step.id;
}
