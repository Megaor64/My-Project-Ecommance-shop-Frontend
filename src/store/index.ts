import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer, { type AuthState } from "@/features/auth/store/slice";
import cartReducer from "@/features/cart/store/slice";
import ordersReducer from "@/features/orders/store/slice";
import productsReducer from "@/features/products/store/slice";
import settingsReducer from "@/features/settings/store/slice";
import { listenerMiddleware } from "./listenerMiddleware";

const rootReducer = combineReducers({
  auth: authReducer,
  products: productsReducer,
  cart: cartReducer,
  orders: ordersReducer,
  settings: settingsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export function makeStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().prepend(listenerMiddleware.middleware),
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];
