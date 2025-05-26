// src/app/api/auth/forgot-password/route.ts
import { NextRequest } from "next/server";
import { Pool } from "pg";
import { generateVerificationToken, isValidEmail } from "@/lib/auth";
import { sendEmail, getPasswordResetTemplate } from "@/lib/email";
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
} from "@/lib/response";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(request: NextRequest) {
  console.log("Forgot password API called");

  try {
    const body = await request.json();
    const { email } = body;

    // Validation
    if (!email) {
      return validationErrorResponse("Email address is required");
    }

    if (!isValidEmail(email)) {
      return validationErrorResponse("Please enter a valid email address");
    }

    const client = await pool.connect();

    try {
      // Check if user exists
      console.log("Looking up user with email:", email);
      const userResult = await client.query(
        "SELECT * FROM users WHERE LOWER(email) = LOWER($1)",
        [email.trim()]
      );

      if (userResult.rows.length === 0) {
        console.log("User not found, but returning success for security");
        // For security, we don't reveal if email exists or not
        return successResponse(
          "If an account with that email exists, we've sent a password reset link."
        );
      }

      const user = userResult.rows[0];

      // Check if user is verified
      if (!user.verified) {
        console.log("User exists but not verified");
        return errorResponse(
          "Please verify your email address first. Check your inbox for the verification email.",
          400
        );
      }

      // Generate password reset token
      const resetToken = generateVerificationToken();
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      // Delete any existing password reset tokens for this user
      await client.query(
        `DELETE FROM verification_tokens 
         WHERE email = $1 AND type = 'PASSWORD_RESET'`,
        [user.email]
      );

      // Create new password reset token
      await client.query(
        `INSERT INTO verification_tokens (id, email, token, type, "expiresAt", "createdAt", "userId")
         VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW(), $5)`,
        [user.email, resetToken, "PASSWORD_RESET", expiresAt, user.id]
      );

      // Send password reset email
      const resetUrl = `${process.env.APP_URL}/auth/reset-password?token=${resetToken}`;

      console.log("🔗 Password Reset URL:", resetUrl);

      const emailTemplate = getPasswordResetTemplate(resetUrl, user.fullName);

      const emailResult = await sendEmail({
        to: user.email,
        subject: "Reset your password - VU Assistant",
        html: emailTemplate,
      });

      console.log("Password reset email sent:", emailResult.success);

      return successResponse(
        "If an account with that email exists, we've sent a password reset link. Please check your email."
      );
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Forgot password error:", error);
    return errorResponse(
      "An error occurred while processing your request. Please try again.",
      500
    );
  }
}
