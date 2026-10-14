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
  const results = await new AxeBuilder({ page }).analyze();

  expect(results.violations).toEqual([]);
}

for (const colorScheme of ["light", "dark"] as const) {
  test(`has no automated accessibility violations on the public landing state in ${colorScheme} theme @a11y`, async ({ page }) => {
    await page.emulateMedia({ colorScheme });
    await page.goto("./");

    await expect(page.getByRole("main")).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("data-theme", colorScheme);
    await expectNoA11yViolations(page);

    // The tools menu starts closed, so scan its contents too.
    await page.locator(".toolsMenu > summary").click();
    await expect(page.getByRole("region", { name: "Demo actions" })).toBeVisible();
    await expectNoA11yViolations(page);
  });

  test(`has no automated accessibility violations in Romanian in ${colorScheme} theme @a11y`, async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-chromium", "Romanian copy is scanned once on desktop.");

    await page.emulateMedia({ colorScheme });
    await page.goto("./");
    await page.getByLabel("Language").getByRole("button", { name: "RO", exact: true }).click();

    await expect(page.locator("html")).toHaveAttribute("lang", "ro");
    await expectNoA11yViolations(page);
  });
}

for (const colorScheme of ["light", "dark"] as const) {
  test(`has no automated accessibility violations after the full guided scenario in ${colorScheme} theme @a11y`, async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-chromium", "Full scenario accessibility scan runs once on desktop.");

    await page.emulateMedia({ colorScheme });
    await page.goto("./");

    for (const name of fullScenarioSteps) {
      await page.getByRole("button", { name: new RegExp(name, "i") }).click();
    }

    await expect(page.getByText("Ledger verifies")).toBeVisible();
    await expectNoA11yViolations(page);
  });
}

test("has no automated accessibility violations on the mobile layout @a11y", async ({ page }) => {
  await page.goto("./");

  await expect(page.getByRole("navigation", { name: "Request progress" })).toBeVisible();
  await expectNoA11yViolations(page);
});

for (const colorScheme of ["light", "dark"] as const) {
  test(`has no automated accessibility violations in the explorer view in ${colorScheme} theme @a11y`, async ({ page }) => {
    await page.emulateMedia({ colorScheme });
    await page.goto("./#explorer");

    await expect(page.getByRole("heading", { name: "Public request explorer" })).toBeVisible();
    await expectNoA11yViolations(page);
  });
}
