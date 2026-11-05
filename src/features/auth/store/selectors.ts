import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/store";

const selectAuthState = (state: RootState) => state.auth;

export const selectUser = createSelector(selectAuthState, (auth) => auth.user);

export const selectAuthToken = createSelector(
  selectAuthState,
  (auth) => auth.token
);

export const selectAuthStatus = createSelector(
  selectAuthState,
  (auth) => auth.status
);

export const selectAuthError = createSelector(
  selectAuthState,
  (auth) => auth.error
);

export const selectIsAuthenticated = createSelector(
  selectUser,
  (user) => !!user
);

export const selectIsAdmin = createSelector(
  selectUser,
  (user) => user?.role === "admin" || user?.role === "demo-admin"
);

export const selectIsDemoAdmin = createSelector(
  selectUser,
  (user) => user?.role === "demo-admin"
);

export const selectUserRole = createSelector(selectUser, (user) => user?.role ?? null);

export const selectAuthLoading = createSelector(
  selectAuthStatus,
  (status) => status === "loading"
);
