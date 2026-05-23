"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  selectCartCount,
  selectCartItems,
  selectCartSubtotal,
} from "@/features/cart/store/selectors";
import {
  clearCart,
  removeFromCart,
  updateCartItem,
} from "@/features/cart/store/thunks";
import { selectIsAuthenticated } from "@/features/auth/store/selectors";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export function CartSheet() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const count = useAppSelector(selectCartCount);
  const subtotal = useAppSelector(selectCartSubtotal);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  async function changeQuantity(productId: string, quantity: number) {
    if (quantity < 1) return;
    try {
      await dispatch(updateCartItem({ productId, quantity })).unwrap();
    } catch (err) {
      toast.error(typeof err === "string" ? err : "Could not update quantity");
    }
  }

  async function handleRemove(productId: string) {
    try {
      await dispatch(removeFromCart(productId)).unwrap();
    } catch (err) {
      toast.error(typeof err === "string" ? err : "Could not remove item");
    }
  }

  async function handleClearBag() {
    try {
      await dispatch(clearCart()).unwrap();
      toast.success("Your bag is empty.");
    } catch (err) {
      toast.error(typeof err === "string" ? err : "Could not clear bag");
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Shopping bag${count > 0 ? `, ${count} items` : ""}`}
          className="relative text-ink hover:text-gold"
        >
          <ShoppingBag className="size-4" />
          {count > 0 ? (
            <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-burgundy text-[10px] font-medium text-cream">
              {count > 9 ? "9+" : count}
            </span>
          ) : null}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-playfair normal-case tracking-normal text-ink">
            Your bag
          </SheetTitle>
          <SheetDescription className="font-lora">
            {count === 0
              ? "Your bag is empty — browse the shelves to fill it."
              : `${count} item${count === 1 ? "" : "s"} in your bag`}
          </SheetDescription>
        </SheetHeader>

        <ul className="flex-1 space-y-4 overflow-y-auto px-8">
          {items.length === 0 ? (
            <li className="font-lora text-sm text-warm-gray">No items yet.</li>
          ) : (
            items.map((item) => (
              <li
                key={item.productId}
                className="flex gap-3 border-b border-border/50 pb-4"
              >
                <div className="relative size-16 shrink-0 overflow-hidden rounded-sm bg-muted">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center bg-cream font-playfair text-xs text-warm-gray">
                      Book
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-playfair text-sm font-semibold text-ink line-clamp-2">
                    {item.name}
                  </p>
                  <p className="font-lora text-sm text-gold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      aria-label="Decrease quantity"
                      onClick={() =>
                        changeQuantity(item.productId, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="size-3" />
                    </Button>
                    <span className="min-w-6 text-center font-lora text-sm">
                      {item.quantity}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      aria-label="Increase quantity"
                      onClick={() =>
                        changeQuantity(item.productId, item.quantity + 1)
                      }
                    >
                      <Plus className="size-3" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Remove item"
                      className="ml-auto text-destructive"
                      onClick={() => handleRemove(item.productId)}
                    >
                      <Trash2 className="size-3" />
                    </Button>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>

        <SheetFooter className="border-t border-border/50">
          <div className="flex w-full flex-col gap-3">
            {items.length > 0 ? (
              <Button
                type="button"
                variant="ghost"
                className="w-full rounded-md font-lora normal-case text-warm-gray hover:text-destructive"
                onClick={handleClearBag}
              >
                Clear bag
              </Button>
            ) : null}
            <div className="flex justify-between font-lora text-sm">
              <span className="text-warm-gray">Subtotal</span>
              <span className="font-playfair text-ink">
                ${subtotal.toFixed(2)}
              </span>
            </div>
            {isAuthenticated ? (
              <Button
                asChild
                className="w-full rounded-md font-lora normal-case"
                disabled={items.length === 0}
              >
                <Link href="/checkout">Checkout</Link>
              </Button>
            ) : (
              <Button
                asChild
                variant="outline"
                className="w-full rounded-md border-ink/20 font-lora normal-case"
              >
                <Link href="/login">Sign in to checkout</Link>
              </Button>
            )}
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
