"use client";

import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import type { Book } from "@/features/products/types";
import { addToCart } from "@/features/cart/store/thunks";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/store/hooks";
import { cn } from "@/lib/utils";

type AddToCartButtonProps = {
  book: Book;
  className?: string;
  compact?: boolean;
};

export function AddToCartButton({ book, className, compact }: AddToCartButtonProps) {
  const dispatch = useAppDispatch();

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    try {
      await dispatch(addToCart({ book })).unwrap();
      toast.success(`Added "${book.title}" to your bag`);
    } catch (err) {
      toast.error(typeof err === "string" ? err : "Could not add to cart");
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
      <ShoppingBag className="mr-2 size-4" />
      Add to bag
    </Button>
  );
}
