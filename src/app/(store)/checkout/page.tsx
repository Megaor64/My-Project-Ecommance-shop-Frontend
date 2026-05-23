import type { Metadata } from "next";
import { CheckoutPageClient } from "@/features/orders/components/CheckoutPageClient";

export const metadata: Metadata = {
  title: "Checkout — Folio Books",
  description: "Complete your order with shipping details.",
};

export default function CheckoutPage() {
  return <CheckoutPageClient />;
}
