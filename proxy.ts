import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ─── Routes protégées ─────────────────────────────────────────────────────────

const PROTECTED_PREFIXES = ["/dashboard", "/certificates", "/profile"];
const AUTH_ROUTES = ["/auth/login", "/auth/register"];

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  const session = await auth();

  if (isProtected && !session) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Intercepte toutes les routes SAUF :
     * - _next/static (assets)
     * - _next/image (optimisation images)
     * - favicon.ico
     * - api/auth (routes internes Auth.js)
     */
    "/((?!_next/static|_next/image|favicon.ico|api/auth).*)",
  ],
};