import type { Locale } from "./config";
import { dictionary as en } from "./dictionaries/en";
import { dictionary as fr } from "./dictionaries/fr";
import { dictionary as tr } from "./dictionaries/tr";

const dictionaries = { en, tr, fr };

export type Dictionary = typeof en;

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] as Dictionary;
}
