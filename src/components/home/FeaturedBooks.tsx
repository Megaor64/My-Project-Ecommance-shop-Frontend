"use client";

import { useEffect } from "react";
import Link from "next/link";
import { BookCard3D } from "@/components/books/BookCard3D";
import { Button } from "@/components/ui/button";
import { fetchProducts } from "@/features/products/store/thunks";
import {
  selectBooks,
  selectProductsError,
  selectProductsLoading,
} from "@/features/products/store/selectors";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { cn } from "@/lib/utils";

export function FeaturedBooks() {
  const dispatch = useAppDispatch();
  const books = useAppSelector(selectBooks);
  const loading = useAppSelector(selectProductsLoading);
  const error = useAppSelector(selectProductsError);

  useEffect(() => {
    if (books.length === 0) {
      void dispatch(fetchProducts());
    }
  }, [dispatch, books.length]);

  const featured = books.slice(0, 4);

  return (
    <section className="bg-cream py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:flex-wrap sm:items-end">
          <div>
            <p className="font-lora text-sm uppercase tracking-[0.2em] text-gold">
              Curated picks
            </p>
            <h2 className="mt-2 font-playfair text-3xl font-semibold text-ink md:text-4xl">
              Featured volumes
            </h2>
          </div>
          <Button
            asChild
            variant="outline"
            className="rounded-md border-ink/20 font-lora normal-case tracking-normal"
          >
            <Link href="/books">View all books</Link>
          </Button>
        </div>

        {loading && featured.length === 0 ? (
          <p className="mt-12 font-lora text-center text-warm-gray">
            Loading featured books…
          </p>
        ) : error ? (
          <p className="mt-12 font-lora text-center text-destructive" role="alert">
            {error}
          </p>
        ) : featured.length === 0 ? (
          <p className="mt-12 font-lora text-center text-warm-gray">
            No books in the catalog yet.
          </p>
        ) : (
          <ul className="mt-12 space-y-16">
            {featured.map((book, index) => {
              const reversed = index % 2 === 1;
              return (
                <li
                  key={book.id}
                  className={cn(
                    "grid items-center gap-8 md:grid-cols-2 md:gap-12",
                    reversed && "md:[&>*:first-child]:order-2"
                  )}
                >
                  <BookCard3D book={book} className="mx-auto md:mx-0" />
                  <div
                    className={cn("max-w-md", reversed ? "md:mr-auto" : "md:ml-auto")}
                  >
                    <p className="font-lora text-xs uppercase tracking-widest text-gold">
                      {book.genre}
                    </p>
                    <h3 className="mt-2 font-playfair text-2xl font-semibold text-ink">
                      {book.title}
                    </h3>
                    <p className="mt-1 font-lora text-sm text-warm-gray">
                      by {book.author}
                    </p>
                    <p className="mt-4 font-lora text-sm leading-relaxed text-warm-gray line-clamp-4">
                      {book.description}
                    </p>
                    <p className="mt-4 font-playfair text-lg text-gold">
                      ${book.price.toFixed(2)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
