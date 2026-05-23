"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import { selectUser } from "@/features/auth/store/selectors";
import {
  selectSettings,
  selectSettingsStatus,
} from "@/features/settings/store/selectors";
import { fetchSettings } from "@/features/settings/store/thunks";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export function SettingsBootstrap() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const settings = useAppSelector(selectSettings);
  const status = useAppSelector(selectSettingsStatus);
  const { setTheme } = useTheme();

  useEffect(() => {
    if (user && status === "idle") {
      void dispatch(fetchSettings(user.id));
    }
  }, [dispatch, user, status]);

  useEffect(() => {
    if (!settings) return;
    const theme = settings.appearance.theme;
    if (theme === "light" || theme === "dark") {
      setTheme(theme);
    }
  }, [settings, setTheme]);

  return null;
}
