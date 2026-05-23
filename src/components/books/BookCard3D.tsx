"use client";

import Image from "next/image";
import Link from "next/link";
import type { Book } from "@/features/products/types";
import { AddToCartButton } from "@/features/cart/components/AddToCartButton";
import { cn } from "@/lib/utils";

type BookCard3DProps = {
  book: Book;
  className?: string;
  compact?: boolean;
  showAddToCart?: boolean;
};

export function BookCard3D({
  book,
  className,
  compact,
  showAddToCart = true,
}: BookCard3DProps) {
  return (
    <article
      className={cn("book group", className)}
      aria-label={`${book.title} by ${book.author}`}
    >
      <Link href={`/books/${book.id}`} className="block">
        <div
          className={cn(
            "relative mx-auto",
            compact ? "h-48 w-32" : "h-64 w-44"
          )}
        >
          <div className="book-cover relative h-full w-full overflow-hidden rounded-sm shadow-lg">
            {book.coverImage ? (
              <Image
                src={book.coverImage}
                alt={`Cover of ${book.title}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 128px, 176px"
              />
            ) : (
              <div
                className="flex h-full w-full flex-col justify-between p-3"
                style={{ background: book.coverColor }}
              >
                <p className="font-playfair text-[10px] font-semibold uppercase tracking-widest text-cream/80">
                  {book.genre}
                </p>
                <div>
                  <p
                    className={cn(
                      "font-playfair font-semibold leading-tight text-cream",
                      compact ? "text-xs" : "text-sm"
                    )}
                  >
                    {book.title}
                  </p>
                  <p className="mt-1 font-lora text-[10px] text-cream/75">
                    {book.author}
                  </p>
                </div>
              </div>
            )}
            <span className="book-spine" aria-hidden />
          </div>
        </div>
        <div className="mt-4 text-center">
          <h3 className="font-playfair text-base font-semibold text-ink line-clamp-2">
            {book.title}
          </h3>
          <p className="mt-1 font-lora text-sm text-warm-gray">{book.author}</p>
          <p className="mt-2 font-lora text-sm text-gold">
            ${book.price.toFixed(2)}
          </p>
        </div>
      </Link>
      {showAddToCart ? (
        <AddToCartButton book={book} compact={compact} />
      ) : null}
    </article>
  );
}
