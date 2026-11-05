"use client";

import { useT, type TranslationKey, type TranslationVars } from "@/lib/i18n";

type TProps = {
  k: TranslationKey;
  vars?: TranslationVars;
};

/**
 * Renders a translated string. Lets server components (pages with static
 * metadata) show per-user translated copy without becoming client components.
 */
export function T({ k, vars }: TProps) {
  const t = useT();
  return <>{t(k, vars)}</>;
}
