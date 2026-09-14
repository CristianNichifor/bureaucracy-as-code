import { CheckCircle2, ClipboardList, MapPinned, TerminalSquare } from "lucide-react";
import type { Dictionary } from "../i18n";
import type { Law544Status } from "../law544/types";

type PresenterChecklistProps = {
  labels: Dictionary["presenter"];
  status: Law544Status;
  eventsCount: number;
  selectedRequestId: string;
};

const cueOrder = ["explorer", "scenario", "machinery", "proofs", "localization"] as const;

type CueId = (typeof cueOrder)[number];

function getCurrentCue(status: Law544Status, eventsCount: number): CueId {
  if (eventsCount === 0 || status === "Draft") return "explorer";
  if (status === "Created" || status === "Registered") return "scenario";
  if (status === "Routed" || status === "InProgress") return "machinery";
  if (status === "Resolved" || status === "Rejected" || status === "Overdue") return "proofs";
  return "localization";
}

export function PresenterChecklist({ labels, status, eventsCount, selectedRequestId }: PresenterChecklistProps) {
  const currentCue = getCurrentCue(status, eventsCount);

  return (
    <section className="panel presenterPanel" aria-labelledby="presenter-checklist-title">
      <div className="panelHeader">
        <div>
          <p className="eyebrow">{labels.label}</p>
          <h2 id="presenter-checklist-title">{labels.title}</h2>
        </div>
        <span className="pill ok">
          <ClipboardList size={16} />
          5 min
        </span>
      </div>
      <p className="panelCopy">{labels.copy}</p>
      <div className="presenterMode" aria-label={labels.modeTitle}>
        <div className="presenterModeHeader">
          <span>
            <MapPinned size={16} />
            {labels.modeTitle}
          </span>
          <strong>{selectedRequestId}</strong>
        </div>
        <div className="presenterCueGrid">
          {cueOrder.map((cueId) => (
            <a
              aria-current={cueId === currentCue ? "step" : undefined}
              className={`presenterCue ${cueId === currentCue ? "presenterCue-current" : ""}`}
              href={labels.cues[cueId].href}
              key={cueId}
            >
              <span>{labels.cues[cueId].label}</span>
              <strong>{labels.cues[cueId].title}</strong>
              <small>{labels.cues[cueId].copy}</small>
            </a>
          ))}
        </div>
      </div>
      <ol className="presenterSteps">
        {labels.steps.map((step) => (
          <li key={step}>
            <CheckCircle2 size={17} />
            <span>{step}</span>
          </li>
        ))}
      </ol>
      <div className="presenterCommands" aria-label={labels.commandsTitle}>
        <span>
          <TerminalSquare size={16} />
          {labels.commandsTitle}
        </span>
        <code>{labels.releaseCommand}</code>
        <code>{labels.captureCommand}</code>
      </div>
    </section>
  );
}
