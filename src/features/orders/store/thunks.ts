import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";
import type { Order } from "@/features/orders/types";
import * as orderService from "@/features/orders/services/orderService";
import type { CreateOrderPayload } from "@/features/orders/services/orderService";

function getErrorMessage(error: unknown, fallback: string): string {
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    return axiosError.response?.data?.message ?? fallback;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}

export const fetchMyOrders = createAsyncThunk<
  Order[],
  void,
  { rejectValue: string }
>("orders/fetchMy", async (_, { rejectWithValue }) => {
  try {
    return await orderService.fetchMyOrders();
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Failed to load orders"));
  }
});

export const createOrder = createAsyncThunk<
  Order,
  CreateOrderPayload,
  { rejectValue: string }
>("orders/create", async (payload, { rejectWithValue }) => {
  try {
    return await orderService.createOrder(payload);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Failed to create order"));
  }
});

export const cancelOrder = createAsyncThunk<
  Order,
  string,
  { rejectValue: string }
>("orders/cancel", async (orderId, { rejectWithValue }) => {
  try {
    return await orderService.cancelOrder(orderId);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Failed to cancel order"));
  }
});

export const deleteOrder = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("orders/delete", async (orderId, { rejectWithValue }) => {
  try {
    await orderService.deleteOrder(orderId);
    return orderId;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Failed to delete order"));
  }
});
