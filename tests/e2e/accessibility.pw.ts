import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const fullScenarioSteps = [
  "Submit request",
  "Assign registry number",
  "Route to servant",
  "Start processing",
  "Attach evidence",
  "Resolve request",
];

async function expectNoA11yViolations(page: import("@playwright/test").Page) {
  const results = await new AxeBuilder({ page })
    .disableRules(["color-contrast"])
    .analyze();

  expect(results.violations).toEqual([]);
}

test("has no automated accessibility violations on the public landing state @a11y", async ({ page }) => {
  await page.goto("./");

  await expect(page.getByRole("main")).toBeVisible();
  await expectNoA11yViolations(page);
});

test("has no automated accessibility violations after the full guided scenario @a11y", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium", "Full scenario accessibility scan runs once on desktop.");

  await page.goto("./");

  for (const name of fullScenarioSteps) {
    await page.getByRole("button", { name: new RegExp(name, "i") }).click();
  }

  await expect(page.getByText("Ledger verifies")).toBeVisible();
  await expectNoA11yViolations(page);
});

test("has no automated accessibility violations on the mobile layout @a11y", async ({ page }) => {
  await page.goto("./");

  await expect(page.getByRole("heading", { name: "Public request explorer" })).toBeVisible();
  await expectNoA11yViolations(page);
});
