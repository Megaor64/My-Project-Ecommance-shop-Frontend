import type { Metadata } from "next";
import { BookPageClient } from "@/features/products/components/BookPageClient";

export const metadata: Metadata = {
  title: "Book — Folio Books",
};

export default function BookPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:py-14">
      <BookPageClient />
    </div>
  );
}

