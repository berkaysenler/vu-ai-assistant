// src/app/api/chats/[chatId]/messages/route.ts (UPDATED with AI Integration)
import { NextRequest } from "next/server";
import { Pool } from "pg";
import { verifyJWT } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/response";
import { generateAIResponse } from "@/lib/services/ai-service";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// POST /api/chats/[chatId]/messages - Send message to chat
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

    const { chatId } = params;
    const body = await request.json();
    const { message } = body;

    if (!message || !message.trim()) {
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

      // Get recent chat history for AI context
      const historyResult = await client.query(
        `SELECT content, role FROM messages 
         WHERE "chatId" = $1 
         ORDER BY "createdAt" DESC 
         LIMIT 10`,
        [chatId]
      );

      // Reverse to get chronological order and format for AI
      const chatHistory = historyResult.rows.reverse().map((row) => ({
        role:
          row.role.toLowerCase() === "user"
            ? ("user" as const)
            : ("assistant" as const),
        content: row.content,
      }));

      // Save user message first
      const userMessageResult = await client.query(
        `INSERT INTO messages (id, "chatId", content, role, "createdAt", "updatedAt")
         VALUES (gen_random_uuid(), $1, $2, $3, NOW(), NOW())
         RETURNING id, content, role, "createdAt", "updatedAt"`,
        [chatId, message.trim(), "USER"]
      );

      const userMessage = userMessageResult.rows[0];

      // Generate AI response using the AI service
      console.log("Generating AI response for message:", message.trim());
      let aiResponseContent: string;

      try {
        aiResponseContent = await generateAIResponse(
          message.trim(),
          chatHistory
        );
        console.log("AI response generated successfully");
      } catch (error) {
        console.error("AI generation failed, using fallback:", error);
        aiResponseContent = getFallbackResponse(message.trim());
      }

      // Save AI message
      const aiMessageResult = await client.query(
        `INSERT INTO messages (id, "chatId", content, role, "createdAt", "updatedAt")
         VALUES (gen_random_uuid(), $1, $2, $3, NOW(), NOW())
         RETURNING id, content, role, "createdAt", "updatedAt"`,
        [chatId, aiResponseContent, "ASSISTANT"]
      );

      const aiMessage = aiMessageResult.rows[0];

      // Update chat's updatedAt timestamp and auto-generate title if needed
      await client.query(`UPDATE chats SET "updatedAt" = NOW() WHERE id = $1`, [
        chatId,
      ]);

      // Auto-generate chat title if this is the first user message
      const messageCountResult = await client.query(
        `SELECT COUNT(*) as count FROM messages WHERE "chatId" = $1 AND role = 'USER'`,
        [chatId]
      );

      const userMessageCount = parseInt(messageCountResult.rows[0].count);

      if (userMessageCount === 1) {
        // This is the first user message, generate a title
        const chatTitle = generateChatTitle(message.trim());
        await client.query(`UPDATE chats SET name = $1 WHERE id = $2`, [
          chatTitle,
          chatId,
        ]);
        console.log("Generated chat title:", chatTitle);
      }

      console.log("Messages saved for chat:", chatId);

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

// Generate chat title based on user's first message
function generateChatTitle(firstMessage: string): string {
  const message = firstMessage.toLowerCase().trim();

  // Course/program related
  if (
    message.includes("course") ||
    message.includes("program") ||
    message.includes("degree")
  ) {
    if (message.includes("business")) return "Business Programs Inquiry";
    if (message.includes("it") || message.includes("information technology"))
      return "IT Courses Discussion";
    if (message.includes("education") || message.includes("teaching"))
      return "Education Programs Chat";
    return "Course Information Chat";
  }

  // Admission related
  if (
    message.includes("apply") ||
    message.includes("admission") ||
    message.includes("enrol")
  ) {
    return "Admission Inquiry";
  }

  // Fees and costs
  if (
    message.includes("fee") ||
    message.includes("cost") ||
    message.includes("tuition") ||
    message.includes("scholarship")
  ) {
    return "Fees & Scholarships";
  }

  // VU Sydney specific
  if (message.includes("sydney")) {
    return "VU Sydney Campus Inquiry";
  }

  // Campus and facilities
  if (
    message.includes("campus") ||
    message.includes("facility") ||
    message.includes("library")
  ) {
    return "Campus Facilities Chat";
  }

  // Student services
  if (
    message.includes("support") ||
    message.includes("help") ||
    message.includes("service")
  ) {
    return "Student Support Inquiry";
  }

  // VU Block Model
  if (message.includes("block model") || message.includes("block")) {
    return "VU Block Model Discussion";
  }

  // General greetings or questions
  if (
    message.includes("hello") ||
    message.includes("hi") ||
    message.includes("hey")
  ) {
    return "General VU Inquiry";
  }

  // Default: Use first few words of the message
  const words = firstMessage.split(" ").slice(0, 4).join(" ");
  return words.length > 30
    ? words.substring(0, 27) + "..."
    : words || "VU Chat";
}

// Fallback response when AI service is unavailable
function getFallbackResponse(userMessage: string): string {
  const message = userMessage.toLowerCase();

  // Basic keyword-based responses for common queries
  if (
    message.includes("course") ||
    message.includes("program") ||
    message.includes("subject")
  ) {
    return "Victoria University offers a wide range of undergraduate and postgraduate programs across various fields including Business, Information Technology, and Early Childhood Education. For specific course information and requirements, I recommend contacting VUHQ (VU Help Centre) or visiting the official VU website at vu.edu.au. How can I help you with course information?";
  }

  if (
    message.includes("admission") ||
    message.includes("apply") ||
    message.includes("enrol")
  ) {
    return "To apply to Victoria University, you can submit applications through VTAC (for domestic students) or directly through the VU Admissions Centre (for international students). Admission requirements vary by program, but generally include academic qualifications and English proficiency. For personalized admission advice, please contact VUHQ or visit vu.edu.au/admissions. What specific program are you interested in?";
  }

  if (
    message.includes("fee") ||
    message.includes("cost") ||
    message.includes("tuition")
  ) {
    return "Victoria University fees vary depending on your program and student status. For VU Sydney, undergraduate programs average around AUD $35,000 per year, while postgraduate programs average around AUD $27,744 per year. Scholarships and financial support options are available. For current fee information and payment options, please contact VUHQ or visit the VU website. Would you like information about scholarships?";
  }

  if (message.includes("sydney") || message.includes("campus")) {
    return "VU Sydney is Victoria University's international campus located in the heart of Sydney. It offers the same high-quality education as our Melbourne campus using the innovative VU Block Model®. The campus welcomes students from over 45 countries and provides comprehensive support services. For more information about VU Sydney, please contact our student services team or visit vu.edu.au/vu-sydney.";
  }

  if (
    message.includes("support") ||
    message.includes("help") ||
    message.includes("vuhq")
  ) {
    return "Victoria University provides comprehensive student support through VUHQ (VU Help Centre), your first point of contact for assistance. VUHQ can help with enrollment, course advice, fees, and connecting you with specialized support services including academic support, counseling, and career services. You can visit VUHQ in person at any campus, call during business hours, or use our online services. How can I connect you with the right support?";
  }

  if (message.includes("block model") || message.includes("teaching")) {
    return "The VU Block Model® is Victoria University's award-winning approach to learning where you study one subject at a time over 4-week blocks (undergraduate) or two subjects over 8-week blocks (postgraduate), rather than juggling multiple subjects simultaneously. This allows for deeper focus, smaller class sizes, and more hands-on learning experiences. It's designed to help students achieve better outcomes through intensive, collaborative learning. Would you like to know more about how this affects your studies?";
  }

  // Default response for unrecognized queries
  return "Thank you for your question about Victoria University! I'm here to help with information about our courses, admissions, student services, campus facilities, and more. For specific or detailed inquiries, I recommend contacting VUHQ (VU Help Centre) - they're your best resource for personalized assistance. You can also visit vu.edu.au for comprehensive information. What specific aspect of Victoria University would you like to know more about?";
}
