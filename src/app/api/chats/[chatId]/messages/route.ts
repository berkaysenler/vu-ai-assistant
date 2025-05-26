import { NextRequest } from "next/server";
import { Pool } from "pg";
import { verifyJWT } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/response";

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
        `
        SELECT id FROM chats 
        WHERE id = $1 AND "userId" = $2
      `,
        [chatId, payload.userId]
      );

      if (chatResult.rows.length === 0) {
        return errorResponse("Chat not found", 404);
      }

      // Save user message
      const userMessageResult = await client.query(
        `
        INSERT INTO messages (id, "chatId", content, role, "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), $1, $2, $3, NOW(), NOW())
        RETURNING id, content, role, "createdAt", "updatedAt"
      `,
        [chatId, message.trim(), "USER"]
      );

      const userMessage = userMessageResult.rows[0];

      // Generate AI response (placeholder for now)
      const aiResponse = generateAIResponse(message);

      // Save AI message
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
      await client.query(
        `
        UPDATE chats SET "updatedAt" = NOW() WHERE id = $1
      `,
        [chatId]
      );

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

// Placeholder AI response function
function generateAIResponse(userMessage: string): string {
  const responses = [
    "Thank you for your question about Victoria University. I'm here to help! Could you please provide more specific details so I can give you the most accurate information?",

    "That's a great question! At Victoria University, we have many resources available. Let me help you find the right information for your needs.",

    "I understand you're looking for information about Victoria University. I'm designed to help with questions about courses, enrollment, campus facilities, academic policies, and student services. What specific area would you like to know more about?",

    "Hello! I'm your Victoria University Assistant. I can help you with information about academic programs, enrollment procedures, campus life, student support services, and university policies. How can I assist you today?",

    "Thanks for reaching out! As your VU Assistant, I'm here to provide information about courses, deadlines, campus resources, and student services. What would you like to know more about?",
  ];

  // Simple keyword-based responses
  const lowerMessage = userMessage.toLowerCase();

  if (
    lowerMessage.includes("course") ||
    lowerMessage.includes("subject") ||
    lowerMessage.includes("program")
  ) {
    return "Victoria University offers a wide range of undergraduate and postgraduate programs across various fields including Business, Engineering, Health Sciences, Arts, and Education. For specific course information, admission requirements, and program details, I recommend checking the official VU course handbook or contacting the admissions office. Is there a particular field of study you're interested in?";
  }

  if (
    lowerMessage.includes("enrol") ||
    lowerMessage.includes("admission") ||
    lowerMessage.includes("apply")
  ) {
    return "For enrollment at Victoria University, you'll need to submit an application through the official admissions portal. Key requirements typically include academic transcripts, English proficiency test results (for international students), and specific program prerequisites. Application deadlines vary by program and intake period. Would you like information about a specific program or the application process?";
  }

  if (
    lowerMessage.includes("campus") ||
    lowerMessage.includes("facility") ||
    lowerMessage.includes("library")
  ) {
    return "Victoria University has modern campus facilities including well-equipped libraries, computer labs, student support centers, recreational facilities, and various study spaces. The campus is designed to support both academic excellence and student wellbeing. Are you looking for information about a specific facility or service?";
  }

  if (
    lowerMessage.includes("fee") ||
    lowerMessage.includes("cost") ||
    lowerMessage.includes("tuition")
  ) {
    return "Tuition fees at Victoria University vary depending on your program, study level, and residency status. Domestic and international students have different fee structures. I recommend checking the official VU website for current fee schedules or contacting the student finance office for personalized information about costs and available financial support options.";
  }

  // Default response
  return responses[Math.floor(Math.random() * responses.length)];
}
