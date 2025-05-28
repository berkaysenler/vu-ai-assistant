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

  // Handle auth routes first
  if (isAuthRoute) {
    if (token) {
      // If there's a token, verify it
      const payload = await verifyJWTEdge(token);
      if (payload) {
        // Valid token - redirect to dashboard
        console.log("Valid token on auth route, redirecting to dashboard");
        return NextResponse.redirect(new URL("/dashboard", request.url));
      } else {
        // Invalid token - clear it and allow access to auth route
        console.log(
          "Invalid token on auth route, clearing token and allowing access"
        );
        const response = NextResponse.next();
        response.cookies.set("auth-token", "", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 0,
          path: "/",
        });
        return response;
      }
    } else {
      // No token - allow access to auth routes
      return NextResponse.next();
    }
  }

  // Handle protected routes
  if (isProtectedRoute) {
    if (!token) {
      // No token - redirect to login
      console.log("Protected route without token, redirecting to login");
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    // Verify token for protected routes
    const payload = await verifyJWTEdge(token);
    if (!payload) {
      console.log(
        "Invalid token on protected route, clearing and redirecting to login"
      );
      const response = NextResponse.redirect(
        new URL("/auth/login", request.url)
      );
      response.cookies.set("auth-token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 0,
        path: "/",
      });
      return response;
    }

    // Valid token - add user info to headers
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

  // For all other routes, just continue
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

// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except for the ones starting with:
//      * - api (API routes)
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      */
//     "/((?!api|_next/static|_next/image|favicon.ico).*)",
//   ],
// };

// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except for the ones starting with:
//      * - api (API routes)
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      */
//     "/((?!api|_next/static|_next/image|favicon.ico).*)",
//   ],
// };
