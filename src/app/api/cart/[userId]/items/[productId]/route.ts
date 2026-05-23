import { NextResponse } from "next/server";
import {
  expressFetch,
  isAuthError,
  requireAuth,
} from "@/lib/auth-server";
import { forwardExpressJson, requireUserIdMatch } from "@/lib/bff-utils";

type RouteContext = { params: Promise<{ userId: string; productId: string }> };

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const session = await requireAuth();
    if (isAuthError(session)) return session;

    const { userId, productId } = await context.params;
    const forbidden = requireUserIdMatch(session, userId);
    if (forbidden) return forbidden;

    const res = await expressFetch(
      `/cart/${userId}/items/${productId}`,
      { method: "DELETE" },
      session.token
    );
    return forwardExpressJson(res);
  } catch {
    return NextResponse.json({ message: "Failed to remove item" }, { status: 500 });
  }
}
