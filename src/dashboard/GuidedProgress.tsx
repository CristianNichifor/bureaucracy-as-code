import type { ReactNode } from "react";
import { CheckCircle2, Circle, LockKeyhole } from "lucide-react";
import type { Law544Status } from "../law544/types";
import { demoSteps, getCurrentStepIndex } from "./demoProgress";

export function GuidedProgress({
  status,
  eventsCount,
  onRunStep,
}: {
  status: Law544Status;
  eventsCount: number;
  onRunStep: (stepId: (typeof demoSteps)[number]["id"]) => void;
}) {
  const currentStepIndex = getCurrentStepIndex(status, eventsCount);

  return (
    <section className="panel guidedPanel">
      <div className="panelHeader">
        <h2>Guided Law 544 run</h2>
        <span className="pill">{status === "Resolved" ? "complete" : "next step"}</span>
      </div>
      <div className="stepList">
        {demoSteps.map((step, index) => {
          const complete = index < currentStepIndex;
          const current = index === currentStepIndex;
          const locked = index > currentStepIndex;
          const icon: ReactNode = complete ? (
            <CheckCircle2 size={18} />
          ) : locked ? (
            <LockKeyhole size={18} />
          ) : (
            <Circle size={18} />
          );

          return (
            <button
              className={`stepCard ${complete ? "complete" : ""} ${current ? "current" : ""}`}
              disabled={!current}
              key={step.id}
              onClick={() => onRunStep(step.id)}
            >
              <span className="stepIcon">{icon}</span>
              <span>
                <strong>{step.label}</strong>
                <small>
                  {step.actor} signs {step.action}
                </small>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
