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
  /\bMinistry of\b/,
  /\bCity Hall\b/,
  /\bNational (Agency|Authority)\b/,
  /Public spending data/,
  /Budget execution/,
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

  await expect(page.getByRole("banner")).not.toContainText("Presenter mode");
  await expect(page.locator(".presenterBanner")).toHaveCount(0);

  await page.goto("./?presenter=1");
  await expect(page.getByRole("heading", { name: "Release readiness" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Presenter checklist" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Demo completeness" })).toBeVisible();

  // BAC-19: the mode is visible, says the panels are not public, and offers a way out.
  await expect(page.getByRole("banner").locator(".presenterBadge")).toHaveText("Presenter mode");
  const notice = page.locator(".presenterBanner");
  await expect(notice).toHaveAttribute("role", "status");
  await expect(notice).toContainText("not shown to the public");
  await expect(notice.getByRole("link", { name: "Leave presenter mode" })).toHaveAttribute("href", /^[^?]*$/);

  // The presenter needs the panels before the run: checklist, readiness, completeness, then the acts.
  const order = await page.evaluate(() => {
    const headings = ["Presenter checklist", "Release readiness", "Demo completeness"].map((name) =>
      [...document.querySelectorAll("h2, h3")].find((el) => el.textContent?.trim() === name),
    );
    const acts = document.querySelector(".actProgress");
    const before = (a: Element | undefined, b: Element | null | undefined) =>
      Boolean(a && b && a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);
    return [before(headings[0], headings[1]), before(headings[1], headings[2]), before(headings[2], acts)];
  });
  expect(order).toEqual([true, true, true]);

  await notice.getByRole("link", { name: "Leave presenter mode" }).click();
  await expect(page.getByRole("heading", { name: "Presenter checklist" })).toHaveCount(0);
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
  await page.goto("./#explorer");
  await expect(page.getByRole("heading", { name: "Public request explorer" })).toBeVisible();

  const text = await page.evaluate(() => document.body.innerText);
  expect(text).toMatch(/\b\d{1,2} [A-Z][a-z]{2,3} \d{4}\b/);
  expect(text).not.toMatch(/\b\d{1,2}\/\d{1,2}\/\d{4}\b/);
});

test("reads as three acts with a sticky step indicator", async ({ page }) => {
  await page.goto("./");

  const acts = page.locator(".dashboardSections > section");
  await expect(acts).toHaveCount(3);
  for (const [index, name] of ["Request", "Machinery", "Proof"].entries()) {
    await expect(page.getByRole("region", { name, exact: true })).toBeVisible();
    await expect(acts.nth(index).locator(".sectionHeader h2")).toHaveText(name);
  }
  await expect(page.getByRole("heading", { name: "Public request explorer" })).toHaveCount(0);

  const progress = page.getByRole("navigation", { name: "Request progress" });
  await expect(progress).toContainText("Step 0/6");
  await expect(progress).toHaveCSS("position", "sticky");

  await page.getByRole("button", { name: "Start the request" }).click();
  await expect(progress).toContainText("Step 1/6");

  await page.getByRole("region", { name: "Proof", exact: true }).scrollIntoViewIfNeeded();
  await expect(progress).toBeInViewport();
});

test("moves the explorer and operations to a second view", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("navigation", { name: "Views" }).getByRole("link", { name: "Explorer" }).click();

  await expect(page).toHaveURL(/#explorer$/);
  await expect(page.getByRole("heading", { name: "Public request explorer" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Institution workload" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Machinery", exact: true })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Release readiness" })).toHaveCount(0);

  await page.getByRole("navigation", { name: "Views" }).getByRole("link", { name: "Demo" }).click();
  await expect(page.getByRole("region", { name: "Machinery", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Public request explorer" })).toHaveCount(0);
});
