import { describe, expect, it } from "vitest";
import { dictionaries } from "./i18n";

function collectStrings(value: unknown, path = ""): Array<[string, string]> {
  if (typeof value === "string") return [[path, value]];
  if (Array.isArray(value)) return value.flatMap((item, index) => collectStrings(item, `${path}[${index}]`));
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, item]) => collectStrings(item, path ? `${path}.${key}` : key));
  }
  return [];
}

function shape(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(shape);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, shape(item)]));
  }
  return typeof value;
}

// Spellings that only appear when Romanian is typed without diacritics.
const asciiOnlyForms = [
  "si", "sa", "in", "fara", "dupa", "catre", "pana", "inca", "inainte",
  "tranzitie", "semnata", "raspuns", "raspunsul", "institutie", "institutii",
  "functionar", "cetatean", "cetateanul", "lant", "lantul", "inregistrat",
  "intarziata", "birocratie", "administratie", "actiuni", "dovada verificata",
  "fisierul", "registrul se verifica", "ruleaza", "reseteaza", "exporta",
];

const romanianStrings = collectStrings(dictionaries.ro);

describe("Romanian dictionary", () => {
  it("uses comma-below ș ț, never cedilla ş ţ", () => {
    const withCedilla = romanianStrings.filter(([, text]) => /[şŞţŢ]/.test(text));
    expect(withCedilla).toEqual([]);
  });

  it("contains no ASCII-only Romanian spellings", () => {
    const offenders = romanianStrings.flatMap(([path, text]) =>
      asciiOnlyForms
        .filter((form) => new RegExp(`(?<![\\p{L}])${form}(?![\\p{L}])`, "iu").test(text))
        .map((form) => `${path}: "${form}" in "${text}"`),
    );
    expect(offenders).toEqual([]);
  });

  it("uses diacritics somewhere in every long sentence", () => {
    const bare = romanianStrings.filter(
      ([, text]) => text.split(" ").length >= 6 && !/[ăâîșțĂÂÎȘȚ]/.test(text),
    );
    expect(bare).toEqual([]);
  });

  it("has the same keys as the English dictionary", () => {
    expect(shape(dictionaries.ro)).toEqual(shape(dictionaries.en));
  });
});
