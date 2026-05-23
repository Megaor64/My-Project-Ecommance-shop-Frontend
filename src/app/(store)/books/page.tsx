import type { Metadata } from "next";
import { Suspense } from "react";
import { BooksPageClient } from "@/features/products/components/BooksPageClient";
import { fetchProductsServer } from "@/features/products/services/productServer";

export const metadata: Metadata = {
  title: "Books — Folio Books",
  description: "Browse our full collection of literary fiction, poetry, and essays.",
};

export default async function BooksPage() {
  let books: Awaited<ReturnType<typeof fetchProductsServer>> = [];
  let error: string | null = null;

  try {
    books = await fetchProductsServer();
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load products";
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:py-14">
      <header className="mb-10">
        <h1 className="font-playfair text-3xl font-semibold text-ink md:text-4xl">
          The collection
        </h1>
        <p className="mt-2 font-lora text-warm-gray">
          Browse our full shelf — search by title, author, or genre, and set a maximum price.
        </p>
      </header>
      {error && books.length === 0 ? (
        <p className="font-lora text-center text-destructive" role="alert">
          {error}
        </p>
      ) : (
        <Suspense
          fallback={
            <p className="font-lora text-center text-warm-gray">Loading the collection…</p>
          }
        >
          <BooksPageClient initialBooks={books} />
        </Suspense>
      )}
    </div>
  );
}
