import type {
  AppearanceSettings,
  FontSize,
  Language,
} from "@/features/settings/types";

export const DEFAULT_APPEARANCE: AppearanceSettings = {
  theme: "system",
  language: "en",
  fontSize: "medium",
  compactMode: false,
  currency: "USD",
};

const CACHE_PREFIX = "folio.appearance.v1.";
const LAST_USER_KEY = "folio.appearance.lastUser";

const LANGUAGES: Language[] = ["he", "en", "ar"];
const FONT_SIZES: FontSize[] = ["small", "medium", "large"];

export function getDirection(language: Language): "rtl" | "ltr" {
  return language === "he" || language === "ar" ? "rtl" : "ltr";
}

function isBrowser() {
  return typeof window !== "undefined";
}

function sanitize(value: unknown): AppearanceSettings | null {
  if (!value || typeof value !== "object") return null;
  const v = value as Partial<AppearanceSettings>;
  return {
    theme:
      v.theme === "light" || v.theme === "dark" || v.theme === "system"
        ? v.theme
        : DEFAULT_APPEARANCE.theme,
    language: LANGUAGES.includes(v.language as Language)
      ? (v.language as Language)
      : DEFAULT_APPEARANCE.language,
    fontSize: FONT_SIZES.includes(v.fontSize as FontSize)
      ? (v.fontSize as FontSize)
      : DEFAULT_APPEARANCE.fontSize,
    compactMode:
      typeof v.compactMode === "boolean"
        ? v.compactMode
        : DEFAULT_APPEARANCE.compactMode,
    currency:
      typeof v.currency === "string" && v.currency
        ? v.currency
        : DEFAULT_APPEARANCE.currency,
  };
}

export function readCachedAppearance(
  userId: string
): AppearanceSettings | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(CACHE_PREFIX + userId);
    return raw ? sanitize(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

/** Cached appearance of the last signed-in user (used before /auth/me resolves). */
export function readLastCachedAppearance(): AppearanceSettings | null {
  if (!isBrowser()) return null;
  try {
    const userId = window.localStorage.getItem(LAST_USER_KEY);
    return userId ? readCachedAppearance(userId) : null;
  } catch {
    return null;
  }
}

export function writeCachedAppearance(
  userId: string,
  appearance: AppearanceSettings
) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(
      CACHE_PREFIX + userId,
      JSON.stringify(appearance)
    );
    window.localStorage.setItem(LAST_USER_KEY, userId);
  } catch {
    /* storage unavailable */
  }
}

export function clearCachedAppearance(userId?: string | null) {
  if (!isBrowser()) return;
  try {
    if (userId) window.localStorage.removeItem(CACHE_PREFIX + userId);
    const last = window.localStorage.getItem(LAST_USER_KEY);
    if (!userId || last === userId) {
      window.localStorage.removeItem(LAST_USER_KEY);
    }
  } catch {
    /* storage unavailable */
  }
}

/** Writes lang, dir, font size and compact attributes on <html>. */
export function applyAppearanceToDocument(appearance: AppearanceSettings) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.lang = appearance.language;
  root.dir = getDirection(appearance.language);
  root.dataset.fontSize = appearance.fontSize;
  root.dataset.compact = appearance.compactMode ? "true" : "false";
}
