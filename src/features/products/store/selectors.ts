import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/store";

const selectProductsState = (state: RootState) => state.products;

export const selectBooks = createSelector(
  selectProductsState,
  (products) => products.books
);

export const selectProductsStatus = createSelector(
  selectProductsState,
  (products) => products.status
);

export const selectProductsError = createSelector(
  selectProductsState,
  (products) => products.error
);

export const selectProductsLoading = createSelector(
  selectProductsStatus,
  (status) => status === "loading"
);

export const selectSelectedProduct = createSelector(
  selectProductsState,
  (products) => products.selectedProduct
);

export const selectFeaturedBooks = createSelector(selectBooks, (books) =>
  books.slice(0, 4)
);

export const selectHeroBooks = createSelector(selectBooks, (books) =>
  books.slice(0, 3)
);

export const selectAdminProducts = createSelector(
  selectProductsState,
  (products) => products.adminProducts
);
