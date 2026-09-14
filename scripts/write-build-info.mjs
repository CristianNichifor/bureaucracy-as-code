import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";

function fromGit(args, fallback) {
  try {
    return execFileSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim() || fallback;
  } catch {
    return fallback;
  }
}

const commitSha = process.env.GITHUB_SHA ?? fromGit(["rev-parse", "HEAD"], "local");
const commitShortSha = commitSha === "local" ? "local" : commitSha.slice(0, 7);
const branch =
  process.env.GITHUB_HEAD_REF ??
  process.env.GITHUB_REF_NAME ??
  fromGit(["rev-parse", "--abbrev-ref", "HEAD"], "local");
const environment = process.env.CF_PAGES_BRANCH
  ? process.env.CF_PAGES_BRANCH === "main"
    ? "production"
    : "preview"
  : process.env.GITHUB_EVENT_NAME === "pull_request"
    ? "preview"
    : process.env.GITHUB_REF_NAME === "main"
      ? "production"
      : "local";

const buildInfo = {
  schema: "bureaucracy-as-code-build-info/v1",
  builtAt: new Date().toISOString(),
  commitSha,
  commitShortSha,
  branch,
  environment,
};

mkdirSync("public", { recursive: true });
writeFileSync("public/build-info.json", `${JSON.stringify(buildInfo, null, 2)}\n`);
console.log(`Wrote public/build-info.json for ${commitShortSha} (${environment}).`);
