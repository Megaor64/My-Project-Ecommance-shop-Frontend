"use client";

import { BooksGrid } from "@/components/books/BooksGrid";
import { useSyncSearchFromUrl } from "@/hooks/useSyncSearchFromUrl";
import type { Book } from "@/features/products/types";
import { useHydrateProducts } from "@/features/products/hooks/useHydrateProducts";
import {
  selectBooks,
  selectProductsError,
  selectProductsLoading,
} from "@/features/products/store/selectors";
import { useT } from "@/lib/i18n";
import { useAppSelector } from "@/store/hooks";

type BooksPageClientProps = {
  initialBooks: Book[];
};

export function BooksPageClient({ initialBooks }: BooksPageClientProps) {
  useSyncSearchFromUrl();
  const t = useT();
  useHydrateProducts(initialBooks);
  const books = useAppSelector(selectBooks);
  const loading = useAppSelector(selectProductsLoading);
  const error = useAppSelector(selectProductsError);
  const displayBooks = books.length > 0 ? books : initialBooks;

  if (loading && displayBooks.length === 0) {
    return (
      <p className="font-lora text-center text-warm-gray">{t("books.loading")}</p>
    );
  }

  if (error && displayBooks.length === 0) {
    return (
      <p className="font-lora text-center text-destructive" role="alert">
        {error}
      </p>
    );
  }

  return <BooksGrid books={displayBooks} />;
}
