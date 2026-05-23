import httpClient from "@/lib/httpClient";
import type {
  AdminLoginStep1Response,
  AuthLoginResponse,
  AuthRegisterResponse,
  AuthVerifyResponse,
} from "@/features/auth/types";
import type { AuthUser } from "@/lib/auth";

export async function login(
  email: string,
  password: string,
  remember = false
) {
  const { data } = await httpClient.post<AuthLoginResponse>("/auth/login", {
    email,
    password,
    remember,
  });
  return data;
}

export async function logout() {
  const { data } = await httpClient.post<{ message?: string }>("/auth/logout");
  return data;
}

export async function register(body: {
  name: string;
  email: string;
  password: string;
}) {
  const { data } = await httpClient.post<AuthRegisterResponse>(
    "/auth/register",
    body
  );
  return data;
}

export async function verifyEmail(email: string, code: string) {
  const { data } = await httpClient.post<AuthVerifyResponse>("/auth/verify", {
    email,
    code,
  });
  return data;
}

export async function adminLogin(email: string, password: string) {
  const { data } = await httpClient.post<AdminLoginStep1Response>(
    "/auth/admin/login",
    { email, password }
  );
  return data;
}

export async function adminVerify2fa(
  email: string,
  code: string,
  remember = false
) {
  const { data } = await httpClient.post<AuthLoginResponse>(
    "/auth/admin/verify",
    { email, code, remember }
  );
  return data;
}

export async function adminRegister(body: {
  name: string;
  email: string;
  adminPass: string;
}) {
  const { data } = await httpClient.post<{
    message?: string;
    email?: string;
  }>("/auth/admin/register", body);
  return data;
}

export async function fetchMe() {
  const { data } = await httpClient.get<AuthUser>("/auth/me");
  return data;
}

export type GoogleAuthIntent = "customer" | "admin-login" | "admin-register";

export async function googleAuth(payload: {
  idToken: string;
  intent: GoogleAuthIntent;
  remember?: boolean;
  adminPass?: string;
}) {
  const { data } = await httpClient.post<AuthLoginResponse>("/auth/google", payload);
  return data;
}
