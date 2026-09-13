import { spawnSync } from "node:child_process";

const checks = [
  ["pnpm", ["lint"]],
  ["pnpm", ["typecheck"]],
  ["pnpm", ["privacy:scan"]],
  ["pnpm", ["test"]],
  ["pnpm", ["build"]],
];

if (process.env.RUN_E2E === "1") {
  checks.push(["pnpm", ["e2e"]]);
}

for (const [command, args] of checks) {
  const label = [command, ...args].join(" ");
  console.log(`\n> ${label}`);
  const result = spawnSync(command, args, { stdio: "inherit", shell: false });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
