import { NextResponse } from "next/server";
import {
  expressFetch,
  isAuthError,
  requireAuth,
} from "@/lib/auth-server";
import { forwardExpressJson, requireUserIdMatch } from "@/lib/bff-utils";
import { validationErrorResponse } from "@/lib/api-utils";
import { appearanceSchema } from "@/lib/validations/settings";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const session = await requireAuth();
    if (isAuthError(session)) return session;

    const { id } = await context.params;
    const forbidden = requireUserIdMatch(session, id);
    if (forbidden && session.payload.role !== "admin") return forbidden;

    const parsed = appearanceSchema.safeParse(await request.json());
    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const res = await expressFetch(
      `/users/${id}/settings/appearance`,
      { method: "PATCH", body: JSON.stringify(parsed.data) },
      session.token
    );
    return forwardExpressJson(res);
  } catch {
    return NextResponse.json({ message: "Failed to update appearance" }, { status: 500 });
  }
}
