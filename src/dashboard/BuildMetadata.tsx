import { GitCommitHorizontal } from "lucide-react";
import type { Dictionary } from "../i18n";
import type { BuildInfo } from "../buildInfo";

export function BuildMetadata({ buildInfo, labels }: { buildInfo: BuildInfo; labels: Dictionary["build"] }) {
  return (
    <footer className="buildMetadata" aria-label={labels.title}>
      <GitCommitHorizontal size={18} />
      <span>{labels.title}</span>
      <strong title={buildInfo.commitSha}>{buildInfo.commitShortSha}</strong>
      <span>{labels.environment}</span>
      <strong>{buildInfo.environment}</strong>
      <span>{labels.builtAt}</span>
      <strong>{formatBuiltAt(buildInfo.builtAt, labels.local)}</strong>
    </footer>
  );
}

function formatBuiltAt(value: string, fallback: string): string {
  if (value === "local") return fallback;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? fallback : date.toLocaleString();
}
