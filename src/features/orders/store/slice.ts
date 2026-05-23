import { createSlice } from "@reduxjs/toolkit";
import type { Order } from "@/features/orders/types";
import { cancelOrder, createOrder, deleteOrder, fetchMyOrders } from "./thunks";

export type OrdersStatus = "idle" | "loading" | "succeeded" | "failed";

export type OrdersState = {
  orders: Order[];
  status: OrdersStatus;
  error: string | null;
};

export const initialOrdersState: OrdersState = {
  orders: [],
  status: "idle",
  error: null,
};

const ordersSlice = createSlice({
  name: "orders",
  initialState: initialOrdersState,
  reducers: {
    clearOrdersError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyOrders.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Failed to load orders";
      })

      .addCase(createOrder.fulfilled, (state, action) => {
        state.orders = [action.payload, ...state.orders];
        state.status = "succeeded";
      })

      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.orders = state.orders.map((order) =>
          order._id === action.payload._id ? action.payload : order
        );
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.error = action.payload ?? "Failed to cancel order";
      })

      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.orders = state.orders.filter((order) => order._id !== action.payload);
        state.error = null;
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.error = action.payload ?? "Failed to delete order";
      });
  },
});

export const { clearOrdersError } = ordersSlice.actions;
export default ordersSlice.reducer;
