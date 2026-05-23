import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { NotificationsForm } from "@/features/settings/components/NotificationsForm";
import { SettingsPageClient } from "@/features/settings/components/SettingsPageClient";
import { fetchSettingsServer } from "@/features/settings/services/settingsServer";
import { getServerUser } from "@/lib/auth-server";

export const metadata: Metadata = {
  title: "התראות — Folio Books",
};

export default async function NotificationsSettingsPage() {
  const user = await getServerUser();
  if (!user) redirect("/login?from=/account/settings/notifications");

  const settings = await fetchSettingsServer(user.id);
  if (!settings) {
    return (
      <SettingsPageClient section="notifications">
        <p className="font-lora text-warm-gray">טוען הגדרות…</p>
      </SettingsPageClient>
    );
  }

  return (
    <SettingsPageClient section="notifications" initialSettings={settings}>
      <div>
        <h1 className="font-playfair text-2xl text-ink">התראות</h1>
        <p className="mt-2 font-lora text-sm text-warm-gray">
          בחר כיצד לקבל עדכונים
        </p>
        <div className="mt-6">
          <NotificationsForm initialValues={settings.notifications} />
        </div>
      </div>
    </SettingsPageClient>
  );
}
