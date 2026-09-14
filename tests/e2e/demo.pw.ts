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
  { name: "full desktop", width: 1920, height: 1000 },
  { name: "wide centered desktop", width: 2048, height: 1000 },
  { name: "ultrawide centered desktop", width: 2560, height: 1080 },
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
  await expect(page.getByRole("heading", { name: "Run the request" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Public explorer", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Request accountability" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Proof and verification" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Guided Law 544 run" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Ledger integrity" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Release readiness" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Presenter checklist" })).toBeVisible();
  await expect(page.getByRole("button", { name: /deadline warning/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /partial disclosure/i })).toBeVisible();
  await expect(page.getByRole("button", { name: "Redirected", exact: true })).toBeVisible();
  await expect(page.getByText("Normal request lifecycle with evidence and a final response hash.")).toBeVisible();
  await expect(page.getByText("Proves missed deadlines remain visible instead of being overwritten.")).toBeVisible();
  await expect(page.getByText("signed events").first()).toBeVisible();
  await expect(page.getByPlaceholder("Search request, subject, institution, registry")).toBeVisible();
  await expect(page.getByText("Browser demo ready")).toBeVisible();
  await expect(page.getByText(/No ROeID integration/)).toBeVisible();
  await expect(page.getByText("pnpm demo:verify")).toBeVisible();
  await expect(page.getByText("Ready for a live run. Submit the request to record the first signed transition.")).toBeVisible();
  await expect(page.getByText("Ledger verifies")).toBeVisible();
  await expect(page.getByLabel("Deployed build")).toBeVisible();

  expect(pageErrors).toEqual([]);
});

test("registers the offline presentation service worker", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium", "Service worker registration is covered once on desktop.");

  await page.goto("./");

  const registration = await page.evaluate(async () => {
    if (!("serviceWorker" in navigator)) return null;
    const ready = await navigator.serviceWorker.ready;
    return {
      scope: ready.scope,
      scriptURL: ready.active?.scriptURL ?? null,
    };
  });

  expect(registration?.scope).toContain("/bureaucracy-as-code/");
  expect(registration?.scriptURL).toContain("/bureaucracy-as-code/sw.js");
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
    if (viewport.name.includes("desktop")) {
      await page.getByLabel("Theme").getByRole("button", { name: "Dark", exact: true }).click();
      await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    }
    await page.getByRole("button", { name: /run full scenario/i }).click();

    await expect(page.getByRole("heading", { name: "Bureaucracy as Code", level: 1 })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Run the request" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Public explorer", exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Request accountability" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Proof and verification" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Public request explorer" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Request detail" })).toBeVisible();
    await expect(page.getByText("Deadline status")).toBeVisible();
    await expect(page.getByText(/days remaining|days overdue/i).first()).toBeVisible();
    await expect(page.getByRole("heading", { name: "Bureaucratic machinery" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Signed audit trail" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Response hash verifier" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Presenter checklist" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Release readiness" })).toBeVisible();
    await expect(page.getByText("Ledger verifies")).toBeVisible();

    const overflow = await page.evaluate(() => ({
      body: document.body.scrollWidth - window.innerWidth,
      root: document.documentElement.scrollWidth - window.innerWidth,
    }));
    expect(overflow.body, `${viewport.name} body horizontal overflow`).toBeLessThanOrEqual(1);
    expect(overflow.root, `${viewport.name} root horizontal overflow`).toBeLessThanOrEqual(1);

    const boxes = await page.locator(".dashboardSection, .sectionHeader, .panel, .feedRow, .graphNode, .caseGlance, .readinessLink, .presenterSteps li").evaluateAll((nodes) =>
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

    const shell = await page.locator(".appShell").evaluate((node) => {
      const rect = node.getBoundingClientRect();
      return {
        left: rect.left,
        right: rect.right,
        width: rect.width,
        viewport: window.innerWidth,
      };
    });

    if (viewport.width <= 1920) {
      expect(shell.width, `${viewport.name} shell stretches full viewport`).toBeCloseTo(viewport.width, 0);
      expect(shell.left, `${viewport.name} shell starts at viewport edge`).toBeCloseTo(0, 0);
    } else {
      expect(shell.width, `${viewport.name} shell caps at 1920px`).toBeCloseTo(1920, 0);
      expect(shell.left, `${viewport.name} shell is centered`).toBeCloseTo((viewport.width - 1920) / 2, 0);
      expect(shell.right, `${viewport.name} shell is centered`).toBeCloseTo((viewport.width + 1920) / 2, 0);
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
  await expect(page.getByRole("heading", { name: "Ruleaza cererea" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Explorer public", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Responsabilitate pe cerere" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Flux ghidat Legea 544" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Pregatire release" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Checklist prezentare" })).toBeVisible();
  await expect(page.getByRole("button", { name: /Depune cererea/i })).toBeVisible();
  await expect(page.getByText("Ciclul normal al cererii, cu dovada si hash pentru raspunsul final.")).toBeVisible();
  await expect(page.getByText("Status termen")).toBeVisible();
  await expect(page.getByRole("region", { name: "Actiuni demo" }).getByRole("button", { name: "Exporta dovada" })).toBeVisible();
});

test("switches and persists light and dark themes", async ({ page }) => {
  await page.goto("./");

  await page.getByLabel("Theme").getByRole("button", { name: "Dark", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

  await page.getByLabel("Theme").getByRole("button", { name: "Light", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});

test("searches and sorts the public request explorer", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium", "Explorer control behavior is covered once on desktop.");

  await page.goto("./");

  await page.getByPlaceholder("Search request, subject, institution, registry").fill("rail");
  await expect(page.getByRole("button", { name: /REQ-2026-0008/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /REQ-2026-0002/i })).toHaveCount(0);

  await page.getByLabel("Sort").selectOption("events-desc");
  await expect(page.getByRole("button", { name: /REQ-2026-0008/i })).toBeVisible();

  await page.getByRole("button", { name: "Reset filters" }).click();
  await expect(page.getByRole("button", { name: /REQ-2026-0002/i })).toBeVisible();
});

test("exports a public audit receipt for the selected request", async ({ page }) => {
  await page.goto("./");

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export receipt" }).click();
  const download = await downloadPromise;

  expect(download.suggestedFilename()).toMatch(/REQ-2026-[a-z0-9-]+-audit-receipt\.json/);
});

test("exports a public proof report for visible requests", async ({ page }) => {
  await page.goto("./");

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export proof report" }).click();
  const download = await downloadPromise;
  const file = await download.createReadStream();
  const chunks: Buffer[] = [];

  for await (const chunk of file) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  const report = JSON.parse(Buffer.concat(chunks).toString("utf8")) as {
    schema: string;
    summary: { requestCount: number; eventCount: number; invalidChainCount: number };
  };

  expect(download.suggestedFilename()).toMatch(/law544-public-proof-report-\d+-requests\.json/);
  expect(report.schema).toBe("law544-public-proof-report/v1");
  expect(report.summary.requestCount).toBeGreaterThan(0);
  expect(report.summary.eventCount).toBeGreaterThan(0);
  expect(report.summary.invalidChainCount).toBe(0);
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

test("supports step and auto-run timeline controls", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium", "Presenter timeline controls are covered once on desktop.");

  await page.goto("./");

  await page.getByRole("button", { name: /step next/i }).click();
  await expect(page.getByText(/Citizen signed Request_Created/i)).toBeVisible();
  await expect(page.getByText(/Proof hash [a-f0-9]{18}; verified ledger events: 1/i)).toBeVisible();
  await expect(page.getByText(/Request_Created · Citizen/i)).toBeVisible();

  await page.getByRole("button", { name: /auto-run/i }).click();
  await expect(page.getByText("complete").first()).toBeVisible({ timeout: 6_000 });
  await expect(page.getByText(/Public servant signed Request_Resolved/i)).toBeVisible();
  await expect(page.getByText(/verified ledger events: 6/i)).toBeVisible();
  await expect(page.getByText(/Request_Resolved · PublicServant/i)).toBeVisible();
  await expect(page.locator(".integrityPanel").getByText("Events checked").locator("..")).toContainText("6");
});

test("replays exceptional Law 544 simulations with signed metadata", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium", "Scenario variants are covered once on desktop.");

  await page.goto("./");

  await page.getByRole("button", { name: /deadline warning/i }).click();
  await expect(page.getByText("Extension Requested").first()).toBeVisible();
  await expect(page.locator(".timelinePanel").getByText("Extension_Requested", { exact: true })).toBeVisible();
  await expect(page.locator(".timelinePanel").getByText(/extensionDeadlineAt: 2026-10-14/i)).toBeVisible();
  await expect(page.locator(".integrityPanel").getByText("Events checked").locator("..")).toContainText("5");

  await page.getByRole("button", { name: /partial disclosure/i }).click();
  await expect(page.getByText("Resolved").first()).toBeVisible();
  await expect(page.locator(".timelinePanel").getByText(/disclosure: partial/i).first()).toBeVisible();
  await expect(page.locator(".timelinePanel").getByText(/redactionBasis: third-party-personal-data/i).first()).toBeVisible();
  await expect(page.locator(".integrityPanel").getByText("Events checked").locator("..")).toContainText("6");

  await page.getByRole("button", { name: "Redirected", exact: true }).click();
  await expect(page.getByText("Resolved").first()).toBeVisible();
  await expect(page.locator(".timelinePanel").getByText(/outcome: redirected/i)).toBeVisible();
  await expect(page.locator(".timelinePanel").getByText(/targetInstitution: Ministry of Development/i)).toBeVisible();
  await expect(page.locator(".integrityPanel").getByText("Events checked").locator("..")).toContainText("5");
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
  await expect(page.getByText("verified", { exact: true })).toBeVisible();
});

test("keeps the public screen free of obvious demo PII", async ({ page }) => {
  await page.goto("./");

  const bodyText = await page.locator("body").innerText();

  expect(bodyText).not.toMatch(/\b[1-9]\d{12}\b/);
  expect(bodyText).not.toMatch(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  expect(bodyText).not.toMatch(/\+40\s?\d{3}\s?\d{3}\s?\d{3}/);
});

test("shows the presenter checklist and operator commands", async ({ page }) => {
  await page.goto("./");

  const panel = page.getByRole("region", { name: "Presenter checklist" });
  await expect(panel).toBeVisible();
  await expect(panel.getByText("Open the explorer and point to anonymized seeded Law 544 requests.")).toBeVisible();
  await expect(panel.getByText("pnpm demo:release")).toBeVisible();
  await expect(panel.getByText("pnpm demo:capture")).toBeVisible();
});
