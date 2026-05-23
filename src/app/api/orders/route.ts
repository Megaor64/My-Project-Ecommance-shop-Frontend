import { NextResponse } from "next/server";
import { expressFetch, isAuthError, requireAuth } from "@/lib/auth-server";
import { forwardExpressJson } from "@/lib/bff-utils";

export async function POST(request: Request) {
  try {
    const session = await requireAuth();
    if (isAuthError(session)) return session;

    const body = await request.json();
    const res = await expressFetch(
      "/orders",
      { method: "POST", body: JSON.stringify(body) },
      session.token
    );
    return forwardExpressJson(res);
  } catch {
    return NextResponse.json({ message: "Failed to create order" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await requireAuth();
    if (isAuthError(session)) return session;

    const res = await expressFetch("/orders", { method: "GET" }, session.token);
    const json = (await res.json()) as {
      message?: string;
      data?: unknown;
    };

    if (!res.ok) {
      return NextResponse.json(
        { message: json.message ?? "Failed to fetch orders" },
        { status: res.status }
      );
    }

    return NextResponse.json(json.data ?? []);
  } catch {
    return NextResponse.json({ message: "Failed to fetch orders" }, { status: 500 });
  }
}
