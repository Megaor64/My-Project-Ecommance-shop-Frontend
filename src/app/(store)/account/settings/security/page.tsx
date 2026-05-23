import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SecurityForm } from "@/features/settings/components/SecurityForm";
import { getServerUser } from "@/lib/auth-server";

export const metadata: Metadata = {
  title: "אבטחה — Folio Books",
};

export default async function SecuritySettingsPage() {
  const user = await getServerUser();
  if (!user) redirect("/login?from=/account/settings/security");

  return (
    <div>
      <h1 className="font-playfair text-2xl text-ink">אבטחה</h1>
      <p className="mt-2 font-lora text-sm text-warm-gray">
        סיסמה ומחיקת חשבון
      </p>
      <div className="mt-6">
        <SecurityForm />
      </div>
    </div>
  );
}
