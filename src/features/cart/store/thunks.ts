import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";
import type { RootState } from "@/store";
import type { Book } from "@/features/products/types";
import type { CartItem } from "@/features/cart/types";
import * as cartService from "@/features/cart/services/cartService";
import {
  clearGuestCartStorage,
  readGuestCart,
  writeGuestCart,
} from "@/features/cart/utils/guestCart";
import { fetchProducts } from "@/features/products/store/thunks";
import { setGuestCartItems } from "./slice";

function getErrorMessage(error: unknown, fallback: string): string {
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    return axiosError.response?.data?.message ?? fallback;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}

function bookToCartItem(book: Book, quantity: number): CartItem {
  return {
    productId: book.id,
    name: book.title,
    price: book.price,
    quantity,
    imageUrl: book.coverImage,
  };
}

function mergeGuestItem(items: CartItem[], book: Book, quantity: number): CartItem[] {
  const existing = items.find((i) => i.productId === book.id);
  if (existing) {
    return items.map((i) =>
      i.productId === book.id
        ? { ...i, quantity: i.quantity + quantity }
        : i
    );
  }
  return [...items, bookToCartItem(book, quantity)];
}

export const loadGuestCart = createAsyncThunk<void, void>(
  "cart/loadGuest",
  async (_, { dispatch }) => {
    const guestItems = readGuestCart();
    if (guestItems.length === 0) return;
    const placeholder: CartItem[] = guestItems.map((g) => ({
      productId: g.productId,
      name: "Product",
      price: 0,
      quantity: g.quantity,
    }));
    dispatch(setGuestCartItems(placeholder));
  }
);

export const fetchCart = createAsyncThunk<
  CartItem[],
  void,
  { state: RootState; rejectValue: string }
>("cart/fetch", async (_, { getState, rejectWithValue }) => {
  const userId = getState().auth.user?.id;
  if (!userId) return rejectWithValue("Not authenticated");

  try {
    return await cartService.getCart(userId);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Failed to load cart"));
  }
});

export const addToCart = createAsyncThunk<
  CartItem[],
  { book: Book; quantity?: number },
  { state: RootState; rejectValue: string }
>(
  "cart/add",
  async ({ book, quantity = 1 }, { getState, dispatch, rejectWithValue }) => {
    const userId = getState().auth.user?.id;

    if (!userId) {
      const guestItems = readGuestCart();
      const existing = guestItems.find((i) => i.productId === book.id);
      const nextGuest = existing
        ? guestItems.map((i) =>
            i.productId === book.id
              ? { ...i, quantity: i.quantity + quantity }
              : i
          )
        : [...guestItems, { productId: book.id, quantity }];
      writeGuestCart(nextGuest);
      const cartItems = mergeGuestItem(getState().cart.items, book, quantity);
      dispatch(setGuestCartItems(cartItems));
      return cartItems;
    }

    try {
      await cartService.addCartItem(userId, book.id, quantity);
      const cart = await cartService.getCart(userId);
      dispatch(fetchProducts());
      return cart;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to add to cart"));
    }
  }
);

export const updateCartItem = createAsyncThunk<
  CartItem[],
  { productId: string; quantity: number },
  { state: RootState; rejectValue: string }
>(
  "cart/update",
  async ({ productId, quantity }, { getState, dispatch, rejectWithValue }) => {
    const userId = getState().auth.user?.id;

    if (!userId) {
      const guestItems = readGuestCart().map((i) =>
        i.productId === productId ? { ...i, quantity } : i
      );
      writeGuestCart(guestItems);
      const items = getState().cart.items.map((i) =>
        i.productId === productId ? { ...i, quantity } : i
      );
      dispatch(setGuestCartItems(items));
      return items;
    }

    try {
      await cartService.updateCartItem(userId, productId, quantity);
      return await cartService.getCart(userId);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to update cart"));
    }
  }
);

export const removeFromCart = createAsyncThunk<
  CartItem[],
  string,
  { state: RootState; rejectValue: string }
>("cart/remove", async (productId, { getState, dispatch, rejectWithValue }) => {
  const userId = getState().auth.user?.id;

  if (!userId) {
    const guestItems = readGuestCart().filter((i) => i.productId !== productId);
    writeGuestCart(guestItems);
    const items = getState().cart.items.filter((i) => i.productId !== productId);
    dispatch(setGuestCartItems(items));
    return items;
  }

  try {
    await cartService.removeCartItem(userId, productId);
    return await cartService.getCart(userId);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Failed to remove item"));
  }
});

export const clearCart = createAsyncThunk<
  CartItem[],
  void,
  { state: RootState; rejectValue: string }
>("cart/clear", async (_, { getState, dispatch, rejectWithValue }) => {
  const userId = getState().auth.user?.id;

  if (!userId) {
    writeGuestCart([]);
    dispatch(setGuestCartItems([]));
    return [];
  }

  try {
    return await cartService.clearCartApi(userId);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Failed to clear cart"));
  }
});

export const syncGuestCart = createAsyncThunk<
  CartItem[],
  void,
  { state: RootState; rejectValue: string }
>("cart/syncGuest", async (_, { getState, rejectWithValue }) => {
  const userId = getState().auth.user?.id;
  if (!userId) return rejectWithValue("Not authenticated");

  const guestItems = readGuestCart();
  if (guestItems.length === 0) {
    return cartService.getCart(userId);
  }

  try {
    await cartService.syncGuestCartApi(userId, guestItems);
    clearGuestCartStorage();
    return await cartService.getCart(userId);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Failed to sync cart"));
  }
});
