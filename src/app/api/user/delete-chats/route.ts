import { NextRequest } from "next/server";
import { Pool } from "pg";
import { verifyJWT } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/response";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// DELETE /api/user/delete-chats - Delete all user's chats
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

    const client = await pool.connect();

    try {
      // Get all user's chat IDs
      const chatsResult = await client.query(
        'SELECT id FROM chats WHERE "userId" = $1',
        [payload.userId]
      );

      const chatIds = chatsResult.rows.map((row) => row.id);

      if (chatIds.length === 0) {
        return successResponse("No chats to delete");
      }

      // Delete all messages for user's chats
      await client.query('DELETE FROM messages WHERE "chatId" = ANY($1)', [
        chatIds,
      ]);

      // Delete all user's chats
      const deleteResult = await client.query(
        'DELETE FROM chats WHERE "userId" = $1',
        [payload.userId]
      );

      console.log(
        `Deleted ${deleteResult.rowCount} chats for user:`,
        payload.userId
      );

      return successResponse(
        `Successfully deleted ${deleteResult.rowCount} chats and all associated messages`
      );
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Delete chats error:", error);
    return errorResponse("An error occurred while deleting chats", 500);
  }
}
