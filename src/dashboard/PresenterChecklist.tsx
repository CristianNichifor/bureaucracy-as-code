import { CheckCircle2, ClipboardList, TerminalSquare } from "lucide-react";
import type { Dictionary } from "../i18n";

type PresenterChecklistProps = {
  labels: Dictionary["presenter"];
};

export function PresenterChecklist({ labels }: PresenterChecklistProps) {
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
