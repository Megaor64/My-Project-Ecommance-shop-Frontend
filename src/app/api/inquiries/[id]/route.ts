import { NextResponse } from "next/server";
import { expressFetch, isAuthError, requireAdmin } from "@/lib/auth-server";
import { validationErrorResponse } from "@/lib/api-utils";
import { inquiryUpdateSchema } from "@/lib/validations/auth";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const session = await requireAdmin();
    if (isAuthError(session)) return session;

    const { id } = await context.params;
    const parsed = inquiryUpdateSchema.safeParse(await request.json());
    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const res = await expressFetch(
      `/inquiries/${id}`,
      { method: "PATCH", body: JSON.stringify(parsed.data) },
      session.token
    );

    const json = (await res.json()) as {
      message?: string;
      data?: unknown;
    };

    if (!res.ok) {
      return NextResponse.json(
        { message: json.message ?? "Failed to update inquiry" },
        { status: res.status }
      );
    }

    return NextResponse.json({
      inquiry: json.data,
      message: json.message ?? "Inquiry updated",
    });
  } catch {
    return NextResponse.json(
      { message: "Failed to update inquiry" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const session = await requireAdmin();
    if (isAuthError(session)) return session;

    const { id } = await context.params;

    const res = await expressFetch(
      `/inquiries/${id}`,
      { method: "DELETE" },
      session.token
    );

    const json = (await res.json()) as { message?: string };

    if (!res.ok) {
      return NextResponse.json(
        { message: json.message ?? "Failed to delete inquiry" },
        { status: res.status }
      );
    }

    return NextResponse.json({
      message: json.message ?? "Inquiry deleted",
    });
  } catch {
    return NextResponse.json(
      { message: "Failed to delete inquiry" },
      { status: 500 }
    );
  }
}
