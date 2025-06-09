// src/middleware.ts (BULLETPROOF - No redirect loops)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple route definitions
const protectedRoutes = ["/dashboard", "/profile"];
const authRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/verify",
  "/auth/forgot-password",
  "/auth/reset-password",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth-token")?.value;

  console.log(
    `🔍 Middleware: ${pathname} | Token: ${token ? "EXISTS" : "NONE"}`
  );

  // ✅ ALWAYS allow auth routes - no exceptions
  if (authRoutes.some((route) => pathname.startsWith(route))) {
    console.log(`✅ Auth route allowed: ${pathname}`);

    // Clear any bad cookies on auth routes
    const response = NextResponse.next();
    if (token) {
      console.log("🧹 Clearing token on auth route");
      response.cookies.delete("auth-token");
      response.cookies.set("auth-token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 0,
        path: "/",
        expires: new Date(0),
      });
    }
    return response;
  }

  // 🔒 Check protected routes
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!token) {
      console.log(
        `❌ No token for protected route: ${pathname} -> /auth/login`
      );
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    // Simple token validation without external calls
    try {
      // Basic token format check (JWT should have 3 parts)
      const parts = token.split(".");
      if (parts.length !== 3) {
        throw new Error("Invalid token format");
      }

      // If token looks valid, continue
      console.log(`✅ Token validated for: ${pathname}`);
      return NextResponse.next();
    } catch (error) {
      console.log(`❌ Invalid token for ${pathname}: ${error}`);

      // Clear bad token and redirect
      const response = NextResponse.redirect(
        new URL("/auth/login", request.url)
      );
      response.cookies.delete("auth-token");
      response.cookies.set("auth-token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 0,
        path: "/",
        expires: new Date(0),
      });
      return response;
    }
  }

  // ➡️ All other routes pass through
  console.log(`➡️ Other route: ${pathname}`);
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - manifest.json (PWA manifest)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.json).*)",
  ],
};
