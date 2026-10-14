import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { dictionaries } from "../i18n";
import { FamilyLinks } from "./FamilyLinks";

describe("BAC-21 footer links back to the hub and the source", () => {
  it("links to the hub home in the visitor's language and to the repository", () => {
    const ro = renderToString(createElement(FamilyLinks, { labels: dictionaries.ro.familyLinks, language: "ro" }));
    expect(ro).toContain('href="https://projects.cristian-nichifor.com/ro/"');
    expect(ro).toContain("Toate proiectele civice");
    expect(ro).toContain('href="https://github.com/CristianNichifor/bureaucracy-as-code"');
    const en = renderToString(createElement(FamilyLinks, { labels: dictionaries.en.familyLinks, language: "en" }));
    expect(en).toContain('href="https://projects.cristian-nichifor.com/"');
    expect(en).toContain("All civic projects");
  });
});
