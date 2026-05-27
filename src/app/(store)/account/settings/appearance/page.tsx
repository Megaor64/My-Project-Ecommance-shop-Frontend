import type { Metadata } from "next";
import { AppearanceForm } from "@/features/settings/components/AppearanceForm";
import { SettingsPageClient } from "@/features/settings/components/SettingsPageClient";

export const metadata: Metadata = {
  title: "מראה — Folio Books",
};

export default function AppearanceSettingsPage() {
  return (
    <SettingsPageClient section="appearance">
      <div>
        <h1 className="font-playfair text-2xl text-ink">מראה</h1>
        <p className="mt-2 font-lora text-sm text-warm-gray">
          ערכת נושא וגודל טקסט
        </p>
        <div className="mt-6">
          <AppearanceForm />
        </div>
      </div>
    </SettingsPageClient>
  );
}
