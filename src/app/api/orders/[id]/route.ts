import { NextResponse } from "next/server";
import { expressFetch, isAuthError, requireAuth } from "@/lib/auth-server";

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const session = await requireAuth();
    if (isAuthError(session)) return session;

    const { id } = await context.params;

    const res = await expressFetch(
      `/orders/${id}`,
      { method: "DELETE" },
      session.token
    );

    const json = (await res.json()) as { message?: string };

    if (!res.ok) {
      return NextResponse.json(
        { message: json.message ?? "Failed to delete order" },
        { status: res.status }
      );
    }

    return NextResponse.json({
      message: json.message ?? "Order deleted",
    });
  } catch {
    return NextResponse.json(
      { message: "Failed to delete order" },
      { status: 500 }
    );
  }
}
