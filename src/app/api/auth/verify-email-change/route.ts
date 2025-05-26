// src/app/api/auth/verify-email-change/route.ts
import { NextRequest } from "next/server";
import { Pool } from "pg";
import { successResponse, errorResponse } from "@/lib/response";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(request: NextRequest) {
  console.log("Email change verification API called");

  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    console.log(
      "Token received:",
      token ? token.substring(0, 10) + "..." : "null"
    );

    if (!token) {
      return errorResponse("Verification token is required", 400);
    }

    const client = await pool.connect();

    try {
      // Find the email change verification token
      console.log("Searching for EMAIL_CHANGE token in database...");
      const tokenResult = await client.query(
        `SELECT * FROM verification_tokens 
         WHERE token = $1 AND type = $2`,
        [token, "EMAIL_CHANGE"]
      );

      console.log("Token search result:", {
        found: tokenResult.rows.length > 0,
        token: token.substring(0, 10) + "...",
      });

      if (tokenResult.rows.length === 0) {
        console.log("Token not found or invalid");
        return errorResponse("Invalid or expired verification token", 400);
      }

      const verificationToken = tokenResult.rows[0];
      console.log("Token found for email:", verificationToken.email);

      // Check if token is expired
      if (new Date() > new Date(verificationToken.expiresAt)) {
        console.log("Token expired at:", verificationToken.expiresAt);
        return errorResponse(
          "Verification token has expired. Please request a new email change.",
          400
        );
      }

      // Get the user by userId stored in the token
      if (!verificationToken.userId) {
        console.log("No userId in token - old token format");
        return errorResponse("Invalid token format", 400);
      }

      const userResult = await client.query(
        "SELECT * FROM users WHERE id = $1",
        [verificationToken.userId]
      );

      if (userResult.rows.length === 0) {
        console.log("User not found for userId:", verificationToken.userId);
        return errorResponse("User not found", 404);
      }

      const user = userResult.rows[0];
      const oldEmail = user.email;
      const newEmail = verificationToken.email;

      console.log("Changing email from", oldEmail, "to", newEmail);

      // Update user's email to the new email stored in the token
      await client.query(
        'UPDATE users SET email = $1, "updatedAt" = NOW() WHERE id = $2',
        [newEmail, user.id]
      );

      // Delete the verification token (it's been used)
      await client.query("DELETE FROM verification_tokens WHERE token = $1", [
        token,
      ]);

      console.log("Email changed successfully for user:", user.id);

      return successResponse(
        "Email address changed successfully! You can now log in with your new email address.",
        {
          newEmail: newEmail,
          oldEmail: oldEmail,
          verified: true,
        }
      );
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Email change verification error:", error);
    return errorResponse(
      "An error occurred during verification. Please try again or contact support.",
      500
    );
  }
}
