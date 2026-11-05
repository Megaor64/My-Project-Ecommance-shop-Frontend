import type { en } from "./en";

/** Every key declared in `en.ts`. */
export type TranslationKey = keyof typeof en;

/** Base name of a plural group, e.g. `cart.count` for `cart.count.one|other`. */
export type PluralKey = TranslationKey extends infer K
  ? K extends `${infer Base}.other`
    ? Base
    : never
  : never;

/** Interpolation values for `{placeholder}` tokens. */
export type TranslationVars = Record<string, string | number>;

/**
 * A dictionary must define every English key. Languages with richer plural
 * rules (Arabic, Hebrew) may add the extra CLDR categories for plural groups.
 */
export type Dictionary = Record<TranslationKey, string> &
  Partial<Record<`${string}.${"zero" | "two" | "few" | "many"}`, string>>;
