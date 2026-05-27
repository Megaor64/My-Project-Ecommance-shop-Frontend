import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";
import httpClient from "@/lib/httpClient";
import { clearCredentials } from "@/features/auth/store/slice";
import {
  adminVerify2fa,
  googleAuth,
  login,
  logout,
} from "@/features/auth/store/thunks";
import { clearAuthToken, setAuthToken } from "@/lib/auth-storage";
import type { AppDispatch, RootState } from "./index";

export const listenerMiddleware = createListenerMiddleware();

let interceptorsRegistered = false;

export function setupHttpClientAuth(
  _getState: () => RootState,
  dispatch: AppDispatch
) {
  if (interceptorsRegistered) return;
  interceptorsRegistered = true;

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

  listenerMiddleware.startListening({
    matcher: isAnyOf(
      login.fulfilled,
      adminVerify2fa.fulfilled,
      googleAuth.fulfilled,
      logout.fulfilled,
      clearCredentials
    ),
    effect: (action) => {
      if (login.fulfilled.match(action)) {
        setAuthToken(action.payload.accessToken, action.meta.arg.remember);
        return;
      }
      if (adminVerify2fa.fulfilled.match(action)) {
        setAuthToken(action.payload.accessToken, action.meta.arg.remember);
        return;
      }
      if (googleAuth.fulfilled.match(action)) {
        setAuthToken(action.payload.accessToken, action.meta.arg.remember);
        return;
      }
      if (logout.fulfilled.match(action) || clearCredentials.match(action)) {
        clearAuthToken();
      }
    },
  });
}
