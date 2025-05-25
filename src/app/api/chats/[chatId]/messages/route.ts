import { NextRequest } from "next/server";
import { Pool } from "pg";
import { verifyJWT } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/response";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET /api/chats/[chatId] - Get specific chat with messages
export async function GET(
  request: NextRequest,
  { params }: { params: { chatId: string } }
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

    const chatId = params.chatId;
    if (!chatId) {
      return errorResponse("Chat ID is required", 400);
    }

    const client = await pool.connect();

    try {
      // First, verify that the chat belongs to the user
      const chatResult = await client.query(
        `
        SELECT 
          id, 
          name, 
          "createdAt", 
          "updatedAt"
        FROM chats 
        WHERE id = $1 AND "userId" = $2
      `,
        [chatId, payload.userId]
      );

      if (chatResult.rows.length === 0) {
        return errorResponse("Chat not found", 404);
      }

      const chat = chatResult.rows[0];

      // Get all messages for this chat
      const messagesResult = await client.query(
        `
        SELECT 
          id,
          content,
          role,
          "createdAt",
          "updatedAt"
        FROM messages 
        WHERE "chatId" = $1 
        ORDER BY "createdAt" ASC
      `,
        [chatId]
      );

      const chatWithMessages = {
        ...chat,
        messages: messagesResult.rows,
      };

      return successResponse("Chat retrieved successfully", {
        chat: chatWithMessages,
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Get chat error:", error);
    return errorResponse("An error occurred while fetching chat", 500);
  }
}

// DELETE /api/chats/[chatId] - Delete specific chat
export async function DELETE(
  request: NextRequest,
  { params }: { params: { chatId: string } }
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

    const chatId = params.chatId;
    if (!chatId) {
      return errorResponse("Chat ID is required", 400);
    }

    const client = await pool.connect();

    try {
      // First, verify that the chat belongs to the user
      const chatResult = await client.query(
        'SELECT id FROM chats WHERE id = $1 AND "userId" = $2',
        [chatId, payload.userId]
      );

      if (chatResult.rows.length === 0) {
        return errorResponse("Chat not found", 404);
      }

      // Delete the chat (messages will be deleted automatically due to CASCADE)
      await client.query("DELETE FROM chats WHERE id = $1", [chatId]);

      console.log("Chat deleted:", chatId);

      return successResponse("Chat deleted successfully");
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Delete chat error:", error);
    return errorResponse("An error occurred while deleting chat", 500);
  }
}

// PUT /api/chats/[chatId] - Update chat (e.g., rename)
export async function PUT(
  request: NextRequest,
  { params }: { params: { chatId: string } }
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

    const chatId = params.chatId;
    if (!chatId) {
      return errorResponse("Chat ID is required", 400);
    }

    const body = await request.json();
    const { name } = body;

    if (!name || name.trim().length === 0) {
      return errorResponse("Chat name is required", 400);
    }

    const client = await pool.connect();

    try {
      // First, verify that the chat belongs to the user
      const chatResult = await client.query(
        'SELECT id FROM chats WHERE id = $1 AND "userId" = $2',
        [chatId, payload.userId]
      );

      if (chatResult.rows.length === 0) {
        return errorResponse("Chat not found", 404);
      }

      // Update the chat name
      const updatedChatResult = await client.query(
        `
        UPDATE chats 
        SET name = $1, "updatedAt" = NOW() 
        WHERE id = $2 
        RETURNING id, name, "createdAt", "updatedAt"
      `,
        [name.trim(), chatId]
      );

      const updatedChat = updatedChatResult.rows[0];

      console.log("Chat updated:", updatedChat);

      return successResponse("Chat updated successfully", {
        chat: updatedChat,
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Update chat error:", error);
    return errorResponse("An error occurred while updating chat", 500);
  }
}
