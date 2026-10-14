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

  it("has the same keys as the English dictionary", () => {
    expect(shape(dictionaries.ro)).toEqual(shape(dictionaries.en));
  });
});

describe("first screen shell", () => {
  it("names the app from the civic-ui naming registry", () => {
    expect(dictionaries.ro.app.title).toBe("Birocrație ca program");
    expect(dictionaries.en.app.title).toBe("Bureaucracy as Code");
  });

  it("says the data is synthetic and names the hub in both languages", () => {
    expect(dictionaries.ro.app.provenance).toContain("demo");
    expect(dictionaries.en.app.provenance).toContain("demo");
    expect(dictionaries.ro.app.demoBadge).toBe("Date demonstrative");
    expect(dictionaries.ro.app.hubLabel).toBe("Proiecte civice");
    expect(dictionaries.ro.app.loadingStages.length).toBeGreaterThan(1);
  });
});

describe("UXG-7 plain-language glosses (design screen 02)", () => {
  const ro = dictionaries.ro;

  it("glosses hash as amprenta in the response verifier, in the mockup's words", () => {
    expect(ro.hash.copy).toContain("amprenta (hash)");
    expect(ro.hash.match).toBe("Amprenta fișierului selectat este identică cu hash-ul răspunsului înregistrat.");
    expect(ro.hash.mismatch).toBe("Amprenta calculată diferă de hash-ul înregistrat; fișierul este altul sau a fost modificat.");
  });

  it("calls the ledger a verifiable log and glosses hash where the panel first says it", () => {
    expect(ro.integrity.title).toBe("Integritatea jurnalului");
    expect(ro.integrity.validCopy).toContain("jurnal verificabil");
    expect(ro.integrity.validCopy).toContain("amprenta (hash)");
  });
});
