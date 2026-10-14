import { expect, test } from "@playwright/test";

test("writes the hash verification result in words with a way to try another file", async ({ page }) => {
  await page.goto("./");
  await expect(page.getByRole("status").filter({ hasText: "Waiting for a file" })).toBeVisible();

  await page.getByRole("button", { name: "Run full scenario" }).click();
  await expect(page.getByRole("heading", { name: "Response hash verifier" })).toBeVisible();

  await page.getByLabel("Choose file").setInputFiles({
    name: "edited-response.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.from("edited response"),
  });

  const alert = page.getByRole("alert").filter({ hasText: "The file does not match." });
  await expect(alert).toBeVisible();
  await expect(alert).toContainText("The selected file does not match the recorded hash.");

  // The retry action clears the result; the file picker it opens is native and not asserted.
  await page.evaluate(() => {
    HTMLInputElement.prototype.click = () => undefined;
  });
  await alert.getByRole("button", { name: "Choose another file" }).click();
  await expect(alert).toHaveCount(0);
  await expect(page.getByRole("status").filter({ hasText: "Waiting for a file" })).toBeVisible();
});
