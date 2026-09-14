import { chromium } from "@playwright/test";
import { rm, mkdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { spawn } from "node:child_process";

const outputDir = path.resolve("artifacts/demo-captures");
const baseUrl = process.env.CAPTURE_BASE_URL ?? "http://127.0.0.1:4173/bureaucracy-as-code/";
const shouldStartServer = process.env.CAPTURE_START_SERVER !== "0";
const viteBin = path.resolve("node_modules/.bin/vite");

const fullScenarioSteps = [
  "Submit request",
  "Assign registry number",
  "Route to servant",
  "Start processing",
  "Attach evidence",
  "Resolve request",
];

async function waitForDemo(url, timeoutMs = 30_000) {
  const startedAt = Date.now();
  let lastError;

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url, { cache: "no-store" });
      if (response.ok) return;
    } catch (error) {
      lastError = error;
    }

    await new Promise((resolve) => setTimeout(resolve, 400));
  }

  throw new Error(`Timed out waiting for ${url}${lastError ? `: ${lastError.message}` : ""}`);
}

async function runFullScenario(page) {
  for (const label of fullScenarioSteps) {
    await page.getByRole("button", { name: new RegExp(label, "i") }).click();
  }
}

async function capture(page, filename) {
  const filePath = path.join(outputDir, filename);
  await page.screenshot({ path: filePath, fullPage: true });
  console.log(`captured ${path.relative(process.cwd(), filePath)}`);
}

async function openDemoPage(browser, viewport) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
  const page = await context.newPage();
  await page.goto(baseUrl);
  await page.getByRole("main").waitFor({ state: "visible" });
  return { context, page };
}

let server;

try {
  await rm(outputDir, { recursive: true, force: true });
  await mkdir(outputDir, { recursive: true });

  if (shouldStartServer) {
    server = spawn(viteBin, ["preview", "--host", "127.0.0.1"], {
      stdio: ["ignore", "pipe", "pipe"],
    });

    server.stdout.on("data", (chunk) => process.stdout.write(chunk));
    server.stderr.on("data", (chunk) => process.stderr.write(chunk));
  }

  await waitForDemo(baseUrl);

  const browser = await chromium.launch({
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
  });

  try {
    {
      const { context, page } = await openDemoPage(browser, { width: 1440, height: 960 });
      await capture(page, "01-public-explorer-desktop.png");
      await context.close();
    }

    {
      const { context, page } = await openDemoPage(browser, { width: 1440, height: 960 });
      await runFullScenario(page);
      await page.getByText("Request_Resolved").first().waitFor({ state: "visible" });
      await capture(page, "02-resolved-request-desktop.png");
      await context.close();
    }

    {
      const { context, page } = await openDemoPage(browser, { width: 1440, height: 960 });
      await page.getByRole("button", { name: /export proof report/i }).waitFor({ state: "visible" });
      await capture(page, "03-proof-report-ready-desktop.png");
      await context.close();
    }

    {
      const { context, page } = await openDemoPage(browser, { width: 390, height: 844 });
      await page.getByLabel("Language").getByRole("button", { name: "RO", exact: true }).click();
      await page.getByRole("heading", { name: "Birocratie ca Software", level: 1 }).waitFor({ state: "visible" });
      await capture(page, "04-romanian-mobile.png");
      await context.close();
    }

    {
      const { context, page } = await openDemoPage(browser, { width: 2560, height: 1080 });
      await page.getByRole("button", { name: /run full scenario/i }).click();
      await page.getByText("Request_Resolved").first().waitFor({ state: "visible" });
      await capture(page, "05-ultrawide-centered-layout.png");
      await context.close();
    }
  } finally {
    await browser.close();
  }
} finally {
  if (server && !server.killed) {
    server.kill("SIGTERM");
  }
}
