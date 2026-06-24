export const locales = ["en", "tr", "fr"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const localeLabels: Record<Locale, string> = {
  en: "EN",
  tr: "TR",
  fr: "FR",
};

export const localeNames: Record<Locale, string> = {
  en: "English",
  tr: "Türkçe",
  fr: "Français",
};

export function isValidLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}
