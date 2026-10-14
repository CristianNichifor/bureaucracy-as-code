import type { Language } from "../i18n";

/**
 * Romanian versions of the seeded and scripted demo data. The stored requests keep
 * the English text, so filters, identity checks and exports do not depend on the
 * language; only the display is translated.
 */
export const romanianDemoText: Record<string, string> = {
  "Ministry of Finance": "Ministerul Finanțelor",
  "Ministry of Health": "Ministerul Sănătății",
  "City Hall Bucharest Sector 1": "Primăria Sectorului 1 București",
  "Ministry of Environment": "Ministerul Mediului",
  "National Agency for Cadastre": "Agenția Națională de Cadastru",
  "National Authority for Consumer Protection": "Autoritatea Națională pentru Protecția Consumatorilor",
  "Ministry of Transport": "Ministerul Transporturilor",
  "Ministry of Education": "Ministerul Educației",
  "Ministry of Energy": "Ministerul Energiei",
  "Ministry of Development": "Ministerul Dezvoltării",
  "National Railway Company": "Compania Națională de Căi Ferate",
  "Budget execution for a county road program": "Execuția bugetară a unui program de drumuri județene",
  "Public procurement data for hospital equipment": "Date de achiziții publice pentru echipamente spitalicești",
  "Urban planning authorization register export": "Export din registrul autorizațiilor de urbanism",
  "Air quality sensor calibration records": "Evidența calibrării senzorilor de calitate a aerului",
  "Dataset publication status for cadastral map updates":
    "Stadiul publicării setului de date pentru actualizarea hărților cadastrale",
  "Complaint inspection statistics by county": "Statistici ale controalelor la reclamații, pe județe",
  "Rail modernization contract annexes redirected to operator":
    "Anexele contractului de modernizare feroviară, redirecționate către operator",
  "School renovation grant scoring sheets": "Grilele de punctaj pentru granturile de renovare a școlilor",
  "State aid decision publication timeline": "Calendarul publicării deciziei de ajutor de stat",
  "Public spending data for a demo program": "Date despre cheltuielile publice ale unui program demonstrativ",
};

export function localizeDemoText(text: string, language: Language): string {
  return language === "ro" ? (romanianDemoText[text] ?? text) : text;
}
