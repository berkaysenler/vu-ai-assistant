// src/app/api/auth/logout/route.ts (ENHANCED - Better cookie clearing)
import { NextRequest } from "next/server";
import { Pool } from "pg";
import { successResponse, errorResponse } from "@/lib/response";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(request: NextRequest) {
  console.log("Logout API called");

  try {
    const token = request.cookies.get("auth-token")?.value;
    console.log("Token found during logout:", !!token);

    if (token) {
      const client = await pool.connect();

      try {
        // Remove session from database
        const result = await client.query(
          "DELETE FROM sessions WHERE token = $1",
          [token]
        );
        console.log("Sessions removed from database:", result.rowCount);
      } finally {
        client.release();
      }
    }

    // Create response
    const response = successResponse("Logged out successfully");

    // ENHANCED: Clear cookie with multiple approaches to ensure it's removed
    response.cookies.set("auth-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0, // Expire immediately
      path: "/",
      expires: new Date(0), // Set expiry to epoch
    });

    // Also try to delete the cookie entirely (some browsers need this)
    response.cookies.delete("auth-token");

    console.log("Logout successful, cookie cleared");
    return response;
  } catch (error) {
    console.error("Logout error:", error);

    // Even if there's an error, clear the cookie
    const response = errorResponse("An error occurred during logout", 500);
    response.cookies.set("auth-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
      path: "/",
      expires: new Date(0),
    });
    response.cookies.delete("auth-token");

    return response;
  }
}
