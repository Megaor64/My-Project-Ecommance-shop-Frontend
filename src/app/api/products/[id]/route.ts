import { NextResponse } from "next/server";
import { expressFetch, isAuthError, requireAdmin } from "@/lib/auth-server";
import { forwardExpressJson } from "@/lib/bff-utils";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const res = await expressFetch(`/products/${id}`, { method: "GET" });
    return forwardExpressJson(res);
  } catch {
    return NextResponse.json({ message: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const session = await requireAdmin();
    if (isAuthError(session)) return session;

    const { id } = await context.params;
    const body = await request.json();
    const res = await expressFetch(
      `/products/${id}`,
      { method: "PATCH", body: JSON.stringify(body) },
      session.token
    );
    return forwardExpressJson(res);
  } catch {
    return NextResponse.json({ message: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const session = await requireAdmin();
    if (isAuthError(session)) return session;

    const { id } = await context.params;
    const res = await expressFetch(
      `/products/${id}`,
      { method: "DELETE" },
      session.token
    );
    return forwardExpressJson(res);
  } catch {
    return NextResponse.json({ message: "Failed to delete product" }, { status: 500 });
  }
}
