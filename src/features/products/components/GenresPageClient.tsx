"use client";

import { BookCard3D } from "@/components/books/BookCard3D";
import { useSearch } from "@/components/providers/SearchProvider";
import { useSyncSearchFromUrl } from "@/hooks/useSyncSearchFromUrl";
import type { Book } from "@/features/products/types";
import { groupBooksByGenre } from "@/features/products/utils/mapProductToBook";
import { useHydrateProducts } from "@/features/products/hooks/useHydrateProducts";
import {
  selectBooks,
  selectProductsError,
} from "@/features/products/store/selectors";
import { useAppSelector } from "@/store/hooks";

type GenresPageClientProps = {
  initialBooks: Book[];
};

export function GenresPageClient({ initialBooks }: GenresPageClientProps) {
  useSyncSearchFromUrl();
  const { filter } = useSearch();
  useHydrateProducts(initialBooks);
  const books = useAppSelector(selectBooks);
  const error = useAppSelector(selectProductsError);
  const displayBooks = books.length > 0 ? books : initialBooks;
  const filteredBooks = filter(displayBooks);
  const grouped = groupBooksByGenre(filteredBooks);
  const genres = Object.keys(grouped).sort();

  if (error && displayBooks.length === 0) {
    return (
      <p className="font-lora text-center text-destructive" role="alert">
        {error}
      </p>
    );
  }

  if (genres.length === 0) {
    return (
      <p className="font-lora text-center text-warm-gray">
        {displayBooks.length === 0
          ? "No genres to display yet."
          : "No books match your search. Try adjusting filters."}
      </p>
    );
  }

  return (
    <div className="space-y-14">
      {genres.map((genre) => (
        <section key={genre}>
          <h2 className="border-b border-gold/30 pb-2 font-playfair text-2xl font-semibold text-ink">
            {genre}
          </h2>
          <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4 lg:gap-8">
            {grouped[genre].map((book) => (
              <li key={book.id}>
                <BookCard3D book={book} compact />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
