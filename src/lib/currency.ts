import type { Language } from "@/features/settings/types";
import { getLocale } from "@/lib/i18n/locales";

/**
 * Prices are stored in USD in the database. Only the *display* is converted,
 * using the fixed rates below. Orders are always created and charged in USD.
 */
export const BASE_CURRENCY = "USD";

export const CURRENCY_RATES = {
  USD: 1,
  ILS: 3.7,
  EUR: 0.92,
} as const;

export type SupportedCurrency = keyof typeof CURRENCY_RATES;

export function isSupportedCurrency(value: string): value is SupportedCurrency {
  return Object.prototype.hasOwnProperty.call(CURRENCY_RATES, value);
}

const formatterCache = new Map<string, Intl.NumberFormat>();

function getFormatter(currency: SupportedCurrency, language: Language) {
  const key = `${language}:${currency}`;
  let formatter = formatterCache.get(key);
  if (!formatter) {
    formatter = new Intl.NumberFormat(getLocale(language), {
      style: "currency",
      currency,
    });
    formatterCache.set(key, formatter);
  }
  return formatter;
}

/** Converts a USD amount into the given display currency (unknown -> USD). */
export function convertFromUsd(amountUsd: number, currency: string): number {
  const code = isSupportedCurrency(currency) ? currency : BASE_CURRENCY;
  return amountUsd * CURRENCY_RATES[code];
}

/**
 * Formats a USD amount for display in the user's currency and language.
 * Unsupported currency codes fall back to USD.
 */
export function formatPrice(
  amountUsd: number,
  currency: string = BASE_CURRENCY,
  language: Language = "en"
): string {
  const code: SupportedCurrency = isSupportedCurrency(currency)
    ? currency
    : BASE_CURRENCY;
  const amount = Number.isFinite(amountUsd) ? amountUsd : 0;
  return getFormatter(code, language).format(amount * CURRENCY_RATES[code]);
}
