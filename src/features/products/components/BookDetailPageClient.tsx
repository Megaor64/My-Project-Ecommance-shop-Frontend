"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BookOrderPageClient } from "@/features/products/components/BookOrderPageClient";
import { fetchProductById } from "@/features/products/store/thunks";
import {
  selectBooks,
  selectProductsError,
  selectProductsLoading,
} from "@/features/products/store/selectors";
import { useT } from "@/lib/i18n";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

type BookDetailPageClientProps = {
  id: string;
};

export function BookDetailPageClient({ id }: BookDetailPageClientProps) {
  const dispatch = useAppDispatch();
  const t = useT();
  const books = useAppSelector(selectBooks);
  const loading = useAppSelector(selectProductsLoading);
  const error = useAppSelector(selectProductsError);
  const book = books.find((item) => item.id === id);

  useEffect(() => {
    if (!book) {
      void dispatch(fetchProductById(id));
    }
  }, [dispatch, id, book]);

  if (!book && loading) {
    return (
      <p className="font-lora text-center text-warm-gray">{t("book.loadingDetails")}</p>
    );
  }

  if (!book && error) {
    return (
      <div className="text-center">
        <p className="font-lora text-destructive" role="alert">
          {error}
        </p>
        <Link
          href="/books"
          className="mt-4 inline-flex items-center gap-2 font-lora text-sm text-gold hover:underline"
        >
          <ArrowLeft className="size-4 rtl:rotate-180" />
          {t("book.backToCollection")}
        </Link>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="text-center">
        <p className="font-lora text-warm-gray">{t("book.notFound")}</p>
        <Link
          href="/books"
          className="mt-4 inline-flex items-center gap-2 font-lora text-sm text-gold hover:underline"
        >
          <ArrowLeft className="size-4 rtl:rotate-180" />
          {t("book.backToCollection")}
        </Link>
      </div>
    );
  }

  return <BookOrderPageClient book={book} />;
}
