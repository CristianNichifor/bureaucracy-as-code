import { expect, test } from "@playwright/test";

const englishInRomanian = [
  /\bResolved\b/,
  /\bRejected\b/,
  /\bRegistered\b/,
  /\bRouted\b/,
  /\bOverdue\b/,
  /\bIn progress\b/,
  /\bExtension requested\b/,
  /\bCitizen\b/,
  /\bPublicServant\b/,
  /\bRegistryBot\b/,
  /\bPublic servant\b/,
  /\b[A-Z][a-z]+_[A-Z][a-z]+/,
  /\bReplayed\b/,
  /\bHappy path\b/,
  /No transfer action/,
  /Skip to public/,
  /\bSigned by\b/,
  /\bAll\b/,
];

test("leads the first screen with one primary action and the Law 544 terms", async ({ page }) => {
  await page.goto("./");

  const hero = page.locator(".hero");
  await expect(hero).toBeVisible();
  await expect(hero).toContainText("10 days");
  await expect(hero).toContainText("30");
  await expect(hero.getByRole("button", { name: "Start the request" })).toBeVisible();
  await expect(hero.locator(".civicButtonPrimary")).toHaveCount(1);

  await expect(page.getByRole("button", { name: "Export state" })).toBeHidden();
  await expect(page.getByRole("heading", { name: "Transfer safety" })).toBeHidden();

  await page.getByText("Tools", { exact: true }).click();
  const tools = page.getByRole("region", { name: "Demo actions" });
  for (const name of ["Export state", "Export receipt", "Export proof report", "Import", "Reset"]) {
    await expect(tools.getByRole("button", { name })).toBeVisible();
  }
  await expect(page.getByRole("heading", { name: "Transfer safety" })).toBeVisible();
});

test("starts the request from the primary action", async ({ page }) => {
  await page.goto("./");

  await page.getByRole("button", { name: "Start the request" }).click();

  await expect(page.locator(".message")).toContainText("Request submitted, signed by Citizen");
  await expect(page.locator(".lastRecorded")).toContainText("Request submitted, signed by Citizen");
  await expect(page.getByRole("button", { name: "Continue the request" })).toBeVisible();
});

test("keeps release operations behind ?presenter=1", async ({ page }) => {
  await page.goto("./");
  await expect(page.getByRole("heading", { name: "Release readiness" })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Presenter checklist" })).toHaveCount(0);

  await page.goto("./?presenter=1");
  await expect(page.getByRole("heading", { name: "Release readiness" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Presenter checklist" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Demo completeness" })).toBeVisible();
});

test("shows no English and Romanian dates in Romanian mode", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium", "The full Romanian text scan runs once on desktop.");

  await page.goto("./");
  await page.getByLabel("Language").getByRole("button", { name: "RO", exact: true }).click();
  await page.getByRole("button", { name: "Rulează complet" }).click();
  await expect(page.locator(".message")).toContainText("Scenariul Rulează complet a rulat");
  await page.getByText("Instrumente", { exact: true }).click();

  const text = await page.evaluate(() => document.body.innerText);
  const leftovers = englishInRomanian.flatMap((pattern) => {
    const match = text.match(pattern);
    return match ? [`${pattern} -> "${text.slice(Math.max(0, match.index! - 40), match.index! + 40)}"`] : [];
  });
  expect(leftovers).toEqual([]);

  // The test browser runs with en-US, so these prove the app follows its own language.
  expect(text).toMatch(/\b\d{2}\.\d{2}\.\d{4}\b/);
  expect(text).not.toMatch(/\b\d{1,2}\/\d{1,2}\/\d{4}\b/);
});

test("writes English dates without the US numeric format", async ({ page }) => {
  await page.goto("./");
  await expect(page.getByRole("heading", { name: "Public request explorer" })).toBeVisible();

  const text = await page.evaluate(() => document.body.innerText);
  expect(text).toMatch(/\b\d{1,2} [A-Z][a-z]{2,3} \d{4}\b/);
  expect(text).not.toMatch(/\b\d{1,2}\/\d{1,2}\/\d{4}\b/);
});
