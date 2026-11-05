"use client";

import { BookCard3D } from "@/components/books/BookCard3D";
import { useSearch } from "@/components/providers/SearchProvider";
import type { Book } from "@/features/products/types";
import { useT } from "@/lib/i18n";

type BooksGridProps = {
  books: Book[];
};

export function BooksGrid({ books: allBooks }: BooksGridProps) {
  const { filter } = useSearch();
  const t = useT();
  const books = filter(allBooks);

  if (books.length === 0) {
    return (
      <p className="font-lora text-center text-warm-gray">
        {t("books.noMatch")}
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4 lg:gap-8">
      {books.map((book) => (
        <li key={book.id} id={book.id}>
          <BookCard3D book={book} />
        </li>
      ))}
    </ul>
  );
}
