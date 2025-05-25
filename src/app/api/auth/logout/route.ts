import { NextRequest } from "next/server";
import { Pool } from "pg";
import { successResponse, errorResponse } from "@/lib/response";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;

    if (token) {
      const client = await pool.connect();

      try {
        // Remove session from database
        await client.query("DELETE FROM sessions WHERE token = $1", [token]);
        console.log("Session removed from database");
      } finally {
        client.release();
      }
    }

    // Create response
    const response = successResponse("Logged out successfully");

    // Clear cookie
    response.cookies.set("auth-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0, // Expire immediately
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return errorResponse("An error occurred during logout", 500);
  }
}
