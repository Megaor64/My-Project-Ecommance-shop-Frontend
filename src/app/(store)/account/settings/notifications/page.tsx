import type { Metadata } from "next";
import { NotificationsForm } from "@/features/settings/components/NotificationsForm";
import { SettingsPageClient } from "@/features/settings/components/SettingsPageClient";

export const metadata: Metadata = {
  title: "התראות — Folio Books",
};

export default function NotificationsSettingsPage() {
  return (
    <SettingsPageClient section="notifications">
      <div>
        <h1 className="font-playfair text-2xl text-ink">התראות</h1>
        <p className="mt-2 font-lora text-sm text-warm-gray">
          בחר כיצד לקבל עדכונים
        </p>
        <div className="mt-6">
          <NotificationsForm />
        </div>
      </div>
    </SettingsPageClient>
  );
}
