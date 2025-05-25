import { NextRequest } from "next/server";
import { Pool } from "pg";
import { verifyJWT } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/response";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return errorResponse("No authentication token found", 401);
    }

    // Verify JWT token
    const payload = verifyJWT(token);
    if (!payload) {
      return errorResponse("Invalid or expired token", 401);
    }

    const client = await pool.connect();

    try {
      // Get user info from database
      const userResult = await client.query(
        'SELECT id, email, "fullName", "displayName", verified FROM users WHERE id = $1',
        [payload.userId]
      );

      if (userResult.rows.length === 0) {
        return errorResponse("User not found", 404);
      }

      const user = userResult.rows[0];

      return successResponse("User data retrieved successfully", {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          displayName: user.displayName || user.fullName,
          verified: user.verified,
        },
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Get user error:", error);
    return errorResponse("An error occurred while fetching user data", 500);
  }
}
