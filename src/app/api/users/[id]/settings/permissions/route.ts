import { NextResponse } from "next/server";
import {
  expressFetch,
  isAuthError,
  requireAdmin,
} from "@/lib/auth-server";
import { forwardExpressJson } from "@/lib/bff-utils";
import { validationErrorResponse } from "@/lib/api-utils";
import { permissionsPatchSchema } from "@/lib/validations/settings";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const session = await requireAdmin();
    if (isAuthError(session)) return session;

    const { id } = await context.params;
    const parsed = permissionsPatchSchema.safeParse(await request.json());
    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const res = await expressFetch(
      `/users/${id}/settings/permissions`,
      { method: "PATCH", body: JSON.stringify(parsed.data) },
      session.token
    );
    return forwardExpressJson(res);
  } catch {
    return NextResponse.json(
      { message: "Failed to update permissions" },
      { status: 500 }
    );
  }
}
