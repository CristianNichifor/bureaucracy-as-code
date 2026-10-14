import { expect, test } from "@playwright/test";

const issuesUrl = "https://github.com/CristianNichifor/bureaucracy-as-code/issues";

test("opens the privacy notice from the footer", async ({ page }) => {
  await page.goto("./");

  await page.getByRole("contentinfo").getByRole("link", { name: "Privacy" }).click();

  const notice = page.getByRole("dialog", { name: "Privacy notice" });
  await expect(notice).toBeVisible();
  await expect(notice).toContainText("runs entirely in your browser");
  await expect(notice).toContainText("localStorage");
  await expect(notice).toContainText("IndexedDB");
  await expect(notice).toContainText("No cookies, analytics or trackers");
  await expect(notice).toContainText("Cloudflare");
  await expect(notice).toContainText("Cristian Nichifor");
  await expect(notice.getByRole("link", { name: /GitHub issues/i })).toHaveAttribute("href", issuesUrl);

  await notice.getByRole("button", { name: "Close" }).click();
  await expect(notice).toBeHidden();
});

test("shows the privacy notice in Romanian", async ({ page }) => {
  await page.goto("./");
  await page.getByLabel("Language").getByRole("button", { name: "RO", exact: true }).click();

  await page.getByRole("contentinfo").getByRole("link", { name: "Confidențialitate" }).click();

  const notice = page.getByRole("dialog", { name: "Notă de confidențialitate" });
  await expect(notice).toBeVisible();
  await expect(notice).toContainText("rulează integral în browserul tău");
  await expect(notice).toContainText("Fără cookie-uri, analiză de trafic sau trackere");
  await expect(notice.getByRole("link", { name: /GitHub/i })).toHaveAttribute("href", issuesUrl);
  await notice.getByRole("button", { name: "Închide" }).click();
  await expect(notice).toBeHidden();
});

test("opens the privacy notice from a #privacy link", async ({ page }) => {
  await page.goto("./#privacy");

  await expect(page.getByRole("dialog", { name: "Privacy notice" })).toBeVisible();
});
