import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CartItem } from "@/features/cart/types";
import {
  addToCart,
  clearCart,
  fetchCart,
  removeFromCart,
  syncGuestCart,
  updateCartItem,
} from "./thunks";

export type CartStatus = "idle" | "loading" | "succeeded" | "failed";

export type CartState = {
  items: CartItem[];
  status: CartStatus;
  error: string | null;
};

export const initialCartState: CartState = {
  items: [],
  status: "idle",
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState: initialCartState,
  reducers: {
    setGuestCartItems(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload;
      state.status = "succeeded";
      state.error = null;
    },
    clearCartError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const setLoading = (state: CartState) => {
      state.status = "loading";
      state.error = null;
    };

    builder
      .addCase(fetchCart.pending, setLoading)
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Failed to load cart";
      })

      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = "succeeded";
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.error = action.payload ?? "Failed to add item";
      })

      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = "succeeded";
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.error = action.payload ?? "Failed to update item";
      })

      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = "succeeded";
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.error = action.payload ?? "Failed to remove item";
      })

      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
        state.status = "succeeded";
      })
      .addCase(syncGuestCart.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = "succeeded";
      });
  },
});

export const { setGuestCartItems, clearCartError } = cartSlice.actions;
export default cartSlice.reducer;
