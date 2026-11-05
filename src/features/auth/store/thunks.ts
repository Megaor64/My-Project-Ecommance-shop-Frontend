import { createAsyncThunk } from "@reduxjs/toolkit";
import * as authService from "@/features/auth/services/authService";
import type { AuthLoginResponse } from "@/features/auth/types";
import type { AuthUser } from "@/lib/auth";
import { isAuthUser } from "@/lib/auth";
import {
  rejectMessage,
  translateFromState,
  type TranslationKey,
} from "@/lib/i18n";
import type { RootState } from "@/store";

function authReject(
  error: unknown,
  state: RootState,
  fallback: TranslationKey
): string {
  if (error instanceof Error && error.message === "Invalid login response") {
    return translateFromState(state, "auth.invalidResponse");
  }
  return rejectMessage(error, state, fallback);
}

function assertLoginResponse(data: unknown): AuthLoginResponse {
  if (
    !data ||
    typeof data !== "object" ||
    !("user" in data) ||
    !("accessToken" in data)
  ) {
    throw new Error("Invalid login response");
  }
  const payload = data as AuthLoginResponse;
  if (!isAuthUser(payload.user) || typeof payload.accessToken !== "string") {
    throw new Error("Invalid login response");
  }
  return payload;
}

export const login = createAsyncThunk<
  AuthLoginResponse,
  { email: string; password: string; remember?: boolean },
  { state: RootState; rejectValue: string }
>("auth/login", async (credentials, { getState, rejectWithValue }) => {
  try {
    const data = await authService.login(
      credentials.email,
      credentials.password,
      credentials.remember
    );
    return assertLoginResponse(data);
  } catch (error) {
    return rejectWithValue(authReject(error, getState(), "auth.loginFailed"));
  }
});

export const logout = createAsyncThunk<
  void,
  void,
  { state: RootState; rejectValue: string }
>("auth/logout", async (_, { getState, rejectWithValue }) => {
  try {
    await authService.logout();
  } catch (error) {
    return rejectWithValue(
      rejectMessage(error, getState(), "auth.logoutFailed")
    );
  }
});

export const register = createAsyncThunk<
  { email: string },
  { name: string; email: string; password: string },
  { state: RootState; rejectValue: string }
>("auth/register", async (body, { getState, rejectWithValue }) => {
  try {
    const data = await authService.register(body);
    return { email: data.email ?? body.email };
  } catch (error) {
    return rejectWithValue(
      rejectMessage(error, getState(), "auth.registrationFailed")
    );
  }
});

export const verifyEmail = createAsyncThunk<
  void,
  { email: string; code: string },
  { state: RootState; rejectValue: string }
>("auth/verifyEmail", async (body, { getState, rejectWithValue }) => {
  try {
    await authService.verifyEmail(body.email, body.code);
  } catch (error) {
    return rejectWithValue(rejectMessage(error, getState(), "verify.failed"));
  }
});

export const resendVerification = createAsyncThunk<
  void,
  { email: string },
  { state: RootState; rejectValue: string }
>("auth/resendVerification", async (body, { getState, rejectWithValue }) => {
  try {
    await authService.resendVerificationEmail(body.email);
  } catch (error) {
    return rejectWithValue(
      rejectMessage(error, getState(), "verify.sendFailed")
    );
  }
});

export const adminLogin = createAsyncThunk<
  void,
  { email: string; password: string },
  { state: RootState; rejectValue: string }
>("auth/adminLogin", async (body, { getState, rejectWithValue }) => {
  try {
    await authService.adminLogin(body.email, body.password);
  } catch (error) {
    return rejectWithValue(
      rejectMessage(error, getState(), "auth.loginFailed")
    );
  }
});

export const adminVerify2fa = createAsyncThunk<
  AuthLoginResponse,
  { email: string; code: string; remember?: boolean },
  { state: RootState; rejectValue: string }
>("auth/adminVerify2fa", async (body, { getState, rejectWithValue }) => {
  try {
    const data = await authService.adminVerify2fa(
      body.email,
      body.code,
      body.remember
    );
    return assertLoginResponse(data);
  } catch (error) {
    return rejectWithValue(authReject(error, getState(), "verify.failed"));
  }
});

export const demoLogin = createAsyncThunk<
  AuthLoginResponse,
  void,
  { state: RootState; rejectValue: string }
>("auth/demoLogin", async (_, { getState, rejectWithValue }) => {
  try {
    const data = await authService.demoLogin();
    return assertLoginResponse(data);
  } catch (error) {
    return rejectWithValue(authReject(error, getState(), "auth.demoFailed"));
  }
});

export const fetchMe = createAsyncThunk<
  AuthUser,
  void,
  { state: RootState; rejectValue: string }
>("auth/fetchMe", async (_, { getState, rejectWithValue }) => {
  try {
    const user = await authService.fetchMe();
    if (!isAuthUser(user)) {
      return rejectWithValue(
        translateFromState(getState(), "auth.notAuthenticated")
      );
    }
    return user;
  } catch (error) {
    return rejectWithValue(
      rejectMessage(error, getState(), "auth.notAuthenticated")
    );
  }
});

export const googleAuth = createAsyncThunk<
  AuthLoginResponse,
  {
    idToken: string;
    intent: authService.GoogleAuthIntent;
    remember?: boolean;
    adminPass?: string;
  },
  { state: RootState; rejectValue: string }
>("auth/googleAuth", async (body, { getState, rejectWithValue }) => {
  try {
    const data = await authService.googleAuth(body);
    return assertLoginResponse(data);
  } catch (error) {
    return rejectWithValue(authReject(error, getState(), "auth.googleFailed"));
  }
});
