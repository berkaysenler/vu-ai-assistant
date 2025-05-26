import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWTEdge } from "@/lib/auth-edge";

// Define protected routes
const protectedRoutes = ["/dashboard", "/profile", "/chat"];
const authRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/verify",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/verify-email-change",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth-token")?.value;

  console.log("Middleware:", { pathname, hasToken: !!token });

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if route is auth route
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // If protected route and no token, redirect to login
  if (isProtectedRoute && !token) {
    console.log("Protected route without token, redirecting to login");
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // If protected route, verify token
  if (isProtectedRoute && token) {
    const payload = await verifyJWTEdge(token);
    if (!payload) {
      console.log("Invalid token, redirecting to login");
      // Clear invalid token
      const response = NextResponse.redirect(
        new URL("/auth/login", request.url)
      );
      response.cookies.delete("auth-token");
      return response;
    }

    // Add user info to headers for the page to use
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", payload.userId as string);
    requestHeaders.set("x-user-email", payload.email as string);
    requestHeaders.set("x-user-name", payload.fullName as string);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // If auth route and has valid token, redirect to dashboard
  if (isAuthRoute && token) {
    const payload = await verifyJWTEdge(token);
    if (payload) {
      console.log("Already logged in, redirecting to dashboard");
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

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
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
