import { NextResponse } from "next/server";
import {
  expressFetch,
  extractAccessToken,
  fetchUserByToken,
  setAuthCookies,
} from "@/lib/auth-server";
import { validationErrorResponse } from "@/lib/api-utils";
import {
  checkRateLimit,
  getClientIp,
  rateLimitResponse,
} from "@/lib/rate-limit";
import { adminLoginOtpSchema } from "@/lib/validations/auth";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (!checkRateLimit(`auth-admin-verify:${ip}`, 10, 60_000)) {
    return rateLimitResponse();
  }

  try {
    const parsed = adminLoginOtpSchema.safeParse(await request.json());
    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const { email, code, remember } = parsed.data;

    const res = await expressFetch("/auth/admin/login2", {
      method: "POST",
      body: JSON.stringify({ email, code }),
    });

    const json = (await res.json()) as {
      message?: string;
      data?: unknown;
    };

    const token = extractAccessToken(json.data);
    if (!res.ok || !token) {
      return NextResponse.json(
        { message: json.message ?? "Invalid verification code" },
        { status: res.status || 400 }
      );
    }

    const user = await fetchUserByToken(token);
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { message: user ? "Forbidden" : "Could not load user profile" },
        { status: user ? 403 : 500 }
      );
    }

    await setAuthCookies(token, Boolean(remember));

    return NextResponse.json({ user, accessToken: token });
  } catch {
    return NextResponse.json(
      { message: "Admin login failed" },
      { status: 500 }
    );
  }
}
