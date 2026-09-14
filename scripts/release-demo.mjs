import { mkdir, readdir, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import process from "node:process";

const outputDir = path.resolve("artifacts/demo-release");
const captureDir = path.resolve("artifacts/demo-captures");
const reportJsonPath = path.join(outputDir, "report.json");
const reportMarkdownPath = path.join(outputDir, "report.md");

const checks = [
  ["pnpm", ["verify"]],
  ["pnpm", ["demo:verify"]],
  ["pnpm", ["demo:capture"]],
];

function gitValue(args) {
  const result = spawnSync("git", args, { encoding: "utf8", shell: false });
  return result.status === 0 ? result.stdout.trim() : null;
}

async function listCaptures() {
  try {
    return (await readdir(captureDir))
      .filter((filename) => filename.endsWith(".png"))
      .sort();
  } catch {
    return [];
  }
}

async function writeReports(report) {
  await mkdir(outputDir, { recursive: true });
  await writeFile(reportJsonPath, `${JSON.stringify(report, null, 2)}\n`);

  const markdown = [
    "# Browser-only Demo Release Report",
    "",
    `- Status: ${report.status}`,
    `- Started: ${report.startedAt}`,
    `- Finished: ${report.finishedAt}`,
    `- Commit: ${report.git.commit ?? "unknown"}`,
    `- Branch: ${report.git.branch ?? "unknown"}`,
    "",
    "## Checks",
    "",
    ...report.checks.map(
      (check) =>
        `- ${check.status === "passed" ? "PASS" : "FAIL"} ${check.command} (${check.durationMs}ms)`,
    ),
    "",
    "## Capture Pack",
    "",
    ...(report.captures.length > 0
      ? report.captures.map((filename) => `- artifacts/demo-captures/${filename}`)
      : ["- No capture PNGs found."]),
    "",
    "## Acceptance",
    "",
    "- Static browser app builds successfully.",
    "- Unit, privacy, lint, and type checks pass.",
    "- Browser demo flow passes Playwright verification.",
    "- Standard screenshot capture pack is reproducible.",
    "- No external identity, ledger, storage, or Cloudflare data service is required.",
    "",
  ].join("\n");

  await writeFile(reportMarkdownPath, markdown);
}

const report = {
  schema: "bureaucracy-as-code-demo-release/v1",
  status: "passed",
  startedAt: new Date().toISOString(),
  finishedAt: null,
  git: {
    commit: gitValue(["rev-parse", "HEAD"]),
    branch: gitValue(["branch", "--show-current"]),
  },
  checks: [],
  captures: [],
};

for (const [command, args] of checks) {
  const label = [command, ...args].join(" ");
  const startedAt = new Date().toISOString();
  const start = Date.now();

  console.log(`\n> ${label}`);
  const result = spawnSync(command, args, { stdio: "inherit", shell: false });
  const finishedAt = new Date().toISOString();
  const status = result.status === 0 ? "passed" : "failed";

  report.checks.push({
    command: label,
    status,
    exitCode: result.status,
    startedAt,
    finishedAt,
    durationMs: Date.now() - start,
  });

  if (status === "failed") {
    report.status = "failed";
    break;
  }
}

report.finishedAt = new Date().toISOString();
report.captures = await listCaptures();
await writeReports(report);

console.log(`\nwrote ${path.relative(process.cwd(), reportMarkdownPath)}`);
console.log(`wrote ${path.relative(process.cwd(), reportJsonPath)}`);

if (report.status !== "passed") {
  process.exit(1);
}
