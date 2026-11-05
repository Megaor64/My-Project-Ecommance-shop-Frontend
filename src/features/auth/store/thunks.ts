import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";
import * as authService from "@/features/auth/services/authService";
import type { AuthLoginResponse } from "@/features/auth/types";
import type { AuthUser } from "@/lib/auth";
import { isAuthUser } from "@/lib/auth";

function getErrorMessage(error: unknown, fallback: string): string {
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    return axiosError.response?.data?.message ?? fallback;
  }
  if (error instanceof Error) return error.message;
  return fallback;
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
  { rejectValue: string }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const data = await authService.login(
      credentials.email,
      credentials.password,
      credentials.remember
    );
    return assertLoginResponse(data);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Login failed"));
  }
});

export const logout = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Logout failed"));
    }
  }
);

export const register = createAsyncThunk<
  { email: string },
  { name: string; email: string; password: string },
  { rejectValue: string }
>("auth/register", async (body, { rejectWithValue }) => {
  try {
    const data = await authService.register(body);
    return { email: data.email ?? body.email };
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Registration failed"));
  }
});

export const verifyEmail = createAsyncThunk<
  void,
  { email: string; code: string },
  { rejectValue: string }
>("auth/verifyEmail", async (body, { rejectWithValue }) => {
  try {
    await authService.verifyEmail(body.email, body.code);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Verification failed"));
  }
});

export const resendVerification = createAsyncThunk<
  void,
  { email: string },
  { rejectValue: string }
>("auth/resendVerification", async (body, { rejectWithValue }) => {
  try {
    await authService.resendVerificationEmail(body.email);
  } catch (error) {
    return rejectWithValue(
      getErrorMessage(error, "Could not send verification code")
    );
  }
});

export const adminLogin = createAsyncThunk<
  void,
  { email: string; password: string },
  { rejectValue: string }
>("auth/adminLogin", async (body, { rejectWithValue }) => {
  try {
    await authService.adminLogin(body.email, body.password);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Admin login failed"));
  }
});

export const adminVerify2fa = createAsyncThunk<
  AuthLoginResponse,
  { email: string; code: string; remember?: boolean },
  { rejectValue: string }
>("auth/adminVerify2fa", async (body, { rejectWithValue }) => {
  try {
    const data = await authService.adminVerify2fa(
      body.email,
      body.code,
      body.remember
    );
    return assertLoginResponse(data);
  } catch (error) {
    return rejectWithValue(
      getErrorMessage(error, "Invalid verification code")
    );
  }
});

export const demoLogin = createAsyncThunk<
  AuthLoginResponse,
  void,
  { rejectValue: string }
>("auth/demoLogin", async (_, { rejectWithValue }) => {
  try {
    const data = await authService.demoLogin();
    return assertLoginResponse(data);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Demo login failed"));
  }
});

export const fetchMe = createAsyncThunk<AuthUser, void, { rejectValue: string }>(
  "auth/fetchMe",
  async (_, { rejectWithValue }) => {
    try {
      const user = await authService.fetchMe();
      if (!isAuthUser(user)) {
        return rejectWithValue("Not authenticated");
      }
      return user;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Not authenticated"));
    }
  }
);

export const googleAuth = createAsyncThunk<
  AuthLoginResponse,
  {
    idToken: string;
    intent: authService.GoogleAuthIntent;
    remember?: boolean;
    adminPass?: string;
  },
  { rejectValue: string }
>("auth/googleAuth", async (body, { rejectWithValue }) => {
  try {
    const data = await authService.googleAuth(body);
    return assertLoginResponse(data);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Google sign-in failed"));
  }
});
