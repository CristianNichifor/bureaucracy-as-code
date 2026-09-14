import type { ReactNode } from "react";
import { CheckCircle2, Circle, LockKeyhole, PauseCircle, PlayCircle, SkipForward } from "lucide-react";
import type { Dictionary } from "../i18n";
import { browserGuidedScenarios, type GuidedScenarioId } from "../demo/guidedScenarios";
import type { Law544Status } from "../law544/types";
import type { LedgerEvent } from "../ledger/types";
import { demoSteps, getCurrentStepIndex } from "./demoProgress";
import { formatLaw544Status } from "./requestExplorer";

export function GuidedProgress({
  status,
  eventsCount,
  lastEvent,
  isAutoRunning,
  onRunStep,
  onRunScenario,
  onRunNext,
  onAutoRun,
  onPause,
  isRunningScenario,
  labels,
}: {
  status: Law544Status;
  eventsCount: number;
  lastEvent?: LedgerEvent;
  isAutoRunning: boolean;
  onRunStep: (stepId: (typeof demoSteps)[number]["id"]) => void;
  onRunScenario: (scenarioId: GuidedScenarioId) => void;
  onRunNext: () => void;
  onAutoRun: () => void;
  onPause: () => void;
  isRunningScenario: boolean;
  labels: Dictionary["guided"];
}) {
  const currentStepIndex = getCurrentStepIndex(status, eventsCount);
  const nextStep = demoSteps[currentStepIndex];
  const complete = !nextStep;
  const controlsDisabled = isRunningScenario || complete;

  return (
    <section className="panel guidedPanel">
      <div className="panelHeader">
        <h2>{labels.title}</h2>
        <span className="pill">{complete ? labels.complete : labels.nextStep}</span>
      </div>
      <div className="timelineControls" aria-label={labels.controlsLabel}>
        <button
          className="civicButton"
          disabled={controlsDisabled || isAutoRunning}
          onClick={onRunNext}
          type="button"
        >
          <SkipForward size={16} />
          {labels.stepNext}
        </button>
        <button
          className="civicButton"
          disabled={controlsDisabled || isAutoRunning}
          onClick={onAutoRun}
          type="button"
        >
          <PlayCircle size={16} />
          {labels.autoRun}
        </button>
        <button
          className="civicButton civicButtonSecondary"
          disabled={!isAutoRunning}
          onClick={onPause}
          type="button"
        >
          <PauseCircle size={16} />
          {labels.pause}
        </button>
      </div>
      <div className="lastRecorded" aria-live="polite">
        <span>{labels.recordedLabel}</span>
        {lastEvent ? (
          <strong>
            {lastEvent.action} · {lastEvent.signerRole} · {lastEvent.stateHash.slice(0, 18)}
          </strong>
        ) : (
          <strong>{labels.noRecordedEvent}</strong>
        )}
      </div>
      <div className="scenarioDeck" aria-label={labels.scenariosLabel}>
        {browserGuidedScenarios.map((scenario) => (
          <article className="scenarioCard" key={scenario.id}>
            <div className="scenarioCardHeader">
              <strong>{labels.scenarios[scenario.id]}</strong>
              <span className={`status status-${scenario.finalStatus.toLowerCase()}`}>
                {formatLaw544Status(scenario.finalStatus)}
              </span>
            </div>
            <p>{labels.scenarioSummaries[scenario.id]}</p>
            <dl className="scenarioFacts">
              <div>
                <dt>{labels.scenarioOutcome}</dt>
                <dd>{formatLaw544Status(scenario.finalStatus)}</dd>
              </div>
              <div>
                <dt>{labels.scenarioEvents}</dt>
                <dd>{scenario.steps.length}</dd>
              </div>
            </dl>
            <small>{labels.scenarioProofs[scenario.id]}</small>
            <button
              aria-busy={isRunningScenario}
              className="civicButton scenarioButton"
              disabled={isRunningScenario || isAutoRunning}
              onClick={() => onRunScenario(scenario.id)}
              title={scenario.description}
              type="button"
            >
              <PlayCircle size={16} />
              {labels.scenarios[scenario.id]}
            </button>
          </article>
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
              aria-current={current ? "step" : undefined}
              className={`stepCard ${complete ? "complete" : ""} ${current ? "current" : ""}`}
              disabled={!current}
              key={step.id}
              onClick={() => onRunStep(step.id)}
              type="button"
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
