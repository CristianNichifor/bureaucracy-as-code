import type { Dictionary, Language } from "../i18n";

const HUB_HOME: Record<Language, string> = {
  en: "https://projects.cristian-nichifor.com/",
  ro: "https://projects.cristian-nichifor.com/ro/",
};
const SOURCE_URL = "https://github.com/CristianNichifor/bureaucracy-as-code";

/** Footer links back to the civic tool family hub and to this app's source. */
export function FamilyLinks({ labels, language }: { labels: Dictionary["familyLinks"]; language: Language }) {
  return (
    <nav className="familyLinks" aria-label={labels.hub}>
      <a href={HUB_HOME[language]}>{labels.hub}</a>
      <a href={SOURCE_URL}>{labels.source} ↗</a>
    </nav>
  );
}
