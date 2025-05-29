// src/app/api/search/messages/route.ts
import { NextRequest } from "next/server";
import { Pool } from "pg";
import { verifyJWT } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/response";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET /api/search/messages - Search messages across all user's chats
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

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.trim().length < 2) {
      return errorResponse(
        "Search query must be at least 2 characters long",
        400
      );
    }

    const searchTerm = query.trim();
    const client = await pool.connect();

    try {
      // Search for messages in user's chats
      // Using ILIKE for case-insensitive search and limiting results for performance
      const searchResult = await client.query(
        `
        SELECT 
          m.id as "messageId",
          m.content,
          m.role,
          m."createdAt",
          c.id as "chatId",
          c.name as "chatName"
        FROM messages m
        INNER JOIN chats c ON m."chatId" = c.id
        WHERE c."userId" = $1 
          AND m.content ILIKE $2
        ORDER BY m."createdAt" DESC
        LIMIT 50
        `,
        [payload.userId, `%${searchTerm}%`]
      );

      // Process results to add highlighting
      const results = searchResult.rows.map((row) => {
        // Create highlighted content
        const highlightedContent = highlightSearchTerm(row.content, searchTerm);

        return {
          messageId: row.messageId,
          chatId: row.chatId,
          chatName: row.chatName,
          content: row.content,
          role: row.role,
          createdAt: row.createdAt,
          highlightedContent,
        };
      });

      console.log(
        `Search completed: "${searchTerm}" - ${results.length} results found`
      );

      return successResponse("Search completed successfully", {
        results,
        query: searchTerm,
        totalResults: results.length,
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Search messages error:", error);
    return errorResponse("An error occurred while searching messages", 500);
  }
}

// Helper function to highlight search terms in content
function highlightSearchTerm(content: string, searchTerm: string): string {
  if (!searchTerm.trim()) return content;

  // Escape special regex characters in search term
  const escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\");

  // Create regex for case-insensitive matching
  const regex = new RegExp(`(${escapedTerm})`, "gi");

  // Replace matches with highlighted version
  return content.replace(
    regex,
    '<mark class="bg-yellow-200 text-gray-900 rounded px-1">$1</mark>'
  );
}
