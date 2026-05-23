import { NextResponse } from "next/server";
import { expressFetch } from "@/lib/auth-server";
import { validationErrorResponse } from "@/lib/api-utils";
import {
  checkRateLimit,
  getClientIp,
  rateLimitResponse,
} from "@/lib/rate-limit";
import { adminLoginStep1Schema } from "@/lib/validations/auth";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (!checkRateLimit(`auth-admin-login:${ip}`, 10, 60_000)) {
    return rateLimitResponse();
  }

  try {
    const parsed = adminLoginStep1Schema.safeParse(await request.json());
    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const res = await expressFetch("/auth/admin/login", {
      method: "POST",
      body: JSON.stringify(parsed.data),
    });

    const json = (await res.json()) as {
      message?: string;
    };

    if (!res.ok) {
      return NextResponse.json(
        { message: json.message ?? "Admin login failed" },
        { status: res.status || 400 }
      );
    }

    return NextResponse.json({
      message: json.message ?? "Verification code sent.",
      needsOtp: true,
    });
  } catch {
    return NextResponse.json(
      { message: "Admin login failed" },
      { status: 500 }
    );
  }
}
