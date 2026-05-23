import type { Metadata } from "next";
import { InquiriesPanel } from "@/components/admin/InquiriesPanel";

export const metadata: Metadata = {
  title: "Inquiries — Folio Staff",
  description: "Review and reply to customer contact messages.",
};

export default function AdminInquiriesPage() {
  return (
    <div>
      <h1 className="font-playfair text-2xl font-semibold text-ink md:text-3xl">
        Customer inquiries
      </h1>
      <p className="mt-2 font-lora text-sm text-warm-gray">
        Messages from the contact form are stored securely on the server.
      </p>
      <div className="mt-8">
        <InquiriesPanel />
      </div>
    </div>
  );
}
