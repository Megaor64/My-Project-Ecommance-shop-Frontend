import { NextResponse } from "next/server";
import { expressFetch, isAuthError, requireAuth } from "@/lib/auth-server";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(_request: Request, context: RouteContext) {
  try {
    const session = await requireAuth();
    if (isAuthError(session)) return session;

    const { id } = await context.params;

    const res = await expressFetch(
      `/orders/${id}/cancel`,
      { method: "PATCH" },
      session.token
    );

    const json = (await res.json()) as {
      message?: string;
      data?: unknown;
    };

    if (!res.ok) {
      return NextResponse.json(
        { message: json.message ?? "Failed to cancel order" },
        { status: res.status }
      );
    }

    return NextResponse.json(json.data);
  } catch {
    return NextResponse.json(
      { message: "Failed to cancel order" },
      { status: 500 }
    );
  }
}
