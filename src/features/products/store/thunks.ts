import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";
import type { Book } from "@/features/products/types";
import { mapProductToBook } from "@/features/products/utils/mapProductToBook";
import * as productService from "@/features/products/services/productService";

function getErrorMessage(error: unknown, fallback: string): string {
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    return axiosError.response?.data?.message ?? fallback;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}

export const fetchProducts = createAsyncThunk<
  Book[],
  void,
  { rejectValue: string }
>("products/fetchAll", async (_, { rejectWithValue }) => {
  try {
    return await productService.fetchProducts();
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Failed to load products"));
  }
});

export const fetchProductById = createAsyncThunk<
  Book,
  string,
  { rejectValue: string }
>("products/fetchById", async (id, { rejectWithValue }) => {
  try {
    return await productService.fetchProductById(id);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Failed to load product"));
  }
});

export const createProduct = createAsyncThunk<
  Book,
  FormData,
  { rejectValue: string }
>("products/create", async (formData, { rejectWithValue }) => {
  try {
    const product = await productService.createProduct(formData);
    return mapProductToBook(product);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Failed to create product"));
  }
});

export const updateProduct = createAsyncThunk<
  Book,
  { id: string; body: Record<string, unknown> },
  { rejectValue: string }
>("products/update", async ({ id, body }, { rejectWithValue }) => {
  try {
    const product = await productService.updateProduct(id, body);
    return mapProductToBook(product);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Failed to update product"));
  }
});

export const deleteProduct = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("products/delete", async (id, { rejectWithValue }) => {
  try {
    await productService.deleteProduct(id);
    return id;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Failed to delete product"));
  }
});
