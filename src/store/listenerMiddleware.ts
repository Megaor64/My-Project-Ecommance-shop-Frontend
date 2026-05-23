import { createListenerMiddleware } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";
import httpClient from "@/lib/httpClient";
import { logout } from "@/features/auth/store/thunks";
import type { AppDispatch, RootState } from "./index";

export const listenerMiddleware = createListenerMiddleware();

let interceptorsRegistered = false;

export function setupHttpClientAuth(
  getState: () => RootState,
  dispatch: AppDispatch
) {
  if (interceptorsRegistered) return;
  interceptorsRegistered = true;

  httpClient.interceptors.request.use((config) => {
    const token = getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  httpClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      if (error.response?.status === 401) {
        await dispatch(logout());
        if (typeof window !== "undefined") {
          const path = window.location.pathname;
          const isAuthRoute =
            path.startsWith("/login") ||
            path.startsWith("/register") ||
            path.startsWith("/admin/login") ||
            path.startsWith("/admin/register");
          if (!isAuthRoute) {
            window.location.href = "/login";
          }
        }
      }
      return Promise.reject(error);
    }
  );
}
