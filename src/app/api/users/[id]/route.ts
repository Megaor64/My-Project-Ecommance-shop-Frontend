import { NextResponse } from "next/server";
import {
  clearAuthCookies,
  expressFetch,
  fetchUserByToken,
  isAuthError,
  requireAuth,
} from "@/lib/auth-server";
import { mapExpressUser } from "@/lib/auth";
import { forwardExpressJson, requireUserIdMatch } from "@/lib/bff-utils";
import { validationErrorResponse } from "@/lib/api-utils";
import { updateUserSchema } from "@/lib/validations/auth";

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const session = await requireAuth();
    if (isAuthError(session)) return session;

    const { id } = await context.params;
    const forbidden = requireUserIdMatch(session, id);
    if (forbidden) return forbidden;

    const res = await expressFetch(
      `/users/${id}`,
      { method: "DELETE" },
      session.token
    );

    if (!res.ok) {
      return forwardExpressJson(res);
    }

    await clearAuthCookies();
    return NextResponse.json({ message: "Account deleted" });
  } catch {
    return NextResponse.json({ message: "Delete failed" }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const session = await requireAuth();
    if (isAuthError(session)) return session;

    const { id } = await context.params;
    if (session.payload.userId !== id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const parsed = updateUserSchema.safeParse(await request.json());
    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const res = await expressFetch(
      `/users/${id}`,
      { method: "PATCH", body: JSON.stringify(parsed.data) },
      session.token
    );

    const json = (await res.json()) as {
      message?: string;
      data?: Record<string, unknown>;
    };

    if (!res.ok) {
      return NextResponse.json(
        { message: json.message ?? "Update failed" },
        { status: res.status }
      );
    }

    if (json.data) {
      return NextResponse.json(mapExpressUser(json.data));
    }

    const user = await fetchUserByToken(session.token);
    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ message: "Update failed" }, { status: 500 });
  }
}
