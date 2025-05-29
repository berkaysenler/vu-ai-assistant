// src/app/api/chats/[chatId]/messages/[messageId]/route.ts
import { NextRequest } from "next/server";
import { Pool } from "pg";
import { verifyJWT } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/response";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// PUT /api/chats/[chatId]/messages/[messageId] - Edit message
export async function PUT(
  request: NextRequest,
  { params }: { params: { chatId: string; messageId: string } }
) {
  try {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return errorResponse("No authentication token found", 401);
    }

    const payload = verifyJWT(token);
    if (!payload) {
      return errorResponse("Invalid or expired token", 401);
    }

    const { chatId, messageId } = params;
    const body = await request.json();
    const { content } = body;

    if (!content || !content.trim()) {
      return errorResponse("Message content is required", 400);
    }

    const client = await pool.connect();

    try {
      // First verify the chat belongs to the user
      const chatResult = await client.query(
        `SELECT id FROM chats WHERE id = $1 AND "userId" = $2`,
        [chatId, payload.userId]
      );

      if (chatResult.rows.length === 0) {
        return errorResponse("Chat not found", 404);
      }

      // Verify the message exists and belongs to the chat (and is a user message)
      const messageResult = await client.query(
        `SELECT id, role FROM messages WHERE id = $1 AND "chatId" = $2`,
        [messageId, chatId]
      );

      if (messageResult.rows.length === 0) {
        return errorResponse("Message not found", 404);
      }

      const message = messageResult.rows[0];

      // Only allow editing user messages
      if (message.role !== "USER") {
        return errorResponse("Only user messages can be edited", 400);
      }

      // Update the message
      const updateResult = await client.query(
        `UPDATE messages 
         SET content = $1, "updatedAt" = NOW() 
         WHERE id = $2 
         RETURNING id, content, role, "createdAt", "updatedAt"`,
        [content.trim(), messageId]
      );

      const updatedMessage = updateResult.rows[0];

      // Update chat's updatedAt timestamp
      await client.query(`UPDATE chats SET "updatedAt" = NOW() WHERE id = $1`, [
        chatId,
      ]);

      console.log("Message edited successfully:", messageId);

      return successResponse("Message updated successfully", {
        message: updatedMessage,
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Edit message error:", error);
    return errorResponse("An error occurred while editing message", 500);
  }
}

// DELETE /api/chats/[chatId]/messages/[messageId] - Delete message
export async function DELETE(
  request: NextRequest,
  { params }: { params: { chatId: string; messageId: string } }
) {
  try {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return errorResponse("No authentication token found", 401);
    }

    const payload = verifyJWT(token);
    if (!payload) {
      return errorResponse("Invalid or expired token", 401);
    }

    const { chatId, messageId } = params;

    const client = await pool.connect();

    try {
      // First verify the chat belongs to the user
      const chatResult = await client.query(
        `SELECT id FROM chats WHERE id = $1 AND "userId" = $2`,
        [chatId, payload.userId]
      );

      if (chatResult.rows.length === 0) {
        return errorResponse("Chat not found", 404);
      }

      // Verify the message exists and belongs to the chat (and is a user message)
      const messageResult = await client.query(
        `SELECT id, role FROM messages WHERE id = $1 AND "chatId" = $2`,
        [messageId, chatId]
      );

      if (messageResult.rows.length === 0) {
        return errorResponse("Message not found", 404);
      }

      const message = messageResult.rows[0];

      // Only allow deleting user messages
      if (message.role !== "USER") {
        return errorResponse("Only user messages can be deleted", 400);
      }

      // Delete the message
      await client.query(`DELETE FROM messages WHERE id = $1`, [messageId]);

      // Update chat's updatedAt timestamp
      await client.query(`UPDATE chats SET "updatedAt" = NOW() WHERE id = $1`, [
        chatId,
      ]);

      console.log("Message deleted successfully:", messageId);

      return successResponse("Message deleted successfully");
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Delete message error:", error);
    return errorResponse("An error occurred while deleting message", 500);
  }
}
