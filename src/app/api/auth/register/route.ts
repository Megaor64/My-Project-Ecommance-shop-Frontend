import { NextResponse } from "next/server";
import { expressFetch } from "@/lib/auth-server";
import { validationErrorResponse } from "@/lib/api-utils";
import {
  checkRateLimit,
  getClientIp,
  rateLimitResponse,
} from "@/lib/rate-limit";
import { registerSchema } from "@/lib/validations/auth";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (!checkRateLimit(`auth-register:${ip}`, 5, 60_000)) {
    return rateLimitResponse();
  }

  try {
    const parsed = registerSchema.safeParse(await request.json());
    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const res = await expressFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify(parsed.data),
    });

    const json = (await res.json()) as {
      message?: string;
    };

    if (!res.ok) {
      return NextResponse.json(
        { message: json.message ?? "Registration failed" },
        { status: res.status || 400 }
      );
    }

    return NextResponse.json({
      needsVerification: true,
      email: parsed.data.email,
      message: json.message ?? "Verification code sent.",
    });
  } catch {
    return NextResponse.json(
      { message: "Registration failed" },
      { status: 500 }
    );
  }
}
