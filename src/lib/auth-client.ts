import { mapExpressUser, type AuthUser } from "@/lib/auth";
import { getApiBaseUrl } from "@/lib/api";

type JwtPayload = {
  userId?: string;
  role?: string;
};

export function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const segment = token.split(".")[1];
    if (!segment) return null;
    const normalized = segment.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(normalized);
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

export function extractAccessToken(data: unknown): string | null {
  if (typeof data === "string") return data;
  if (data && typeof data === "object" && "accessToken" in data) {
    const token = (data as { accessToken?: unknown }).accessToken;
    return typeof token === "string" ? token : null;
  }
  return null;
}

export async function fetchUserByAccessToken(token: string): Promise<AuthUser> {
  const payload = decodeJwtPayload(token);
  if (!payload?.userId) {
    throw new Error("Invalid token");
  }

  const res = await fetch(`${getApiBaseUrl()}/users/${payload.userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const json = (await res.json()) as {
    message?: string;
    data?: Record<string, unknown>;
  };

  if (!res.ok) {
    throw new Error(json.message ?? "Failed to load user");
  }

  const userDoc = json.data;
  if (!userDoc || typeof userDoc !== "object") {
    throw new Error("Failed to load user");
  }

  return mapExpressUser(userDoc);
}
