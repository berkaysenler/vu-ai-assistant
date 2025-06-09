// src/app/api/chats/route.ts (UPDATED - Skip welcome message for initial messages)
import { NextRequest } from "next/server";
import { Pool } from "pg";
import { verifyJWT } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/response";
import { getWelcomeMessage } from "@/lib/services/ai-service";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET /api/chats - Get user's chats
export async function GET(request: NextRequest) {
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
      // Get user's chats ordered by most recent
      const chatsResult = await client.query(
        `SELECT 
          id, 
          name, 
          "createdAt", 
          "updatedAt"
        FROM chats 
        WHERE "userId" = $1 
        ORDER BY "updatedAt" DESC`,
        [payload.userId]
      );

      return successResponse("Chats retrieved successfully", {
        chats: chatsResult.rows,
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Get chats error:", error);
    return errorResponse("An error occurred while fetching chats", 500);
  }
}

// POST /api/chats - Create new chat (UPDATED - Skip welcome for initial messages)
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return errorResponse("No authentication token found", 401);
    }

    const payload = verifyJWT(token);
    if (!payload) {
      return errorResponse("Invalid or expired token", 401);
    }

    // UPDATED: Parse request body to check for initial message
    let body = {};
    try {
      const requestBody = await request.text();
      if (requestBody) {
        body = JSON.parse(requestBody);
      }
    } catch (parseError) {
      // If parsing fails, continue with empty body (backward compatibility)
      console.log("No body or invalid JSON, continuing with empty body");
    }

    const { initialMessage } = body as { initialMessage?: string };

    const client = await pool.connect();

    try {
      // Create new chat with default name
      const chatResult = await client.query(
        `INSERT INTO chats (id, "userId", name, "createdAt", "updatedAt") 
         VALUES (gen_random_uuid(), $1, $2, NOW(), NOW()) 
         RETURNING id, name, "createdAt", "updatedAt"`,
        [payload.userId, "New Chat"]
      );

      const newChat = chatResult.rows[0];

      // UPDATED: Only add welcome message if no initial message is provided
      if (!initialMessage || !initialMessage.trim()) {
        // Create an AI-generated welcome message (original behavior)
        let welcomeMessage: string;
        try {
          welcomeMessage = getWelcomeMessage();
          console.log("Generated AI welcome message for new chat");
        } catch (error) {
          console.error(
            "Failed to generate AI welcome message, using fallback:",
            error
          );
          welcomeMessage =
            "Hello! I'm your Victoria University Assistant. I'm here to help you with questions about courses, enrollment, campus facilities, academic policies, and more. How can I assist you today?";
        }

        // Save the welcome message
        await client.query(
          `INSERT INTO messages (id, "chatId", content, role, "createdAt", "updatedAt")
           VALUES (gen_random_uuid(), $1, $2, $3, NOW(), NOW())`,
          [newChat.id, welcomeMessage, "ASSISTANT"]
        );

        console.log("New chat created with AI welcome message:", newChat.id);
      } else {
        console.log(
          "New chat created without welcome message (has initial message):",
          newChat.id
        );
      }

      return successResponse("Chat created successfully", {
        chat: newChat,
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Create chat error:", error);
    return errorResponse("An error occurred while creating chat", 500);
  }
}
