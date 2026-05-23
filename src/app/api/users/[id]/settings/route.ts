import { NextResponse } from "next/server";
import {
  expressFetch,
  isAuthError,
  requireAuth,
} from "@/lib/auth-server";
import { forwardExpressJson, requireUserIdMatch } from "@/lib/bff-utils";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const session = await requireAuth();
    if (isAuthError(session)) return session;

    const { id } = await context.params;
    const forbidden = requireUserIdMatch(session, id);
    if (forbidden) {
      if (session.payload.role !== "admin") return forbidden;
    }

    const res = await expressFetch(`/users/${id}/settings`, { method: "GET" }, session.token);
    return forwardExpressJson(res);
  } catch {
    return NextResponse.json({ message: "Failed to fetch settings" }, { status: 500 });
  }
}
