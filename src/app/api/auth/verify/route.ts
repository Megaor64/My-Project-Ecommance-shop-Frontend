import { NextResponse } from "next/server";
import { expressFetch } from "@/lib/auth-server";
import { validationErrorResponse } from "@/lib/api-utils";
import {
  checkRateLimit,
  getClientIp,
  rateLimitResponse,
} from "@/lib/rate-limit";
import { verifyEmailSchema } from "@/lib/validations/auth";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (!checkRateLimit(`auth-verify:${ip}`, 10, 60_000)) {
    return rateLimitResponse();
  }

  try {
    const parsed = verifyEmailSchema.safeParse(await request.json());
    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const res = await expressFetch("/auth/verify", {
      method: "POST",
      body: JSON.stringify(parsed.data),
    });

    const json = (await res.json()) as {
      message?: string;
    };

    if (!res.ok) {
      return NextResponse.json(
        { message: json.message ?? "Verification failed" },
        { status: res.status || 400 }
      );
    }

    return NextResponse.json({
      verified: true,
      message: json.message ?? "Email verified successfully",
    });
  } catch {
    return NextResponse.json(
      { message: "Verification failed" },
      { status: 500 }
    );
  }
}
