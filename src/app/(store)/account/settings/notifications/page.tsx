import type { Metadata } from "next";
import { T } from "@/components/i18n/T";
import { NotificationsForm } from "@/features/settings/components/NotificationsForm";
import { SettingsPageClient } from "@/features/settings/components/SettingsPageClient";

export const metadata: Metadata = {
  title: "Notifications — Folio Books",
};

export default function NotificationsSettingsPage() {
  return (
    <SettingsPageClient section="notifications">
      <div>
        <h1 className="font-playfair text-2xl text-ink">
          <T k="settings.notifications.title" />
        </h1>
        <p className="mt-2 font-lora text-sm text-warm-gray">
          <T k="settings.notifications.subtitle" />
        </p>
        <div className="mt-6">
          <NotificationsForm />
        </div>
      </div>
    </SettingsPageClient>
  );
}
