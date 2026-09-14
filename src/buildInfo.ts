export type BuildInfo = {
  schema: "bureaucracy-as-code-build-info/v1";
  builtAt: string;
  commitSha: string;
  commitShortSha: string;
  branch: string;
  environment: "local" | "preview" | "production" | string;
};

export const fallbackBuildInfo: BuildInfo = {
  schema: "bureaucracy-as-code-build-info/v1",
  builtAt: "local",
  commitSha: "local",
  commitShortSha: "local",
  branch: "local",
  environment: "local",
};

export async function loadBuildInfo(): Promise<BuildInfo> {
  try {
    const baseUri = typeof document === "undefined" ? "http://localhost/" : document.baseURI;
    const response = await fetch(new URL("build-info.json", baseUri), { cache: "no-store" });

    if (!response.ok) return fallbackBuildInfo;

    const value = await response.json();
    return parseBuildInfo(value);
  } catch {
    return fallbackBuildInfo;
  }
}

function parseBuildInfo(value: unknown): BuildInfo {
  if (!value || typeof value !== "object") return fallbackBuildInfo;

  const candidate = value as Partial<BuildInfo>;

  if (
    candidate.schema !== "bureaucracy-as-code-build-info/v1" ||
    typeof candidate.builtAt !== "string" ||
    typeof candidate.commitSha !== "string" ||
    typeof candidate.commitShortSha !== "string" ||
    typeof candidate.branch !== "string" ||
    typeof candidate.environment !== "string"
  ) {
    return fallbackBuildInfo;
  }

  return {
    schema: candidate.schema,
    builtAt: candidate.builtAt,
    commitSha: candidate.commitSha,
    commitShortSha: candidate.commitShortSha,
    branch: candidate.branch,
    environment: candidate.environment,
  };
}
