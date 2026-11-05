import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Book } from "@/features/products/types";
import { mapProductToBook } from "@/features/products/utils/mapProductToBook";
import * as productService from "@/features/products/services/productService";
import { rejectMessage } from "@/lib/i18n";
import type { RootState } from "@/store";

export const fetchProducts = createAsyncThunk<
  Book[],
  void,
  { state: RootState; rejectValue: string }
>("products/fetchAll", async (_, { getState, rejectWithValue }) => {
  try {
    return await productService.fetchProducts();
  } catch (error) {
    return rejectWithValue(
      rejectMessage(error, getState(), "admin.products.loadFailed")
    );
  }
});

export const fetchProductById = createAsyncThunk<
  Book,
  string,
  { state: RootState; rejectValue: string }
>("products/fetchById", async (id, { getState, rejectWithValue }) => {
  try {
    return await productService.fetchProductById(id);
  } catch (error) {
    return rejectWithValue(
      rejectMessage(error, getState(), "book.loadFailed")
    );
  }
});

export const createProduct = createAsyncThunk<
  Book,
  FormData,
  { state: RootState; rejectValue: string }
>("products/create", async (formData, { getState, rejectWithValue }) => {
  try {
    const product = await productService.createProduct(formData);
    return mapProductToBook(product);
  } catch (error) {
    return rejectWithValue(
      rejectMessage(error, getState(), "admin.products.saveFailed")
    );
  }
});

export const updateProduct = createAsyncThunk<
  Book,
  { id: string; formData: FormData },
  { state: RootState; rejectValue: string }
>("products/update", async ({ id, formData }, { getState, rejectWithValue }) => {
  try {
    const product = await productService.updateProduct(id, formData);
    return mapProductToBook(product);
  } catch (error) {
    return rejectWithValue(
      rejectMessage(error, getState(), "admin.products.saveFailed")
    );
  }
});

export const deleteProduct = createAsyncThunk<
  string,
  string,
  { state: RootState; rejectValue: string }
>("products/delete", async (id, { getState, rejectWithValue }) => {
  try {
    await productService.deleteProduct(id);
    return id;
  } catch (error) {
    return rejectWithValue(
      rejectMessage(error, getState(), "admin.products.deleteFailed")
    );
  }
});
