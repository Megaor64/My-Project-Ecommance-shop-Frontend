import type { Metadata } from "next";
import { Suspense } from "react";
import { T } from "@/components/i18n/T";
import { BooksPageClient } from "@/features/products/components/BooksPageClient";

export const metadata: Metadata = {
  title: "Books — Folio Books",
  description: "Browse our full collection of literary fiction, poetry, and essays.",
};

export default function BooksPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:py-14">
      <header className="mb-10">
        <h1 className="font-playfair text-3xl font-semibold text-ink md:text-4xl">
          <T k="books.title" />
        </h1>
        <p className="mt-2 font-lora text-warm-gray">
          <T k="books.subtitle" />
        </p>
      </header>
      <Suspense
        fallback={
          <p className="font-lora text-center text-warm-gray"><T k="books.loading" /></p>
        }
      >
        <BooksPageClient initialBooks={[]} />
      </Suspense>
    </div>
  );
}
