import { NextResponse } from "next/server";
import {
  expressFetch,
  isAuthError,
  requireAuth,
} from "@/lib/auth-server";
import { forwardExpressJson, requireUserIdMatch } from "@/lib/bff-utils";

type RouteContext = { params: Promise<{ userId: string }> };

export async function POST(request: Request, context: RouteContext) {
  try {
    const session = await requireAuth();
    if (isAuthError(session)) return session;

    const { userId } = await context.params;
    const forbidden = requireUserIdMatch(session, userId);
    if (forbidden) return forbidden;

    const body = await request.json();
    const res = await expressFetch(
      `/cart/${userId}/sync`,
      { method: "POST", body: JSON.stringify(body) },
      session.token
    );
    return forwardExpressJson(res);
  } catch {
    return NextResponse.json({ message: "Failed to sync cart" }, { status: 500 });
  }
}
