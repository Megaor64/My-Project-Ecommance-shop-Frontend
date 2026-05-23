import "server-only";
import { NextResponse } from "next/server";
import type { AuthSession } from "@/lib/auth-server";

export function requireUserIdMatch(
  session: AuthSession,
  userId: string
): NextResponse | null {
  if (String(session.payload.userId) !== String(userId)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }
  return null;
}

export function requireOwnerOrAdmin(
  session: AuthSession,
  userId: string
): NextResponse | null {
  if (session.payload.role === "admin") return null;
  return requireUserIdMatch(session, userId);
}

type ExpressJson = {
  message?: string;
  data?: unknown;
  errors?: { field?: string; message?: string }[];
};

export async function forwardExpressJson(res: Response): Promise<NextResponse> {
  const json = (await res.json()) as ExpressJson;
  if (!res.ok) {
    const validationDetail = json.errors?.[0]?.message;
    return NextResponse.json(
      { message: validationDetail ?? json.message ?? "Request failed" },
      { status: res.status }
    );
  }
  return NextResponse.json(json.data ?? null, { status: res.status });
}
