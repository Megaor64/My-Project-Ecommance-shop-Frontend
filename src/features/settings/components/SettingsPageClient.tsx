"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { selectAuthLoading, selectUser } from "@/features/auth/store/selectors";
import type { UserSettings } from "@/features/settings/types";
import { selectSettings, selectSettingsStatus } from "@/features/settings/store/selectors";
import { hydrateSettings } from "@/features/settings/store/slice";
import { fetchSettings } from "@/features/settings/store/thunks";
import { useT } from "@/lib/i18n";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

type SettingsPageClientProps = {
  section: "appearance" | "notifications" | "security";
  initialSettings?: UserSettings;
  children: React.ReactNode;
};

export function SettingsPageClient({
  section,
  initialSettings,
  children,
}: SettingsPageClientProps) {
  const dispatch = useAppDispatch();
  const t = useT();
  const router = useRouter();
  const user = useAppSelector(selectUser);
  const isLoading = useAppSelector(selectAuthLoading);
  const settings = useAppSelector(selectSettings);
  const settingsStatus = useAppSelector(selectSettingsStatus);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace(`/login?from=/account/settings/${section}`);
    }
  }, [isLoading, user, router, section]);

  useEffect(() => {
    if (initialSettings) {
      dispatch(hydrateSettings(initialSettings));
    } else if (user) {
      void dispatch(fetchSettings(user.id));
    }
  }, [dispatch, initialSettings, user]);

  if (isLoading || (user && settingsStatus === "loading" && !settings)) {
    return <p className="font-lora text-warm-gray">{t("common.loading")}</p>;
  }

  if (!user) return null;

  return <>{children}</>;
}
