import { NextResponse } from "next/server";
import { fetchUserByToken, getAuthTokenFromCookies } from "@/lib/auth-server";

export async function GET() {
  try {
    const token = await getAuthTokenFromCookies();
    if (!token) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    const user = await fetchUserByToken(token);
    if (!user) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }
}
