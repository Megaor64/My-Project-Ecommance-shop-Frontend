import { NextResponse } from "next/server";
import { expressFetch } from "@/lib/auth-server";
import {
  isAdminRegisterEnabled,
  validationErrorResponse,
} from "@/lib/api-utils";
import {
  checkRateLimit,
  getClientIp,
  rateLimitResponse,
} from "@/lib/rate-limit";
import { adminRegisterSchema } from "@/lib/validations/auth";

export async function POST(request: Request) {
  if (!(await isAdminRegisterEnabled())) {
    return NextResponse.json(
      { message: "Admin registration is disabled" },
      { status: 403 }
    );
  }

  const ip = getClientIp(request);
  if (!checkRateLimit(`auth-admin-register:${ip}`, 3, 60_000)) {
    return rateLimitResponse();
  }

  try {
    const parsed = adminRegisterSchema.safeParse(await request.json());
    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const { name, email, adminPass } = parsed.data;

    const res = await expressFetch("/auth/admin/register", {
      method: "POST",
      body: JSON.stringify({
        name,
        email,
        password: adminPass,
      }),
    });

    const json = (await res.json()) as {
      message?: string;
    };

    if (!res.ok) {
      return NextResponse.json(
        { message: json.message ?? "Admin registration failed" },
        { status: res.status || 400 }
      );
    }

    return NextResponse.json({
      needsVerification: true,
      email,
      message: json.message ?? "Verification code sent.",
    });
  } catch {
    return NextResponse.json(
      { message: "Admin registration failed" },
      { status: 500 }
    );
  }
}
