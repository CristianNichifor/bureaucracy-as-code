import { expect, test } from "@playwright/test";

test("shows the institution workload as a table that filters the feed", async ({ page }) => {
  await page.goto("./#explorer");

  // BAC-18: the four count tiles in the design's order, above the workload table.
  const tiles = page.locator(".operationsMetrics button");
  await expect(tiles).toHaveCount(4);
  await expect(tiles.locator("span")).toHaveText(["Institutions", "Open", "Overdue", "Finalized"]);

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
