"use client";

import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import type { Book } from "@/features/products/types";
import { addToCart } from "@/features/cart/store/thunks";
import { Button } from "@/components/ui/button";
import { useT } from "@/lib/i18n";
import { useAppDispatch } from "@/store/hooks";
import { cn } from "@/lib/utils";

type AddToCartButtonProps = {
  book: Book;
  className?: string;
  compact?: boolean;
};

export function AddToCartButton({ book, className, compact }: AddToCartButtonProps) {
  const dispatch = useAppDispatch();
  const t = useT();

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    try {
      await dispatch(addToCart({ book })).unwrap();
      toast.success(t("book.addedToBag", { title: book.title }));
    } catch (err) {
      toast.error(typeof err === "string" ? err : t("book.addFailed"));
    }
  }

  return (
    <Button
      type="button"
      size={compact ? "sm" : "default"}
      variant="outline"
      className={cn(
        "mt-3 w-full rounded-md border-gold/40 font-lora normal-case tracking-normal",
        className
      )}
      onClick={handleClick}
    >
      <ShoppingBag className="me-2 size-4" />
      {t("book.addToBag")}
    </Button>
  );
}
