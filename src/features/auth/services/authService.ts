import httpClient from "@/lib/httpClient";
import type {
  AdminLoginStep1Response,
  AuthLoginResponse,
  AuthRegisterResponse,
  AuthVerifyResponse,
} from "@/features/auth/types";
import type { AuthUser } from "@/lib/auth";
import { isAuthUser, mapExpressUser } from "@/lib/auth";
import {
  extractAccessToken,
  fetchUserByAccessToken,
} from "@/lib/auth-client";
import { clearAuthToken, getAuthToken } from "@/lib/auth-storage";

async function buildLoginResponse(
  data: unknown,
  accessToken: string
): Promise<AuthLoginResponse> {
  if (data && typeof data === "object" && "user" in data) {
    const userRaw = (data as { user?: Record<string, unknown> }).user;
    if (userRaw && typeof userRaw === "object") {
      const user = mapExpressUser(userRaw);
      if (isAuthUser(user)) {
        return { user, accessToken };
      }
    }
  }

  const user = await fetchUserByAccessToken(accessToken);
  return { user, accessToken };
}

export async function login(
  email: string,
  password: string,
  _remember = false
) {
  const { data } = await httpClient.post<unknown>("/auth/login", {
    email,
    password,
  });
  const accessToken = extractAccessToken(data);
  if (!accessToken) {
    throw new Error("Login failed");
  }
  return buildLoginResponse(data, accessToken);
}

export async function logout() {
  const token = getAuthToken();
  if (token) {
    await httpClient.post<{ message?: string }>("/auth/logout", { token });
  }
  clearAuthToken();
  return { message: "Logged out" };
}

export async function register(body: {
  name: string;
  email: string;
  password: string;
}) {
  const { data } = await httpClient.post<{ email?: string }>(
    "/auth/register",
    body
  );
  return {
    needsVerification: true,
    email: data?.email ?? body.email,
  } satisfies AuthRegisterResponse;
}

export async function verifyEmail(email: string, code: string) {
  await httpClient.post<AuthVerifyResponse>("/auth/verify", { email, code });
  return { verified: true } satisfies AuthVerifyResponse;
}

export async function resendVerificationEmail(email: string) {
  await httpClient.post<{ message?: string }>("/auth/resend-verification", {
    email,
  });
  return { message: "Verification code sent." };
}

export async function adminLogin(email: string, password: string) {
  await httpClient.post<AdminLoginStep1Response>("/auth/admin/login", {
    email,
    password,
  });
  return { needsOtp: true } satisfies AdminLoginStep1Response;
}

export async function adminVerify2fa(
  email: string,
  code: string,
  _remember = false
) {
  const { data } = await httpClient.post<unknown>("/auth/admin/login2", {
    email,
    code,
  });
  const accessToken = extractAccessToken(data);
  if (!accessToken) {
    throw new Error("Invalid verification code");
  }
  const response = await buildLoginResponse(data, accessToken);
  if (response.user.role !== "admin") {
    throw new Error("Forbidden");
  }
  return response;
}

export async function adminRegister(body: {
  name: string;
  email: string;
  adminPass: string;
}) {
  await httpClient.post<{ message?: string; email?: string }>(
    "/auth/admin/register",
    {
      name: body.name,
      email: body.email,
      password: body.adminPass,
    }
  );
  return {
    needsVerification: true,
    email: body.email,
  };
}

export async function fetchMe() {
  const token = getAuthToken();
  if (!token) {
    throw new Error("Not authenticated");
  }
  return fetchUserByAccessToken(token);
}

export async function demoLogin() {
  const { data } = await httpClient.post<unknown>("/auth/demo-login");
  const accessToken = extractAccessToken(data);
  if (!accessToken) {
    throw new Error("Demo login failed");
  }
  return buildLoginResponse(data, accessToken);
}

export type GoogleAuthIntent = "customer" | "admin-login" | "admin-register";

export async function googleAuth(payload: {
  idToken: string;
  intent: GoogleAuthIntent;
  remember?: boolean;
  adminPass?: string;
}) {
  const { data } = await httpClient.post<unknown>("/auth/google", payload);
  const accessToken = extractAccessToken(data);
  if (!accessToken) {
    throw new Error("Google sign-in failed");
  }
  return buildLoginResponse(data, accessToken);
}
