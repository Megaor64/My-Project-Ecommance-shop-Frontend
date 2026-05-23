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
import { loginSchema } from "@/lib/validations/auth";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (!checkRateLimit(`auth-login:${ip}`, 10, 60_000)) {
    return rateLimitResponse();
  }

  try {
    const parsed = loginSchema.safeParse(await request.json());
    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const { email, password, remember } = parsed.data;

    const res = await expressFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    const json = (await res.json()) as {
      status?: number;
      message?: string;
      data?: unknown;
    };

    const token = extractAccessToken(json.data);
    if (!res.ok || !token) {
      return NextResponse.json(
        { message: json.message ?? "Login failed" },
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

    await setAuthCookies(token, Boolean(remember));

    return NextResponse.json({ user, accessToken: token });
  } catch {
    return NextResponse.json({ message: "Login failed" }, { status: 500 });
  }
}
