"use client";

import { useCallback } from "react";
import { selectAppearance } from "@/features/settings/store/selectors";
import { formatPrice } from "@/lib/currency";
import { useAppSelector } from "@/store/hooks";

/**
 * Returns a function that formats a USD amount in the signed-in user's saved
 * display currency and language (defaults: USD, English).
 */
export function useFormatPrice() {
  const { currency, language } = useAppSelector(selectAppearance);
  return useCallback(
    (amountUsd: number) => formatPrice(amountUsd, currency, language),
    [currency, language]
  );
}
