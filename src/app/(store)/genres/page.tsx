import type { Metadata } from "next";
import { Suspense } from "react";
import { GenresPageClient } from "@/features/products/components/GenresPageClient";

export const metadata: Metadata = {
  title: "Genres — Folio Books",
  description: "Explore books by genre — fiction, poetry, essays, and more.",
};

export default function GenresPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:py-14">
      <header className="mb-10">
        <h1 className="font-playfair text-3xl font-semibold text-ink md:text-4xl">
          Genres
        </h1>
        <p className="mt-2 font-lora text-warm-gray">
          Wander by mood — search by title, author, or genre, and set a maximum price.
        </p>
      </header>
      <Suspense
        fallback={
          <p className="font-lora text-center text-warm-gray">Loading genres…</p>
        }
      >
        <GenresPageClient initialBooks={[]} />
      </Suspense>
    </div>
  );
}
