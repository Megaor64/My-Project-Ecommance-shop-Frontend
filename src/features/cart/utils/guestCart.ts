import type { GuestCart, GuestCartItem } from "@/features/cart/types";

export const GUEST_CART_KEY = "folio-guest-cart";

export function readGuestCart(): GuestCartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as GuestCart;
    return Array.isArray(parsed.items) ? parsed.items : [];
  } catch {
    return [];
  }
}

export function writeGuestCart(items: GuestCartItem[]): void {
  if (typeof window === "undefined") return;
  const payload: GuestCart = { items };
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(payload));
}

export function clearGuestCartStorage(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(GUEST_CART_KEY);
}
