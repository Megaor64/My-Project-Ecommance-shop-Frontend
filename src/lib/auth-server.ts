import "server-only";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAMES, type AuthUser, mapExpressUser } from "@/lib/auth";
import { verifyToken, type TokenPayload } from "@/lib/jwt";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3005";

const FIFTEEN_MINUTES = 15 * 60;
const SEVEN_DAYS = 7 * 24 * 60 * 60;

/** Legacy cookies removed from auth flow — cleared on login/logout */
const LEGACY_COOKIE_NAMES = ["is-logged-in", "user-role"] as const;

type CookieOptions = {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "lax" | "strict" | "none";
  path?: string;
  maxAge?: number;
};

function baseCookieOptions(remember = false): CookieOptions {
  return {
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: remember ? SEVEN_DAYS : FIFTEEN_MINUTES,
  };
}

export function getApiUrl(): string {
  return API_URL;
}

/** Express may return a raw JWT string or { accessToken, refreshToken }. */
export function extractAccessToken(data: unknown): string | null {
  if (typeof data === "string") return data;
  if (data && typeof data === "object" && "accessToken" in data) {
    const token = (data as { accessToken?: unknown }).accessToken;
    return typeof token === "string" ? token : null;
  }
  return null;
}

export async function expressFetch(
  path: string,
  options: RequestInit = {},
  token?: string
): Promise<Response> {
  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });
}

export async function fetchUserByToken(token: string): Promise<AuthUser | null> {
  const payload = await verifyToken(token);
  if (!payload) return null;

  const res = await expressFetch(
    `/users/${payload.userId}`,
    { method: "GET" },
    token
  );
  if (!res.ok) return null;

  const json = (await res.json()) as {
    data?: Record<string, unknown>;
  };
  if (!json.data) return null;

  return mapExpressUser(json.data);
}

export async function setAuthCookies(
  token: string,
  remember = false
): Promise<void> {
  const cookieStore = await cookies();
  const opts = baseCookieOptions(remember);

  cookieStore.set(AUTH_COOKIE_NAMES.token, token, {
    ...opts,
    httpOnly: true,
  });

  for (const name of LEGACY_COOKIE_NAMES) {
    cookieStore.delete(name);
  }
}

export async function clearAuthCookies(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAMES.token);
  for (const name of LEGACY_COOKIE_NAMES) {
    cookieStore.delete(name);
  }
}

export async function getAuthTokenFromCookies(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE_NAMES.token)?.value;
}

export async function getVerifiedSession(): Promise<{
  token: string;
  payload: TokenPayload;
} | null> {
  const token = await getAuthTokenFromCookies();
  if (!token) return null;

  const payload = await verifyToken(token);
  if (!payload) return null;

  return { token, payload };
}

export async function getServerUser(): Promise<AuthUser | null> {
  const token = await getAuthTokenFromCookies();
  if (!token) return null;
  return fetchUserByToken(token);
}

export type AuthSession = { token: string; payload: TokenPayload };

export function isAuthError(
  value: AuthSession | NextResponse
): value is NextResponse {
  return value instanceof NextResponse;
}

export async function requireAuth(): Promise<AuthSession | NextResponse> {
  const session = await getVerifiedSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  return session;
}

export async function requireAdmin(): Promise<AuthSession | NextResponse> {
  const session = await getVerifiedSession();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  if (session.payload.role !== "admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }
  return session;
}
