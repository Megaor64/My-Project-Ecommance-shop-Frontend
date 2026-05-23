import { NextResponse } from "next/server";
import {
  expressFetch,
  getApiUrl,
  isAuthError,
  requireAdmin,
} from "@/lib/auth-server";
import { forwardExpressJson } from "@/lib/bff-utils";

export async function GET() {
  try {
    const res = await expressFetch("/products", { method: "GET" });
    return forwardExpressJson(res);
  } catch {
    return NextResponse.json({ message: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAdmin();
    if (isAuthError(session)) return session;

    const formData = await request.formData();
    const res = await fetch(`${getApiUrl()}/products`, {
      method: "POST",
      headers: { Authorization: `Bearer ${session.token}` },
      body: formData,
    });
    return forwardExpressJson(res);
  } catch {
    return NextResponse.json({ message: "Failed to create product" }, { status: 500 });
  }
}
