import type { Metadata } from "next";
import { T } from "@/components/i18n/T";
import { AppearanceForm } from "@/features/settings/components/AppearanceForm";
import { SettingsPageClient } from "@/features/settings/components/SettingsPageClient";

export const metadata: Metadata = {
  title: "Appearance — Folio Books",
};

export default function AppearanceSettingsPage() {
  return (
    <SettingsPageClient section="appearance">
      <div>
        <h1 className="font-playfair text-2xl text-ink">
          <T k="settings.appearance.title" />
        </h1>
        <p className="mt-2 font-lora text-sm text-warm-gray">
          <T k="settings.appearance.subtitle" />
        </p>
        <div className="mt-6">
          <AppearanceForm />
        </div>
      </div>
    </SettingsPageClient>
  );
}
