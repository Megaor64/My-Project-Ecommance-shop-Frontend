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
import { useFormatPrice } from "@/hooks/useFormatPrice";
import { useT } from "@/lib/i18n";

export function CartSheet() {
  const dispatch = useAppDispatch();
  const formatPrice = useFormatPrice();
  const t = useT();
  const items = useAppSelector(selectCartItems);
  const count = useAppSelector(selectCartCount);
  const subtotal = useAppSelector(selectCartSubtotal);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  async function changeQuantity(productId: string, quantity: number) {
    if (quantity < 1) return;
    try {
      await dispatch(updateCartItem({ productId, quantity })).unwrap();
    } catch (err) {
      toast.error(typeof err === "string" ? err : t("cart.updateFailed"));
    }
  }

  async function handleRemove(productId: string) {
    try {
      await dispatch(removeFromCart(productId)).unwrap();
    } catch (err) {
      toast.error(typeof err === "string" ? err : t("cart.removeFailed"));
    }
  }

  async function handleClearBag() {
    try {
      await dispatch(clearCart()).unwrap();
      toast.success(t("cart.cleared"));
    } catch (err) {
      toast.error(typeof err === "string" ? err : t("cart.clearFailed"));
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={
            count > 0
              ? t.plural("cart.ariaLabelCount", count)
              : t("cart.ariaLabel")
          }
          className="relative text-ink hover:text-gold"
        >
          <ShoppingBag className="size-4" />
          {count > 0 ? (
            <span className="absolute -end-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-burgundy text-[10px] font-medium text-cream">
              {count > 9 ? "9+" : count}
            </span>
          ) : null}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-playfair normal-case tracking-normal text-ink">
            {t("cart.title")}
          </SheetTitle>
          <SheetDescription className="font-lora">
            {count === 0
              ? t("cart.emptyDescription")
              : t.plural("cart.count", count)}
          </SheetDescription>
        </SheetHeader>

        <ul className="flex-1 space-y-4 overflow-y-auto px-8">
          {items.length === 0 ? (
            <li className="font-lora text-sm text-warm-gray">{t("cart.noItems")}</li>
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
                      {t("cart.bookPlaceholder")}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-playfair text-sm font-semibold text-ink line-clamp-2">
                    {item.name}
                  </p>
                  <p className="font-lora text-sm text-gold">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      aria-label={t("book.decreaseQuantity")}
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
                      aria-label={t("book.increaseQuantity")}
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
                      aria-label={t("cart.removeItem")}
                      className="ms-auto text-destructive"
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
                {t("cart.clearBag")}
              </Button>
            ) : null}
            <div className="flex justify-between font-lora text-sm">
              <span className="text-warm-gray">{t("cart.subtotal")}</span>
              <span className="font-playfair text-ink">
                {formatPrice(subtotal)}
              </span>
            </div>
            {isAuthenticated ? (
              <Button
                asChild
                className="w-full rounded-md font-lora normal-case"
                disabled={items.length === 0}
              >
                <Link href="/checkout">{t("cart.checkout")}</Link>
              </Button>
            ) : (
              <Button
                asChild
                variant="outline"
                className="w-full rounded-md border-ink/20 font-lora normal-case"
              >
                <Link href="/login">{t("cart.signInToCheckout")}</Link>
              </Button>
            )}
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
