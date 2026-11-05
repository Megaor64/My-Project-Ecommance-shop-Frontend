import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Order } from "@/features/orders/types";
import * as orderService from "@/features/orders/services/orderService";
import type { CreateOrderPayload } from "@/features/orders/services/orderService";
import { rejectMessage } from "@/lib/i18n";
import type { RootState } from "@/store";

export const fetchMyOrders = createAsyncThunk<
  Order[],
  void,
  { state: RootState; rejectValue: string }
>("orders/fetchMy", async (_, { getState, rejectWithValue }) => {
  try {
    return await orderService.fetchMyOrders();
  } catch (error) {
    return rejectWithValue(
      rejectMessage(error, getState(), "orders.loadFailed")
    );
  }
});

export const createOrder = createAsyncThunk<
  Order,
  CreateOrderPayload,
  { state: RootState; rejectValue: string }
>("orders/create", async (payload, { getState, rejectWithValue }) => {
  try {
    return await orderService.createOrder(payload);
  } catch (error) {
    return rejectWithValue(
      rejectMessage(error, getState(), "checkout.failed")
    );
  }
});

export const cancelOrder = createAsyncThunk<
  Order,
  string,
  { state: RootState; rejectValue: string }
>("orders/cancel", async (orderId, { getState, rejectWithValue }) => {
  try {
    return await orderService.cancelOrder(orderId);
  } catch (error) {
    return rejectWithValue(
      rejectMessage(error, getState(), "orders.cancelFailed")
    );
  }
});

export const deleteOrder = createAsyncThunk<
  string,
  string,
  { state: RootState; rejectValue: string }
>("orders/delete", async (orderId, { getState, rejectWithValue }) => {
  try {
    await orderService.deleteOrder(orderId);
    return orderId;
  } catch (error) {
    return rejectWithValue(
      rejectMessage(error, getState(), "orders.removeFailed")
    );
  }
});
