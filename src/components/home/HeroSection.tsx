"use client";

import Link from "next/link";
import { useEffect } from "react";
import { BookCard3D } from "@/components/books/BookCard3D";
import { Button } from "@/components/ui/button";
import { fetchProducts } from "@/features/products/store/thunks";
import {
  selectHeroBooks,
  selectProductsError,
  selectProductsLoading,
} from "@/features/products/store/selectors";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export function HeroSection() {
  const dispatch = useAppDispatch();
  const heroBooks = useAppSelector(selectHeroBooks);
  const loading = useAppSelector(selectProductsLoading);
  const error = useAppSelector(selectProductsError);

  useEffect(() => {
    if (heroBooks.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, heroBooks.length]);

  return (
    <section className="relative overflow-hidden border-b border-border/50">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
        aria-hidden
      />
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 md:grid-cols-2 md:py-24 lg:gap-16">
        <div className="animate-fade-in-up flex flex-col justify-center">
          <p className="font-lora text-sm uppercase tracking-[0.25em] text-gold">
            Literary Bookstore
          </p>
          <h1 className="mt-4 font-playfair text-4xl font-semibold leading-tight text-ink md:text-5xl lg:text-6xl">
            Stories worth
            <span className="block text-burgundy">slowing down for</span>
          </h1>
          <p className="mt-6 max-w-md font-lora text-base leading-relaxed text-warm-gray">
            Curated fiction, poetry, and essays chosen for readers who linger
            over language and leave with arms full of possibility.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button asChild className="rounded-md font-lora normal-case tracking-normal">
              <Link href="/books">Browse the shelves</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-md border-ink/20 font-lora normal-case tracking-normal"
            >
              <Link href="/register">Join Folio</Link>
            </Button>
          </div>
        </div>
        <div className="relative -mx-4 flex max-w-[100vw] items-center justify-start gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:max-w-none sm:justify-center sm:gap-4 sm:overflow-visible sm:pb-0 md:gap-6">
          {loading && heroBooks.length === 0 ? (
            <p className="font-lora text-sm text-warm-gray">Loading featured books…</p>
          ) : error && heroBooks.length === 0 ? (
            <p className="font-lora text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : heroBooks.length === 0 ? (
            <p className="font-lora text-sm text-warm-gray">No books in the catalog yet.</p>
          ) : (
            heroBooks.map((book, i) => (
              <div
                key={book.id}
                className="animate-fade-in-up shrink-0"
                style={{ animationDelay: `${i * 0.15}s`, opacity: 0 }}
              >
                <BookCard3D
                  book={book}
                  compact
                  showAddToCart={false}
                  className={i === 1 ? "scale-110" : "opacity-90"}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
