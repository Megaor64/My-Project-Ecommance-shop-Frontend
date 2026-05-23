import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/store";

const selectOrdersState = (state: RootState) => state.orders;

export const selectOrders = createSelector(
  selectOrdersState,
  (orders) => orders.orders
);

export const selectOrdersStatus = createSelector(
  selectOrdersState,
  (orders) => orders.status
);

export const selectOrdersLoading = createSelector(
  selectOrdersStatus,
  (status) => status === "loading"
);

export const selectOrdersError = createSelector(
  selectOrdersState,
  (orders) => orders.error
);
