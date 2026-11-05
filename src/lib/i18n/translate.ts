import type { Language } from "@/features/settings/types";
import { ar } from "./ar";
import { en } from "./en";
import { he } from "./he";
import { getLocale } from "./locales";
import type {
  Dictionary,
  PluralKey,
  TranslationKey,
  TranslationVars,
} from "./types";

const dictionaries: Record<Language, Dictionary> = { en, he, ar };

const pluralRulesCache = new Map<Language, Intl.PluralRules>();

function getPluralRules(language: Language) {
  let rules = pluralRulesCache.get(language);
  if (!rules) {
    rules = new Intl.PluralRules(getLocale(language));
    pluralRulesCache.set(language, rules);
  }
  return rules;
}

function lookup(language: Language, key: string): string | undefined {
  const dict = dictionaries[language] as Record<string, string | undefined>;
  return dict[key] ?? (en as Record<string, string | undefined>)[key];
}

function interpolate(template: string, vars?: TranslationVars): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in vars ? String(vars[name]) : match
  );
}

/**
 * Translates `key` into `language`, filling `{placeholders}` from `vars`.
 * Falls back to English, then to the key itself, so a gap never crashes the UI.
 */
export function translate(
  language: Language,
  key: TranslationKey,
  vars?: TranslationVars
): string {
  return interpolate(lookup(language, key) ?? key, vars);
}

/**
 * Plural-aware translation. `base` names a `<base>.one` / `<base>.other` group;
 * the CLDR category for `count` is chosen with `Intl.PluralRules` and falls
 * back to `.other`. `{count}` is always available as a placeholder.
 */
export function translatePlural(
  language: Language,
  base: PluralKey,
  count: number,
  vars?: TranslationVars
): string {
  const category = getPluralRules(language).select(count);
  const template =
    lookup(language, `${base}.${category}`) ??
    lookup(language, `${base}.other`) ??
    base;
  return interpolate(template, { count, ...vars });
}

export type Translator = {
  (key: TranslationKey, vars?: TranslationVars): string;
  plural: (base: PluralKey, count: number, vars?: TranslationVars) => string;
  language: Language;
};

/** Binds a language into a `t()` function (also usable outside React). */
export function createTranslator(language: Language): Translator {
  const t = ((key: TranslationKey, vars?: TranslationVars) =>
    translate(language, key, vars)) as Translator;
  t.plural = (base, count, vars) =>
    translatePlural(language, base, count, vars);
  t.language = language;
  return t;
}
