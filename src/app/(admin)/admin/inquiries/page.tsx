import type { Metadata } from "next";
import { T } from "@/components/i18n/T";
import { InquiriesPanel } from "@/components/admin/InquiriesPanel";

export const metadata: Metadata = {
  title: "Inquiries — Folio Staff",
  description: "Review and reply to customer contact messages.",
};

export default function AdminInquiriesPage() {
  return (
    <div>
      <h1 className="font-playfair text-2xl font-semibold text-ink md:text-3xl">
        <T k="admin.inquiries.title" />
      </h1>
      <p className="mt-2 font-lora text-sm text-warm-gray">
        <T k="admin.inquiries.subtitle" />
      </p>
      <div className="mt-8">
        <InquiriesPanel />
      </div>
    </div>
  );
}
