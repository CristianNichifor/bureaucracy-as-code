import { describe, expect, it } from "vitest";
import { memoryStorage } from "./shared/memoryStorage";
import { LANGUAGE_STORAGE_KEY, resolveInitialLanguage, saveLanguage } from "./language";

function throwingStorage(): Storage {
  const fail = () => {
    throw new Error("storage blocked");
  };
  return { length: 0, clear: fail, getItem: fail, key: fail, removeItem: fail, setItem: fail };
}

describe("initial language", () => {
  it("defaults to Romanian for a Romanian browser", () => {
    expect(resolveInitialLanguage(memoryStorage(), "ro-RO")).toBe("ro");
    expect(resolveInitialLanguage(memoryStorage(), "ro")).toBe("ro");
  });

  it("defaults to English for any other browser language", () => {
    expect(resolveInitialLanguage(memoryStorage(), "en-GB")).toBe("en");
    expect(resolveInitialLanguage(memoryStorage(), "rom")).toBe("en");
    expect(resolveInitialLanguage(memoryStorage(), undefined)).toBe("en");
  });

  it("prefers the saved choice over the browser language", () => {
    const storage = memoryStorage();
    saveLanguage(storage, "en");
    expect(storage.getItem(LANGUAGE_STORAGE_KEY)).toBe("en");
    expect(resolveInitialLanguage(storage, "ro-RO")).toBe("en");
  });

  it("ignores an unknown saved value", () => {
    const storage = memoryStorage();
    storage.setItem(LANGUAGE_STORAGE_KEY, "fr");
    expect(resolveInitialLanguage(storage, "ro-MD")).toBe("ro");
  });

  it("keeps working when storage throws", () => {
    expect(resolveInitialLanguage(throwingStorage(), "ro-RO")).toBe("ro");
    expect(() => saveLanguage(throwingStorage(), "ro")).not.toThrow();
  });

  it("keeps working without storage", () => {
    expect(resolveInitialLanguage(undefined, "en-US")).toBe("en");
    expect(() => saveLanguage(undefined, "ro")).not.toThrow();
  });
});
