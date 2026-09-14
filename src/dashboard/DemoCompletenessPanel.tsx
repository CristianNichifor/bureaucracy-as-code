import { CheckCircle2, GaugeCircle } from "lucide-react";
import type { Dictionary } from "../i18n";

export function DemoCompletenessPanel({ labels }: { labels: Dictionary["demoCompleteness"] }) {
  return (
    <section className="panel demoCompletenessPanel" aria-labelledby="demo-completeness-title">
      <div className="panelHeader">
        <div>
          <p className="eyebrow">{labels.label}</p>
          <h2 id="demo-completeness-title">{labels.title}</h2>
        </div>
        <span className="pill ok">
          <GaugeCircle size={16} />
          {labels.status}
        </span>
      </div>
      <p className="panelCopy">{labels.copy}</p>
      <div className="demoCompletenessGrid">
        {labels.criteria.map((criterion) => (
          <article key={criterion.title}>
            <CheckCircle2 size={18} />
            <span>{criterion.category}</span>
            <strong>{criterion.title}</strong>
            <small>{criterion.copy}</small>
          </article>
        ))}
      </div>
    </section>
  );
}
