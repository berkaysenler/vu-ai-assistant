import { NextRequest } from "next/server";
import { Pool } from "pg";
import { verifyJWT } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/response";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// DELETE /api/user/delete-account - Delete user account
export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return errorResponse("No authentication token found", 401);
    }

    const payload = verifyJWT(token);
    if (!payload) {
      return errorResponse("Invalid or expired token", 401);
    }

    const body = await request.json();
    const { confirmationText } = body;

    // Require confirmation text
    if (confirmationText !== "DELETE MY ACCOUNT") {
      return errorResponse('Please type "DELETE MY ACCOUNT" to confirm', 400);
    }

    const client = await pool.connect();

    try {
      // Get all user's chat IDs
      const chatsResult = await client.query(
        'SELECT id FROM chats WHERE "userId" = $1',
        [payload.userId]
      );

      const chatIds = chatsResult.rows.map((row) => row.id);

      // Delete messages
      if (chatIds.length > 0) {
        await client.query('DELETE FROM messages WHERE "chatId" = ANY($1)', [
          chatIds,
        ]);
      }

      // Delete chats
      await client.query('DELETE FROM chats WHERE "userId" = $1', [
        payload.userId,
      ]);

      // Delete sessions
      await client.query('DELETE FROM sessions WHERE "userId" = $1', [
        payload.userId,
      ]);

      // Delete verification tokens
      const userResult = await client.query(
        "SELECT email FROM users WHERE id = $1",
        [payload.userId]
      );

      if (userResult.rows.length > 0) {
        await client.query("DELETE FROM verification_tokens WHERE email = $1", [
          userResult.rows[0].email,
        ]);
      }

      // Finally, delete the user
      await client.query("DELETE FROM users WHERE id = $1", [payload.userId]);

      console.log("Account deleted for user:", payload.userId);

      // Clear the auth cookie
      const response = successResponse("Account deleted successfully");
      response.cookies.set("auth-token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 0,
        path: "/",
      });

      return response;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Delete account error:", error);
    return errorResponse("An error occurred while deleting account", 500);
  }
}
