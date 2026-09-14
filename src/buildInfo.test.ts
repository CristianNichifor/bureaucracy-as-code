import { describe, expect, it, vi } from "vitest";
import { fallbackBuildInfo, loadBuildInfo } from "./buildInfo";

describe("build info", () => {
  it("loads generated build metadata", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        json: async () => ({
          schema: "bureaucracy-as-code-build-info/v1",
          builtAt: "2026-09-14T10:00:00.000Z",
          commitSha: "1234567890abcdef",
          commitShortSha: "1234567",
          branch: "main",
          environment: "production",
        }),
      })),
    );

    await expect(loadBuildInfo()).resolves.toMatchObject({
      commitShortSha: "1234567",
      environment: "production",
    });

    vi.unstubAllGlobals();
  });

  it("falls back when metadata cannot be read", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => ({ ok: false })));

    await expect(loadBuildInfo()).resolves.toEqual(fallbackBuildInfo);

    vi.unstubAllGlobals();
  });
});
