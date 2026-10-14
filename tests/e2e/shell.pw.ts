import { expect, test } from "@playwright/test";

const HUB_URL = "https://projects.cristian-nichifor.com/";

test("frames the page with the family bar, provenance line and footer", async ({ page }) => {
  await page.goto("./");

  const banner = page.getByRole("banner");
  await expect(banner.getByRole("link", { name: "Civic projects" })).toHaveAttribute("href", HUB_URL);
  await expect(banner).toContainText("Demo data");
  await expect(banner.getByLabel("Language")).toBeVisible();

  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Bureaucracy as Code");
  await expect(page.locator(".hero .provenance")).toContainText("synthetic demo, generated in the browser");

  const footer = page.getByRole("contentinfo");
  for (const name of ["Method", "About Law 544/2001", "Privacy", "Source", "Contact"]) {
    await expect(footer.getByRole("link", { name })).toBeVisible();
  }
});

test("uses the registry name and Romanian shell strings in Romanian mode", async ({ page }) => {
  await page.goto("./");
  await page.getByLabel("Language").getByRole("button", { name: "RO", exact: true }).click();

  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Birocrație ca program");
  await expect(page).toHaveTitle("Birocrație ca program");
  const banner = page.getByRole("banner");
  await expect(banner.getByRole("link", { name: "Proiecte civice" })).toBeVisible();
  await expect(banner).toContainText("Date demonstrative");
  await expect(page.locator(".hero .provenance")).toContainText("demo sintetice, generate în browser");
});
