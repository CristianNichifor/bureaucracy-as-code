// Renders public/og.png, the 1200x630 social preview. Run after changing the copy or the icon:
//   node scripts/render-og-image.mjs
import { chromium } from "@playwright/test";
import { readFile } from "node:fs/promises";
import path from "node:path";

const icon = await readFile(path.resolve("public/icon.svg"), "utf8");
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  body { margin: 0; width: 1200px; height: 630px; display: flex; align-items: center; gap: 64px;
    padding: 0 96px; box-sizing: border-box; background: #f6f7f3; color: #1d2528;
    font-family: "DejaVu Sans", "Liberation Sans", Arial, sans-serif; border-bottom: 16px solid #22496f; }
  .icon svg { width: 240px; height: 240px; }
  p { margin: 0; }
  .eyebrow { font-size: 26px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; color: #516157; }
  h1 { margin: 16px 0 24px; font-size: 76px; line-height: 1.05; }
  .lead { font-size: 32px; line-height: 1.35; color: #294337; max-width: 640px; }
</style></head><body>
  <div class="icon">${icon}</div>
  <div>
    <p class="eyebrow">Law 544/2001 · Legea 544/2001</p>
    <h1>Bureaucracy as Code</h1>
    <p class="lead">Signed, tamper-evident public request workflows, verified in the browser.</p>
  </div>
</body></html>`;

const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html);
await page.screenshot({ path: path.resolve("public/og.png") });
await browser.close();
