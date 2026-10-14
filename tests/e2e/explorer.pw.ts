import { expect, test } from "@playwright/test";

test("shows status as symbol plus word and the deadline in words", async ({ page }) => {
  await page.goto("./#explorer");

  const feed = page.getByRole("group", { name: "Public request explorer" });
  const overdue = feed.getByRole("button", { name: /REQ-2026-0006/ });
  await expect(overdue).toContainText("⚠");
  await expect(overdue).toContainText("Overdue");
  await expect(overdue).toContainText(/\d+ days overdue/);

  const resolved = feed.getByRole("button", { name: /REQ-2026-0002/ });
  await expect(resolved).toContainText("✓");
  await expect(resolved).toContainText("closed");

  await expect(page.getByRole("status").filter({ hasText: /of \d+ requests shown/ })).toBeVisible();
});

test("names the active filters in the empty state", async ({ page }) => {
  await page.goto("./#explorer");
  await page.getByLabel("Search").fill("nothing-matches-this");

  const empty = page.getByRole("status").filter({ hasText: "No matching requests" });
  await expect(empty).toContainText("Active filters: „nothing-matches-this”");
  await empty.getByRole("button", { name: "Reset filters" }).click();
  await expect(page.getByRole("group", { name: "Public request explorer" }).getByRole("button", { name: /REQ-2026-0002/ })).toBeVisible();
});
