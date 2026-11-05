import type { Language } from "@/features/settings/types";

export const LANGUAGES: readonly Language[] = ["en", "he", "ar"];

/**
 * BCP 47 locale used for Intl formatting (dates, numbers, currency).
 * Arabic forces Latin digits so numbers match the rest of the UI.
 */
const INTL_LOCALES: Record<Language, string> = {
  en: "en-US",
  he: "he-IL",
  ar: "ar-u-nu-latn",
};

export function getLocale(language: Language): string {
  return INTL_LOCALES[language] ?? INTL_LOCALES.en;
}