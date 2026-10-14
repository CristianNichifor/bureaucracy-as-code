import { expect, test } from "@playwright/test";

test("lists the signed trail as a table with a copyable state hash per row", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("button", { name: "Run full scenario" }).click();

  const table = page.getByRole("table", { name: "Signed audit trail" });
  await expect(table).toBeVisible();
  await expect(table.getByRole("columnheader", { name: "State hash" })).toBeVisible();

  const rows = table.locator("tbody > tr:first-child");
  await expect(rows).toHaveCount(6);
  await expect(rows.first()).toContainText("Request submitted");
  await expect(rows.first()).toContainText("Draft");
  await expect(rows.first().getByRole("button", { name: /^Copy: / })).toBeVisible();

  const lastRow = rows.last();
  await expect(lastRow).toContainText("Answer sent");
  const proofRow = lastRow.locator("xpath=following-sibling::tr[1]");
  await proofRow.locator("summary", { hasText: "Event proof" }).click();
  await expect(proofRow.getByText("Signer DID hash")).toBeVisible();
});
