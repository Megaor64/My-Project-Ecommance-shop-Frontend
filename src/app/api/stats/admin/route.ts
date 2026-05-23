import { NextResponse } from "next/server";
import { expressFetch, isAuthError, requireAdmin } from "@/lib/auth-server";

export type AdminStatsResponse = {
  userCount: number;
  salesByProduct: { productId: string; totalSold: number }[];
};

export async function GET() {
  try {
    const session = await requireAdmin();
    if (isAuthError(session)) return session;

    const res = await expressFetch("/stats/admin", { method: "GET" }, session.token);
    const json = (await res.json()) as {
      message?: string;
      data?: AdminStatsResponse;
    };

    if (!res.ok) {
      return NextResponse.json(
        { message: json.message ?? "Failed to fetch stats" },
        { status: res.status }
      );
    }

    return NextResponse.json(json.data ?? { userCount: 0, salesByProduct: [] });
  } catch {
    return NextResponse.json(
      { message: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
