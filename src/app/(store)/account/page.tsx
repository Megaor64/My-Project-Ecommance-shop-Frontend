import type { Metadata } from "next";
import { AccountPageClient } from "@/components/account/AccountPageClient";

export const metadata: Metadata = {
  title: "Account — Folio Books",
  description: "Manage your profile, settings, and order history.",
};

export default function AccountPage() {
  return <AccountPageClient />;
}
