import { expect, test } from "@playwright/test";

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

test("runs the guided Law 544 flow and proves edited exports are refused", async ({ page }) => {
  await page.goto("./");

  for (const name of [
    "Submit request",
    "Assign registry number",
    "Route to servant",
    "Start processing",
    "Attach evidence",
    "Resolve request",
  ]) {
    await page.getByRole("button", { name: new RegExp(name, "i") }).click();
  }

  await expect(page.getByText("complete").first()).toBeVisible();
  await expect(page.getByText("Ledger verifies")).toBeVisible();
  await expect(page.getByText("Events checked").locator("..")).toContainText("6");

  await page.getByRole("button", { name: /test edited export/i }).click();
  await expect(page.getByText(/Tamper demo worked/i)).toBeVisible();
  await expect(page.getByText("Ledger verifies")).toBeVisible();
});

test("keeps the public screen free of obvious demo PII", async ({ page }) => {
  await page.goto("./");

  const bodyText = await page.locator("body").innerText();

  expect(bodyText).not.toMatch(/\b[1-9]\d{12}\b/);
  expect(bodyText).not.toMatch(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  expect(bodyText).not.toMatch(/\+40\s?\d{3}\s?\d{3}\s?\d{3}/);
});
