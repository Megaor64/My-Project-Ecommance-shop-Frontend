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
import { googleAuthSchema } from "@/lib/validations/auth";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (!checkRateLimit(`auth-google:${ip}`, 10, 60_000)) {
    return rateLimitResponse();
  }

  try {
    const parsed = googleAuthSchema.safeParse(await request.json());
    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const { idToken, intent, remember, adminPass } = parsed.data;

    const res = await expressFetch("/auth/google", {
      method: "POST",
      body: JSON.stringify({
        idToken,
        intent,
        ...(adminPass !== undefined ? { adminPass } : {}),
      }),
    });

    const json = (await res.json()) as {
      message?: string;
      data?: unknown;
    };

    const token = extractAccessToken(json.data);
    if (!res.ok || !token) {
      return NextResponse.json(
        { message: json.message ?? "Google sign-in failed" },
        { status: res.status || 400 }
      );
    }

    const user = await fetchUserByToken(token);
    if (!user) {
      return NextResponse.json(
        { message: "Could not load user profile" },
        { status: 500 }
      );
    }

    if (intent === "admin-login" || intent === "admin-register") {
      if (user.role !== "admin") {
        return NextResponse.json(
          { message: "Forbidden" },
          { status: 403 }
        );
      }
    }

    await setAuthCookies(token, Boolean(remember));

    return NextResponse.json({ user, accessToken: token });
  } catch {
    return NextResponse.json(
      { message: "Google sign-in failed" },
      { status: 500 }
    );
  }
}
