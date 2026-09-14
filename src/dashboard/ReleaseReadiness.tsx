import { CheckCircle2, ExternalLink, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import type { BuildInfo } from "../buildInfo";
import type { Dictionary } from "../i18n";

const STANDALONE_URL = "https://bureaucracy-as-code.pages.dev/";
const DIGITAL_URL = "https://digital.cristian-nichifor.com/bureaucracy-as-code";

export function ReleaseReadiness({
  buildInfo,
  labels,
}: {
  buildInfo: BuildInfo;
  labels: Dictionary["readiness"];
}) {
  return (
    <section className="panel readinessPanel" aria-labelledby="release-readiness-title">
      <div className="panelHeader">
        <h2 id="release-readiness-title">{labels.title}</h2>
        <span className="pill ok">
          <ShieldCheck size={14} />
          {labels.statusReady}
        </span>
      </div>

      <div className="readinessGrid">
        <ReadinessGroup title={labels.buildProof}>
          <ReadinessFact label={labels.commit} value={buildInfo.commitShortSha} title={buildInfo.commitSha} />
          <ReadinessFact label={labels.branch} value={buildInfo.branch} />
          <ReadinessFact label={labels.environment} value={buildInfo.environment} />
          <ReadinessFact label={labels.builtAt} value={formatBuiltAt(buildInfo.builtAt)} />
        </ReadinessGroup>

        <ReadinessGroup title={labels.deployTargets}>
          <ReadinessLink label={labels.standalone} href={STANDALONE_URL} />
          <ReadinessLink label={labels.digital} href={DIGITAL_URL} />
        </ReadinessGroup>

        <ReadinessGroup title={labels.privacyBoundary}>
          <ReadinessCheck label={labels.noRoeid} />
          <ReadinessCheck label={labels.noDurableCloudflare} />
          <ReadinessCheck label={labels.noPiiLedger} />
          <ReadinessCheck label={labels.localSigningKeys} />
        </ReadinessGroup>

        <ReadinessGroup title={labels.verification}>
          <ReadinessCheck label={labels.verify} />
          <ReadinessCheck label={labels.demoVerify} />
          <ReadinessCheck label={labels.e2e} />
          <ReadinessCheck label={labels.codeql} />
          <ReadinessCheck label={labels.gitleaks} />
          <ReadinessCheck label={labels.dependencyReview} />
        </ReadinessGroup>
      </div>
    </section>
  );
}

function ReadinessGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="readinessGroup" aria-label={title}>
      <h3>{title}</h3>
      <div>{children}</div>
    </section>
  );
}

function ReadinessFact({ label, value, title }: { label: string; value: string; title?: string }) {
  return (
    <div className="readinessFact">
      <span>{label}</span>
      <strong title={title}>{value}</strong>
    </div>
  );
}

function ReadinessCheck({ label }: { label: string }) {
  return (
    <div className="readinessCheck">
      <CheckCircle2 size={16} />
      <span>{label}</span>
    </div>
  );
}

function ReadinessLink({ label, href }: { label: string; href: string }) {
  return (
    <a className="readinessLink" href={href} rel="noreferrer" target="_blank">
      <span>{label}</span>
      <strong>{href.replace(/^https:\/\//, "")}</strong>
      <ExternalLink size={14} />
    </a>
  );
}

function formatBuiltAt(value: string): string {
  if (value === "local") return "local";

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}
