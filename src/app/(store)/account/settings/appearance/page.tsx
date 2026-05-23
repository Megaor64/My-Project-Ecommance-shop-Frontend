import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AppearanceForm } from "@/features/settings/components/AppearanceForm";
import { SettingsPageClient } from "@/features/settings/components/SettingsPageClient";
import { fetchSettingsServer } from "@/features/settings/services/settingsServer";
import { getServerUser } from "@/lib/auth-server";

export const metadata: Metadata = {
  title: "עיצוב — Folio Books",
};

export default async function AppearanceSettingsPage() {
  const user = await getServerUser();
  if (!user) redirect("/login?from=/account/settings/appearance");

  const settings = await fetchSettingsServer(user.id);
  if (!settings) {
    return (
      <SettingsPageClient section="appearance">
        <p className="font-lora text-warm-gray">טוען הגדרות…</p>
      </SettingsPageClient>
    );
  }

  return (
    <SettingsPageClient section="appearance" initialSettings={settings}>
      <div>
        <h1 className="font-playfair text-2xl text-ink">עיצוב</h1>
        <p className="mt-2 font-lora text-sm text-warm-gray">
          ערכת נושא, שפה ותצוגה
        </p>
        <div className="mt-6">
          <AppearanceForm initialValues={settings.appearance} />
        </div>
      </div>
    </SettingsPageClient>
  );
}
