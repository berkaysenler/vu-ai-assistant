import { NextRequest } from "next/server";
import { Pool } from "pg";
import { verifyJWT } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/response";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// POST /api/chats/[chatId]/messages - Send a message
export async function POST(
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

    const { chatId } = await params;
    if (!chatId) {
      return errorResponse("Chat ID is required", 400);
    }

    const body = await request.json();
    const { content } = body;

    if (!content || content.trim().length === 0) {
      return errorResponse("Message content is required", 400);
    }

    const client = await pool.connect();

    try {
      // First, verify that the chat belongs to the user
      const chatResult = await client.query(
        'SELECT id, name FROM chats WHERE id = $1 AND "userId" = $2',
        [chatId, payload.userId]
      );

      if (chatResult.rows.length === 0) {
        return errorResponse("Chat not found", 404);
      }

      const chat = chatResult.rows[0];

      // Add user message
      const userMessageResult = await client.query(
        `
        INSERT INTO messages (id, "chatId", content, role, "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), $1, $2, $3, NOW(), NOW())
        RETURNING id, content, role, "createdAt", "updatedAt"
      `,
        [chatId, content.trim(), "USER"]
      );

      const userMessage = userMessageResult.rows[0];

      // Generate AI response (for now, a simple response)
      const aiResponse = generateAIResponse(content.trim(), chat.name);

      // Add AI message
      const aiMessageResult = await client.query(
        `
        INSERT INTO messages (id, "chatId", content, role, "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), $1, $2, $3, NOW(), NOW())
        RETURNING id, content, role, "createdAt", "updatedAt"
      `,
        [chatId, aiResponse, "ASSISTANT"]
      );

      const aiMessage = aiMessageResult.rows[0];

      // Update chat's updatedAt timestamp
      await client.query('UPDATE chats SET "updatedAt" = NOW() WHERE id = $1', [
        chatId,
      ]);

      // If this is the first message and chat name is still "New Chat", update it
      if (chat.name === "New Chat") {
        const newChatName = generateChatName(content.trim());
        await client.query(
          'UPDATE chats SET name = $1, "updatedAt" = NOW() WHERE id = $2',
          [newChatName, chatId]
        );
      }

      console.log("Messages added to chat:", chatId);

      return successResponse("Messages sent successfully", {
        userMessage,
        aiMessage,
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Send message error:", error);
    return errorResponse("An error occurred while sending message", 500);
  }
}

// Simple AI response generator (placeholder for now)
function generateAIResponse(userMessage: string, chatName: string): string {
  const responses = [
    "I understand you're asking about that. Let me help you with information about Victoria University.",
    "That's a great question! At Victoria University, we have comprehensive support for students.",
    "I can help you with that. Victoria University offers many resources and services for students.",
    "Thank you for your question. Let me provide you with relevant information about VU.",
    "I'm here to assist with your VU-related queries. Here's what I can tell you about that topic.",
  ];

  // Simple keyword-based responses
  const lowerMessage = userMessage.toLowerCase();

  if (lowerMessage.includes("course") || lowerMessage.includes("subject")) {
    return "Victoria University offers a wide range of courses across various disciplines. You can find detailed course information, prerequisites, and enrollment details on the VU website or by contacting student services. Would you like information about a specific area of study?";
  }

  if (
    lowerMessage.includes("enrol") ||
    lowerMessage.includes("enrollment") ||
    lowerMessage.includes("register")
  ) {
    return "For enrollment at Victoria University, you can apply online through the VU portal. Key steps include checking course availability, meeting prerequisites, and submitting required documents. The enrollment periods vary by semester. Would you like specific information about enrollment deadlines or requirements?";
  }

  if (
    lowerMessage.includes("fee") ||
    lowerMessage.includes("cost") ||
    lowerMessage.includes("price")
  ) {
    return "Victoria University's fees vary depending on your course, study level, and residency status. International and domestic students have different fee structures. You can find detailed fee information on the VU website or contact the finance office for personalized fee calculations. Financial aid and payment plan options are also available.";
  }

  if (
    lowerMessage.includes("campus") ||
    lowerMessage.includes("location") ||
    lowerMessage.includes("facility")
  ) {
    return "Victoria University has multiple campuses with modern facilities including libraries, laboratories, student centers, and recreational facilities. Our main campuses are well-connected by public transport. Each campus offers unique resources and services. Would you like information about a specific campus or facility?";
  }

  if (
    lowerMessage.includes("hello") ||
    lowerMessage.includes("hi") ||
    lowerMessage.includes("hey")
  ) {
    return "Hello! Welcome to Victoria University Assistant. I'm here to help you with any questions about courses, enrollment, campus life, and university services. How can I assist you today?";
  }

  // Default response
  return (
    responses[Math.floor(Math.random() * responses.length)] +
    " Could you please provide more specific details about what you'd like to know?"
  );
}

// Generate a chat name based on the first message
function generateChatName(firstMessage: string): string {
  const message = firstMessage.trim();

  // If message is short enough, use it as the name
  if (message.length <= 40) {
    return message;
  }

  // Extract first few words
  const words = message.split(" ").slice(0, 6);
  let name = words.join(" ");

  // If still too long, truncate
  if (name.length > 40) {
    name = name.substring(0, 37) + "...";
  }

  return name;
}
