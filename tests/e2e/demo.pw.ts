import { expect, test } from "@playwright/test";

const fullScenarioSteps = [
  "Submit request",
  "Assign registry number",
  "Route to servant",
  "Start processing",
  "Attach evidence",
  "Resolve request",
];

const uiViewports = [
  { name: "narrow mobile", width: 320, height: 760 },
  { name: "standard mobile", width: 375, height: 812 },
  { name: "tablet", width: 768, height: 900 },
  { name: "laptop", width: 1024, height: 900 },
  { name: "desktop", width: 1440, height: 960 },
  { name: "wide desktop", width: 1728, height: 960 },
];

async function freezeBrowserClock(page: import("@playwright/test").Page, iso: string) {
  await page.addInitScript((fixedIso) => {
    const RealDate = Date;
    const fixedTime = new RealDate(fixedIso).getTime();

    class FrozenDate extends RealDate {
      constructor(...args: ConstructorParameters<DateConstructor>) {
        if (args.length === 0) {
          super(fixedTime);
          return;
        }

        super(...args);
      }

      static now() {
        return fixedTime;
      }
    }

    Object.setPrototypeOf(FrozenDate, RealDate);
    globalThis.Date = FrozenDate as DateConstructor;
  }, iso);
}

async function runFullLaw544Scenario(page: import("@playwright/test").Page) {
  for (const name of fullScenarioSteps) {
    await page.getByRole("button", { name: new RegExp(name, "i") }).click();
  }
}

test("loads the public demo with basic document landmarks", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("./");

  await expect(page.getByRole("main")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Bureaucracy as Code", level: 1 })).toBeVisible();
  await expect(page.getByText("Digital Public Administration Lab")).toBeVisible();
  const toolbar = page.getByRole("region", { name: "Demo actions" });
  await expect(toolbar.getByRole("button", { name: "Export state" })).toBeVisible();
  await expect(toolbar.getByRole("button", { name: "Export receipt" })).toBeVisible();
  await expect(toolbar.getByRole("button", { name: "Import" })).toBeVisible();
  await expect(toolbar.getByRole("button", { name: "Reset" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Guided Law 544 run" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Ledger integrity" })).toBeVisible();
  await expect(page.getByText("Ledger verifies")).toBeVisible();

  expect(pageErrors).toEqual([]);
});

test("keeps the browser demo usable on the configured viewport", async ({ page }, testInfo) => {
  await page.goto("./");

  await expect(page.getByRole("main")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Bureaucracy as Code", level: 1 })).toBeVisible();
  await expect(page.getByRole("region", { name: "Demo actions" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Public request explorer" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Bureaucratic machinery" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Response hash verifier" })).toBeVisible();
  await expect(page.getByText("Ledger verifies")).toBeVisible();

  await testInfo.attach(`browser-demo-${testInfo.project.name}.png`, {
    body: await page.screenshot({ fullPage: true }),
    contentType: "image/png",
  });
});

test("keeps Civic UI layout stable across target viewports @ui", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium", "Viewport matrix runs once from the desktop browser context.");

  for (const viewport of uiViewports) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("./");
    await page.getByRole("button", { name: /run full scenario/i }).click();

    await expect(page.getByRole("heading", { name: "Bureaucracy as Code", level: 1 })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Public request explorer" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Request detail" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Bureaucratic machinery" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Signed audit trail" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Response hash verifier" })).toBeVisible();
    await expect(page.getByText("Ledger verifies")).toBeVisible();

    const overflow = await page.evaluate(() => ({
      body: document.body.scrollWidth - window.innerWidth,
      root: document.documentElement.scrollWidth - window.innerWidth,
    }));
    expect(overflow.body, `${viewport.name} body horizontal overflow`).toBeLessThanOrEqual(1);
    expect(overflow.root, `${viewport.name} root horizontal overflow`).toBeLessThanOrEqual(1);

    const boxes = await page.locator(".panel, .feedRow, .graphNode, .caseGlance").evaluateAll((nodes) =>
      nodes.map((node) => {
        const rect = node.getBoundingClientRect();
        return {
          left: rect.left,
          right: rect.right,
          width: rect.width,
          viewport: window.innerWidth,
        };
      }),
    );

    for (const box of boxes) {
      expect(box.width, `${viewport.name} element collapsed`).toBeGreaterThan(0);
      expect(box.left, `${viewport.name} element leaks left`).toBeGreaterThanOrEqual(-1);
      expect(box.right, `${viewport.name} element leaks right`).toBeLessThanOrEqual(box.viewport + 1);
    }

    await testInfo.attach(`civic-ui-${viewport.width}.png`, {
      body: await page.screenshot({ fullPage: true }),
      contentType: "image/png",
    });
  }
});

test("switches the public dashboard between English and Romanian", async ({ page }) => {
  await page.goto("./");

  await page.getByLabel("Language").getByRole("button", { name: "RO", exact: true }).click();

  await expect(page.getByRole("heading", { name: "Birocratie ca Software", level: 1 })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Flux ghidat Legea 544" })).toBeVisible();
  await expect(page.getByRole("button", { name: /Depune cererea/i })).toBeVisible();
  await expect(page.getByRole("region", { name: "Actiuni demo" }).getByRole("button", { name: "Exporta dovada" })).toBeVisible();
});

test("exports a public audit receipt for the selected request", async ({ page }) => {
  await page.goto("./");

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export receipt" }).click();
  const download = await downloadPromise;

  expect(download.suggestedFilename()).toMatch(/REQ-2026-[a-z0-9-]+-audit-receipt\.json/);
});

test("runs the guided Law 544 flow and proves edited exports are refused", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium", "Full guided flow is covered on desktop; mobile is covered by the viewport smoke.");

  await page.goto("./");

  await runFullLaw544Scenario(page);

  await expect(page.getByText("complete").first()).toBeVisible();
  await expect(page.getByText("Ledger verifies")).toBeVisible();
  await expect(page.locator(".integrityPanel").getByText("Events checked").locator("..")).toContainText("6");
  await expect(page.getByText("Resolved").first()).toBeVisible();
  await expect(page.locator(".timelinePanel").getByText("Request_Resolved", { exact: true })).toBeVisible();
  await expect(page.locator(".timelinePanel").getByText("PublicServant", { exact: true }).first()).toBeVisible();

  await page.getByRole("button", { name: /test edited export/i }).click();
  await expect(page.getByText(/Tamper demo worked/i)).toBeVisible();
  await expect(page.getByText("Ledger verifies")).toBeVisible();
});

test("verifies the final response hash locally in the browser", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium", "Hash verification is flow-gated and covered once on desktop.");

  const fixedIso = "2026-09-14T10:00:00.000Z";
  await freezeBrowserClock(page, fixedIso);
  await page.goto("./");
  await runFullLaw544Scenario(page);

  const chooser = page.getByLabel("Choose file");

  await chooser.setInputFiles({
    name: "edited-response.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.from("edited response"),
  });
  await expect(
    page.locator("p.danger").filter({ hasText: "The selected file does not match the recorded hash." }),
  ).toBeVisible();

  await chooser.setInputFiles({
    name: "final-response.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.from(JSON.stringify({ label: "final-response.pdf", generatedAt: fixedIso })),
  });
  await expect(
    page.locator("p.okText").filter({ hasText: "The selected file matches the recorded response hash." }),
  ).toBeVisible();
  await expect(page.getByText("verified")).toBeVisible();
});

test("keeps the public screen free of obvious demo PII", async ({ page }) => {
  await page.goto("./");

  const bodyText = await page.locator("body").innerText();

  expect(bodyText).not.toMatch(/\b[1-9]\d{12}\b/);
  expect(bodyText).not.toMatch(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  expect(bodyText).not.toMatch(/\+40\s?\d{3}\s?\d{3}\s?\d{3}/);
});
