import { expect, test } from "@playwright/test";

const canonicalUrl = "https://projects.cristian-nichifor.com/bureaucracy-as-code/";

function meta(page: import("@playwright/test").Page, attribute: "property" | "name", key: string) {
  return page.locator(`head meta[${attribute}="${key}"]`);
}

test("publishes social sharing metadata", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium", "Document metadata does not depend on the viewport.");

  await page.goto("./");

  await expect(meta(page, "property", "og:type")).toHaveAttribute("content", "website");
  await expect(meta(page, "property", "og:url")).toHaveAttribute("content", canonicalUrl);
  await expect(meta(page, "property", "og:image")).toHaveAttribute("content", `${canonicalUrl}og.png`);
  await expect(meta(page, "property", "og:image:width")).toHaveAttribute("content", "1200");
  await expect(meta(page, "property", "og:image:height")).toHaveAttribute("content", "630");
  await expect(meta(page, "property", "og:image:alt")).toHaveAttribute("content", /.+/);
  await expect(meta(page, "name", "twitter:card")).toHaveAttribute("content", "summary_large_image");
});

test("serves the social preview image at 1200x630", async ({ request }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium", "The image does not depend on the viewport.");

  const response = await request.get("og.png");
  expect(response.ok()).toBe(true);
  expect(response.headers()["content-type"]).toContain("image/png");

  const png = await response.body();
  // PNG signature, then the IHDR chunk carries width and height as big-endian integers.
  expect(png.subarray(1, 4).toString("ascii")).toBe("PNG");
  expect(png.readUInt32BE(16)).toBe(1200);
  expect(png.readUInt32BE(20)).toBe(630);
});
