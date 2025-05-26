// src/app/api/auth/reset-password/route.ts
import { NextRequest } from "next/server";
import { Pool } from "pg";
import { hashPassword, isValidPassword } from "@/lib/auth";
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
} from "@/lib/response";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(request: NextRequest) {
  console.log("Reset password API called");

  try {
    const body = await request.json();
    const { token, password, confirmPassword } = body;

    // Validation
    if (!token) {
      return validationErrorResponse("Reset token is required");
    }

    if (!password || !confirmPassword) {
      return validationErrorResponse("Password and confirmation are required");
    }

    if (!isValidPassword(password)) {
      return validationErrorResponse(
        "Password must be at least 8 characters with uppercase, lowercase, and number"
      );
    }

    if (password !== confirmPassword) {
      return validationErrorResponse("Passwords do not match");
    }

    const client = await pool.connect();

    try {
      // Find the password reset token
      console.log("Looking up reset token...");
      const tokenResult = await client.query(
        `SELECT * FROM verification_tokens 
         WHERE token = $1 AND type = 'PASSWORD_RESET'`,
        [token]
      );

      if (tokenResult.rows.length === 0) {
        console.log("Invalid reset token");
        return errorResponse("Invalid or expired reset token", 400);
      }

      const resetToken = tokenResult.rows[0];

      // Check if token is expired
      if (new Date() > new Date(resetToken.expiresAt)) {
        console.log("Reset token expired");
        return errorResponse(
          "Reset token has expired. Please request a new one.",
          400
        );
      }

      // Get the user
      const userResult = await client.query(
        "SELECT * FROM users WHERE id = $1",
        [resetToken.userId]
      );

      if (userResult.rows.length === 0) {
        console.log("User not found");
        return errorResponse("User not found", 404);
      }

      const user = userResult.rows[0];

      // Hash the new password
      console.log("Hashing new password...");
      const hashedPassword = await hashPassword(password);

      // Update user's password
      await client.query(
        'UPDATE users SET password = $1, "updatedAt" = NOW() WHERE id = $2',
        [hashedPassword, user.id]
      );

      // Delete the reset token (it's been used)
      await client.query("DELETE FROM verification_tokens WHERE token = $1", [
        token,
      ]);

      // Also delete any other password reset tokens for this user
      await client.query(
        `DELETE FROM verification_tokens 
         WHERE email = $1 AND type = 'PASSWORD_RESET'`,
        [user.email]
      );

      console.log("Password reset successful for user:", user.email);

      return successResponse(
        "Password reset successful! You can now log in with your new password.",
        {
          email: user.email,
        }
      );
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Reset password error:", error);
    return errorResponse(
      "An error occurred while resetting your password. Please try again.",
      500
    );
  }
}
