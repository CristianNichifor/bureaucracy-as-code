import { expect, test } from "@playwright/test";

test("shows the institution workload as a table that filters the feed", async ({ page }) => {
  await page.goto("./#explorer");

  const table = page.getByRole("table", { name: "Institution workload" });
  await expect(table).toBeVisible();
  for (const name of ["Institutions", "Open", "Overdue", "Finalized", "Next deadline", "Owner queue"]) {
    await expect(table.getByRole("columnheader", { name, exact: true })).toBeVisible();
  }

  const firstRow = table.locator("tbody tr").first();
  await expect(firstRow).toContainText("National Agency for Cadastre");
  await expect(firstRow).toContainText("Escalation queue");
  await expect(firstRow).toContainText("REQ-2026-0006");

  await firstRow.getByRole("button", { name: "National Agency for Cadastre" }).click();
  await expect(page.getByRole("combobox", { name: "Institution" })).toHaveValue("National Agency for Cadastre");
});
