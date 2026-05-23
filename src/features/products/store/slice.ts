import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Book } from "@/features/products/types";
import {
  createProduct,
  deleteProduct,
  fetchProductById,
  fetchProducts,
  updateProduct,
} from "./thunks";

export type ProductsStatus = "idle" | "loading" | "succeeded" | "failed";

export type ProductsState = {
  books: Book[];
  selectedProduct: Book | null;
  adminProducts: Book[];
  status: ProductsStatus;
  error: string | null;
};

export const initialProductsState: ProductsState = {
  books: [],
  selectedProduct: null,
  adminProducts: [],
  status: "idle",
  error: null,
};

const productsSlice = createSlice({
  name: "products",
  initialState: initialProductsState,
  reducers: {
    hydrateBooks(state, action: PayloadAction<Book[]>) {
      state.books = action.payload;
      state.status = "succeeded";
      state.error = null;
    },
    clearProductsError(state) {
      state.error = null;
    },
    hydrateAdminProducts(state, action: PayloadAction<Book[]>) {
      state.adminProducts = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.books = action.payload;
        if (state.adminProducts.length === 0) {
          state.adminProducts = action.payload;
        }
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Failed to load products";
      })

      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.error = action.payload ?? "Failed to load product";
      })

      .addCase(createProduct.fulfilled, (state, action) => {
        state.adminProducts = [action.payload, ...state.adminProducts];
        state.books = [action.payload, ...state.books];
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const id = action.payload.id;
        state.books = state.books.map((b) => (b.id === id ? action.payload : b));
        state.adminProducts = state.adminProducts.map((b) =>
          b.id === id ? action.payload : b
        );
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.books = state.books.filter((b) => b.id !== action.payload);
        state.adminProducts = state.adminProducts.filter(
          (b) => b.id !== action.payload
        );
      });
  },
});

export const { hydrateBooks, hydrateAdminProducts, clearProductsError } =
  productsSlice.actions;
export default productsSlice.reducer;
