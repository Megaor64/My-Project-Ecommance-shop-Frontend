import type { Metadata } from "next";
import { T } from "@/components/i18n/T";
import { SecurityForm } from "@/features/settings/components/SecurityForm";
import { SettingsPageClient } from "@/features/settings/components/SettingsPageClient";

export const metadata: Metadata = {
  title: "Security — Folio Books",
};

export default function SecuritySettingsPage() {
  return (
    <SettingsPageClient section="security">
      <div>
        <h1 className="font-playfair text-2xl text-ink">
          <T k="settings.security.title" />
        </h1>
        <p className="mt-2 font-lora text-sm text-warm-gray">
          <T k="settings.security.subtitle" />
        </p>
        <div className="mt-6">
          <SecurityForm />
        </div>
      </div>
    </SettingsPageClient>
  );
}
