"use client";

import { BookCard3D } from "@/components/books/BookCard3D";
import { useSearch } from "@/components/providers/SearchProvider";
import type { Book } from "@/features/products/types";

type BooksGridProps = {
  books: Book[];
};

export function BooksGrid({ books: allBooks }: BooksGridProps) {
  const { filter } = useSearch();
  const books = filter(allBooks);

  if (books.length === 0) {
    return (
      <p className="font-lora text-center text-warm-gray">
        No books match your search. Try adjusting filters.
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
