"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Minus, Plus, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import type { Book } from "@/features/products/types";
import { addToCart } from "@/features/cart/store/thunks";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useFormatPrice } from "@/hooks/useFormatPrice";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type BookOrderPageClientProps = {
  book: Book;
};

const LOW_STOCK_THRESHOLD = 5;

export function BookOrderPageClient({ book: initialBook }: BookOrderPageClientProps) {
  const dispatch = useAppDispatch();
  const formatPrice = useFormatPrice();
  const t = useT();
  const refreshedBook = useAppSelector((state) =>
    state.products.books.find((b) => b.id === initialBook.id)
  );
  const book = refreshedBook ?? initialBook;
  const maxQuantity = book.stock > 0 ? book.stock : 1;
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  const atMax = book.stock > 0 && quantity >= book.stock;
  const outOfStock = book.stock === 0;
  const showLowStock =
    book.stock > 0 && book.stock <= LOW_STOCK_THRESHOLD;

  async function handleAddToCart() {
    if (outOfStock) return;
    setAdding(true);
    try {
      await dispatch(addToCart({ book, quantity })).unwrap();
      toast.success(t("book.addedToBag", { title: book.title }));
    } catch (err) {
      toast.error(typeof err === "string" ? err : t("book.addFailed"));
    } finally {
      setAdding(false);
    }
  }

  return (
    <div>
      <Link
        href="/books"
        className="mb-8 inline-flex items-center gap-2 font-lora text-sm text-warm-gray transition-colors hover:text-gold"
      >
        <ArrowLeft className="size-4 rtl:rotate-180" />
        {t("book.backToCollection")}
      </Link>

      <div className="grid gap-10 md:grid-cols-2 md:gap-14 md:items-start">
        <div className="flex justify-center">
          <article className="book" aria-label={t("book.coverAria", { title: book.title })}>
            <div className="relative mx-auto h-72 w-48 sm:h-80 sm:w-56 md:h-96 md:w-64">
              <div className="book-cover relative h-full w-full overflow-hidden rounded-sm shadow-lg">
                {book.coverImage ? (
                  <Image
                    src={book.coverImage}
                    alt={t("book.coverAlt", { title: book.title })}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 192px, 256px"
                    priority
                  />
                ) : (
                  <div
                    className="flex h-full w-full flex-col justify-between p-5"
                    style={{ background: book.coverColor }}
                  >
                    <p className="font-playfair text-xs font-semibold uppercase tracking-widest text-cream/80">
                      {book.genre}
                    </p>
                    <div>
                      <p className="font-playfair text-lg font-semibold leading-tight text-cream">
                        {book.title}
                      </p>
                      <p className="mt-2 font-lora text-sm text-cream/75">
                        {book.author}
                      </p>
                    </div>
                  </div>
                )}
                <span className="book-spine" aria-hidden />
              </div>
            </div>
          </article>
        </div>

        <div>
          <p className="font-lora text-sm uppercase tracking-widest text-warm-gray">
            {book.genre}
          </p>
          <h1 className="mt-2 font-playfair text-3xl font-semibold text-ink md:text-4xl">
            {book.title}
          </h1>
          <p className="mt-2 font-lora text-lg text-warm-gray">{t("book.byAuthor", { author: book.author })}</p>
          <p className="mt-4 font-lora leading-relaxed text-warm-gray whitespace-pre-line">
            {book.description}
          </p>
          <p className="mt-4 font-lora text-2xl text-gold">
            {formatPrice(book.price)}
          </p>

          {showLowStock ? (
            <p className="mt-4 font-lora text-sm text-burgundy">
              {t.plural("book.lowStock", book.stock)}
            </p>
          ) : null}

          {outOfStock ? (
            <p className="mt-4 font-lora text-sm text-destructive">
              {t("book.currentlyOutOfStock")}
            </p>
          ) : null}

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <span className="font-lora text-sm text-warm-gray">{t("book.quantity")}</span>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                aria-label={t("book.decreaseQuantity")}
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="size-3" />
              </Button>
              <span className="min-w-8 text-center font-lora text-sm">
                {quantity}
              </span>
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                aria-label={t("book.increaseQuantity")}
                onClick={() =>
                  setQuantity((q) => Math.min(maxQuantity, q + 1))
                }
                disabled={atMax || outOfStock}
              >
                <Plus className="size-3" />
              </Button>
            </div>
          </div>

          <Button
            type="button"
            className={cn(
              "mt-6 w-full rounded-md font-lora normal-case tracking-normal sm:w-auto sm:min-w-48"
            )}
            onClick={handleAddToCart}
            disabled={outOfStock || adding}
          >
            <ShoppingBag className="me-2 size-4" />
            {outOfStock
              ? t("book.outOfStock")
              : adding
                ? t("book.adding")
                : t("book.addToBag")}
          </Button>
        </div>
      </div>
    </div>
  );
}
