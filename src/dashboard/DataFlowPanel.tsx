import { Database, FileLock2, Fingerprint, Route } from "lucide-react";
import type { Dictionary } from "../i18n";

const icons = [Fingerprint, Database, Route, FileLock2] as const;

export function DataFlowPanel({ labels }: { labels: Dictionary["dataFlow"] }) {
  return (
    <section className="panel dataFlowPanel" aria-labelledby="data-flow-title">
      <div className="panelHeader">
        <div>
          <p className="eyebrow">{labels.label}</p>
          <h2 id="data-flow-title">{labels.title}</h2>
        </div>
      </div>
      <p className="panelCopy">{labels.copy}</p>
      <ol className="dataFlowSteps">
        {labels.steps.map((step, index) => {
          const Icon = icons[index] ?? Fingerprint;

          return (
            <li className="dataFlowStep" key={step.title}>
              <span className="dataFlowNumber">{String(index + 1).padStart(2, "0")}</span>
              <Icon aria-hidden="true" size={18} />
              <div>
                <strong>{step.title}</strong>
                <span>{step.actor}</span>
              </div>
              <dl>
                <div>
                  <dt>{labels.privateData}</dt>
                  <dd>{step.data}</dd>
                </div>
                <div>
                  <dt>{labels.publicData}</dt>
                  <dd>{step.proof}</dd>
                </div>
              </dl>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
