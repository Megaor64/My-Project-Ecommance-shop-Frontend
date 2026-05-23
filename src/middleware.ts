import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { AUTH_COOKIE_NAMES } from "@/lib/auth";

const PROTECTED_ROUTES = ["/account"];
const ADMIN_ROUTES = ["/admin/inquiries", "/admin/products", "/admin/users"];

function matchesRoute(pathname: string, routes: string[]): boolean {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

function getJwtSecret(): Uint8Array | null {
  const secret = process.env.JWT_SECRET;
  if (!secret) return null;
  return new TextEncoder().encode(secret);
}

async function verifyAuthToken(
  token: string
): Promise<{ userId: string; role: string } | null> {
  const secret = getJwtSecret();
  if (!secret) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.userId;
    const role = payload.role;
    if (typeof userId !== "string" || typeof role !== "string") return null;
    return { userId, role };
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const needsAuth =
    matchesRoute(pathname, PROTECTED_ROUTES) ||
    matchesRoute(pathname, ADMIN_ROUTES);

  if (!needsAuth) {
    return NextResponse.next();
  }

  const token = request.cookies.get(AUTH_COOKIE_NAMES.token)?.value;
  if (!token) {
    const loginUrl = new URL(
      matchesRoute(pathname, ADMIN_ROUTES) ? "/admin/login" : "/login",
      request.url
    );
    if (!matchesRoute(pathname, ADMIN_ROUTES)) {
      loginUrl.searchParams.set("from", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  const session = await verifyAuthToken(token);
  if (!session) {
    const response = NextResponse.redirect(
      new URL(
        matchesRoute(pathname, ADMIN_ROUTES) ? "/admin/login" : "/login",
        request.url
      )
    );
    response.cookies.delete(AUTH_COOKIE_NAMES.token);
    response.cookies.delete("is-logged-in");
    response.cookies.delete("user-role");
    return response;
  }

  if (matchesRoute(pathname, ADMIN_ROUTES) && session.role !== "admin") {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*", "/admin/:path*"],
};
