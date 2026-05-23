import "server-only";
import { jwtVerify, type JWTPayload } from "jose";

export type TokenPayload = JWTPayload & {
  userId: string;
  role: "customer" | "admin";
};

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }
  return new TextEncoder().encode(secret);
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    const userId = payload.userId;
    const role = payload.role;
    if (typeof userId !== "string" || (role !== "customer" && role !== "admin")) {
      return null;
    }
    return { ...payload, userId, role };
  } catch {
    return null;
  }
}
