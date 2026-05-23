import { NextResponse } from "next/server";
import {
  expressFetch,
  isAuthError,
  requireAdmin,
} from "@/lib/auth-server";
import { forwardExpressJson } from "@/lib/bff-utils";

export async function GET() {
  try {
    const session = await requireAdmin();
    if (isAuthError(session)) return session;

    const res = await expressFetch("/users", { method: "GET" }, session.token);
    return forwardExpressJson(res);
  } catch {
    return NextResponse.json({ message: "Failed to fetch users" }, { status: 500 });
  }
}
