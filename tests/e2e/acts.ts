import { expect, type Page } from "@playwright/test";

// The demo shows one act at a time (Request, Machinery, Proof); these helpers walk between them.

/** Opens an act from the sticky step bar by its visible name, in either language. */
export async function openAct(page: Page, name: string) {
  await page.locator(".actProgress").getByRole("link", { name, exact: true }).click();
  await expect(page.getByRole("region", { name, exact: true })).toBeVisible();
}

/** Opens the folded panels in the current act: the scenario shortcuts and the signed data flow. */
export async function openDisclosures(page: Page) {
  const closed = page.locator("details.scenarioShortcuts:not([open]), details.panelDisclosure:not([open])");
  while ((await closed.count()) > 0) {
    await closed.first().locator(":scope > summary").click();
  }
}

/** Shows the one-click scenario shortcuts, which the public page keeps folded. */
export async function showScenarios(page: Page) {
  const closed = page.locator("details.scenarioShortcuts:not([open])");
  if ((await closed.count()) > 0) await closed.locator(":scope > summary").click();
}
