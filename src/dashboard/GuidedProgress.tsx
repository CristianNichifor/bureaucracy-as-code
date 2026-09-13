import type { ReactNode } from "react";
import { CheckCircle2, Circle, LockKeyhole, PlayCircle } from "lucide-react";
import type { Dictionary } from "../i18n";
import { browserGuidedScenarios, type GuidedScenarioId } from "../demo/guidedScenarios";
import type { Law544Status } from "../law544/types";
import { demoSteps, getCurrentStepIndex } from "./demoProgress";

export function GuidedProgress({
  status,
  eventsCount,
  onRunStep,
  onRunScenario,
  isRunningScenario,
  labels,
}: {
  status: Law544Status;
  eventsCount: number;
  onRunStep: (stepId: (typeof demoSteps)[number]["id"]) => void;
  onRunScenario: (scenarioId: GuidedScenarioId) => void;
  isRunningScenario: boolean;
  labels: Dictionary["guided"];
}) {
  const currentStepIndex = getCurrentStepIndex(status, eventsCount);

  return (
    <section className="panel guidedPanel">
      <div className="panelHeader">
        <h2>{labels.title}</h2>
        <span className="pill">{status === "Resolved" ? labels.complete : labels.nextStep}</span>
      </div>
      <div className="scenarioRunBar" aria-label={labels.scenariosLabel}>
        {browserGuidedScenarios.map((scenario) => (
          <button
            className="scenarioButton"
            disabled={isRunningScenario}
            key={scenario.id}
            onClick={() => onRunScenario(scenario.id)}
            title={scenario.description}
            type="button"
          >
            <PlayCircle size={16} />
            {labels.scenarios[scenario.id]}
          </button>
        ))}
      </div>
      <div className="stepList">
        {demoSteps.map((step, index) => {
          const stepLabels = labels.steps[step.id];
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
                <strong>{stepLabels.label}</strong>
                <small>
                  {stepLabels.actor} {labels.signs} {step.action}
                </small>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
