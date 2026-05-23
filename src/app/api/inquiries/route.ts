import { NextResponse } from "next/server";
import { expressFetch, isAuthError, requireAdmin } from "@/lib/auth-server";
import { validationErrorResponse } from "@/lib/api-utils";
import {
  checkRateLimit,
  getClientIp,
  rateLimitResponse,
} from "@/lib/rate-limit";
import { inquiryCreateSchema } from "@/lib/validations/auth";

export async function GET() {
  try {
    const session = await requireAdmin();
    if (isAuthError(session)) return session;

    const res = await expressFetch("/inquiries", { method: "GET" }, session.token);
    const json = (await res.json()) as {
      message?: string;
      data?: unknown;
    };

    if (!res.ok) {
      return NextResponse.json(
        { message: json.message ?? "Failed to fetch inquiries" },
        { status: res.status }
      );
    }

    return NextResponse.json(json.data ?? []);
  } catch {
    return NextResponse.json(
      { message: "Failed to fetch inquiries" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (!checkRateLimit(`inquiry-create:${ip}`, 5, 60_000)) {
    return rateLimitResponse();
  }

  try {
    const parsed = inquiryCreateSchema.safeParse(await request.json());
    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const res = await expressFetch("/inquiries", {
      method: "POST",
      body: JSON.stringify(parsed.data),
    });

    const json = (await res.json()) as {
      message?: string;
      data?: unknown;
    };

    if (!res.ok) {
      return NextResponse.json(
        { message: json.message ?? "Failed to submit inquiry" },
        { status: res.status || 400 }
      );
    }

    return NextResponse.json(json.data, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: "Failed to submit inquiry" },
      { status: 500 }
    );
  }
}
