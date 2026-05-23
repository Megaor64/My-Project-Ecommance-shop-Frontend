import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/store";

const selectCartState = (state: RootState) => state.cart;

export const selectCartItems = createSelector(
  selectCartState,
  (cart) => cart.items
);

export const selectCartCount = createSelector(selectCartItems, (items) =>
  items.reduce((sum, item) => sum + item.quantity, 0)
);

export const selectCartSubtotal = createSelector(selectCartItems, (items) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0)
);

export const selectCartLoading = createSelector(
  selectCartState,
  (cart) => cart.status === "loading"
);

export const selectCartError = createSelector(
  selectCartState,
  (cart) => cart.error
);
