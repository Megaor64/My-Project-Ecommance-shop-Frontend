import type { AxiosError } from "axios";
import { DEFAULT_APPEARANCE } from "@/lib/appearance";
import type { Language } from "@/features/settings/types";
import { translate } from "./translate";
import type { TranslationKey } from "./types";

type AppearanceState = {
  settings: {
    settings?: { appearance?: { language?: Language } } | null;
  };
};

/** Server-provided error text, if the API included a `message`. */
export function getApiErrorMessage(error: unknown): string | undefined {
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const message = axiosError.response?.data?.message;
    if (typeof message === "string" && message.trim()) return message;
  }
  return undefined;
}

export function translateFromState(
  state: AppearanceState,
  key: TranslationKey
): string {
  const language =
    state.settings.settings?.appearance?.language ?? DEFAULT_APPEARANCE.language;
  return translate(language, key);
}

/** Prefer the API message; otherwise translate `key` in the user's language. */
export function rejectMessage(
  error: unknown,
  state: AppearanceState,
  key: TranslationKey
): string {
  return getApiErrorMessage(error) ?? translateFromState(state, key);
}
