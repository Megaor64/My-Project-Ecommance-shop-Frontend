import { NextResponse } from "next/server";
import {
  clearAuthCookies,
  expressFetch,
  fetchUserByToken,
  getAuthTokenFromCookies,
} from "@/lib/auth-server";

export async function POST() {
  try {
    const token = await getAuthTokenFromCookies();
    let email: string | undefined;

    if (token) {
      const user = await fetchUserByToken(token);
      email = user?.email;

      if (email) {
        await expressFetch("/auth/logout", {
          method: "POST",
          body: JSON.stringify({ email, token }),
        });
      }
    }

    await clearAuthCookies();

    return NextResponse.json({ message: "Logged out" });
  } catch {
    await clearAuthCookies();
    return NextResponse.json({ message: "Logged out" });
  }
}
