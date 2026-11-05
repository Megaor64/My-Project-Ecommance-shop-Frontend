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

  const theme = appearance?.theme;
  useEffect(() => {
    if (theme) setTheme(theme);
  }, [theme, setTheme]);

  return null;
}
