"use client";

import { useMemo } from "react";
import { selectAppearance } from "@/features/settings/store/selectors";
import { getDirection } from "@/lib/appearance";
import { useAppSelector } from "@/store/hooks";
import { getLocale } from "./locales";
import { createTranslator, type Translator } from "./translate";

/**
 * Returns the translate function for the signed-in user's saved language
 * (English for visitors). It re-renders consumers when the language changes.
 *
 *   const t = useT();
 *   t("cart.checkout");
 *   t("book.addedToBag", { title });
 *   t.plural("cart.count", items.length);
 */
export function useT(): Translator {
  const { language } = useAppSelector(selectAppearance);
  return useMemo(() => createTranslator(language), [language]);
}

/** Language, text direction and Intl locale of the current user. */
export function useLocale() {
  const { language } = useAppSelector(selectAppearance);
  return useMemo(
    () => ({
      language,
      dir: getDirection(language),
      locale: getLocale(language),
    }),
    [language]
  );
}
