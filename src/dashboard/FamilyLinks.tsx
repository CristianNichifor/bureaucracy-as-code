import type { Dictionary, Language } from "../i18n";

const HUB_HOME: Record<Language, string> = {
  en: "https://projects.cristian-nichifor.com/",
  ro: "https://projects.cristian-nichifor.com/ro/",
};

/** Footer link back to the civic tool family hub; the source link sits in the footer nav. */
export function FamilyLinks({ labels, language }: { labels: Dictionary["familyLinks"]; language: Language }) {
  return (
    <nav className="familyLinks" aria-label={labels.hub}>
      <a href={HUB_HOME[language]}>{labels.hub}</a>
    </nav>
  );
}
