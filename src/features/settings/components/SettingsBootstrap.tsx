"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { selectUser } from "@/features/auth/store/selectors";
import {
  selectSettings,
  selectSettingsStatus,
} from "@/features/settings/store/selectors";
import { fetchSettings } from "@/features/settings/store/thunks";
import type { AppearanceSettings } from "@/features/settings/types";
import {
  DEFAULT_APPEARANCE,
  applyAppearanceToDocument,
  clearCachedAppearance,
  readCachedAppearance,
  readLastCachedAppearance,
  writeCachedAppearance,
} from "@/lib/appearance";
import { getAuthToken } from "@/lib/auth-storage";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

/**
 * Loads the signed-in user's settings and applies their appearance to the
 * document (theme, html lang/dir, font size, compact mode). Appearance is
 * cached in localStorage per user to avoid a flash of defaults on reload.
 */
export function SettingsBootstrap() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const settings = useAppSelector(selectSettings);
  const status = useAppSelector(selectSettingsStatus);
  const { setTheme } = useTheme();
  const prevUserId = useRef<string | null>(null);

  const userId = user?.id ?? null;
  // Ignore settings that belong to a different account.
  const ownSettings =
    userId && settings && String(settings.userId) === String(userId)
      ? settings
      : null;

  useEffect(() => {
    if (!userId) return;
    const stale = settings && String(settings.userId) !== String(userId);
    if (status === "idle" || (stale && status !== "loading")) {
      void dispatch(fetchSettings(userId));
    }
  }, [dispatch, userId, settings, status]);

  // Drop the cache when the user logs out (user -> null transition).
  useEffect(() => {
    if (prevUserId.current && !userId) {
      clearCachedAppearance(prevUserId.current);
    }
    prevUserId.current = userId;
  }, [userId]);

  const appearance = ownSettings?.appearance ?? null;
  const appliedSavedThemeRef = useRef<string | null>(null);
  const prevUserIdForTheme = useRef<string | null>(userId);

  useEffect(() => {
    let effective: AppearanceSettings;
    if (appearance) {
      effective = appearance;
      if (userId) writeCachedAppearance(userId, appearance);
    } else if (userId) {
      effective = readCachedAppearance(userId) ?? DEFAULT_APPEARANCE;
    } else if (getAuthToken()) {
      // Session is being restored; use the last known appearance.
      effective = readLastCachedAppearance() ?? DEFAULT_APPEARANCE;
    } else {
      effective = DEFAULT_APPEARANCE;
    }
    applyAppearanceToDocument(effective);
  }, [appearance, userId]);

  // Apply the saved theme when it actually changes (account switch or Save).
  // Do not re-apply on every render — that would undo the navbar sun/moon
  // toggle, which is meant to override "system" and the saved theme.
  const savedTheme = appearance?.theme;
  useEffect(() => {
    if (!savedTheme) return;

    const prev = prevUserIdForTheme.current;
    const switchedAccounts = prev != null && prev !== userId;
    prevUserIdForTheme.current = userId;

    const signature = `${userId ?? "guest"}:${savedTheme}`;
    if (!switchedAccounts && appliedSavedThemeRef.current === signature) return;
    appliedSavedThemeRef.current = signature;

    // An explicit light/dark click in the navbar wins over a saved "system"
    // preference, including session restore (prev userId was still null).
    if (
      !switchedAccounts &&
      savedTheme === "system" &&
      typeof window !== "undefined"
    ) {
      const stored = window.localStorage.getItem("theme");
      if (stored === "light" || stored === "dark") return;
    }

    setTheme(savedTheme);
  }, [savedTheme, userId, setTheme]);

  return null;
}
