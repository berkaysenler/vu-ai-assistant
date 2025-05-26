import { NextRequest } from "next/server";
import { Pool } from "pg";
import {
  verifyJWT,
  hashPassword,
  generateVerificationToken,
  isValidEmail,
} from "@/lib/auth";
import { sendEmailDev } from "@/lib/email-dev";
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
} from "@/lib/response";
import { isDev } from "@/lib/env";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// PUT /api/user/profile - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return errorResponse("No authentication token found", 401);
    }

    const payload = verifyJWT(token);
    if (!payload) {
      return errorResponse("Invalid or expired token", 401);
    }

    const body = await request.json();
    const { displayName, email, currentPassword, newPassword, theme } = body;

    console.log("Profile update request for user:", payload.userId);

    const client = await pool.connect();

    try {
      // Get current user data
      const userResult = await client.query(
        "SELECT * FROM users WHERE id = $1",
        [payload.userId]
      );

      if (userResult.rows.length === 0) {
        return errorResponse("User not found", 404);
      }

      const currentUser = userResult.rows[0];
      const updates: string[] = [];
      const values: any[] = [];
      let paramCount = 1;

      // Update display name
      if (
        displayName !== undefined &&
        displayName !== currentUser.displayName
      ) {
        if (displayName.length < 2) {
          return validationErrorResponse(
            "Display name must be at least 2 characters long"
          );
        }
        updates.push(`"displayName" = $${paramCount}`);
        values.push(displayName.trim());
        paramCount++;
      }

      // Update theme
      if (theme !== undefined && theme !== currentUser.theme) {
        const validThemes = [
          "blue",
          "green",
          "purple",
          "red",
          "orange",
          "indigo",
        ];
        if (!validThemes.includes(theme)) {
          return validationErrorResponse("Invalid theme selected");
        }
        updates.push(`theme = $${paramCount}`);
        values.push(theme);
        paramCount++;
      }

      // Handle email change (requires re-verification)
      let emailChangeRequested = false;
      if (email !== undefined && email !== currentUser.email) {
        if (!isValidEmail(email)) {
          return validationErrorResponse("Please enter a valid email address");
        }

        // Check if email already exists
        const emailCheckResult = await client.query(
          "SELECT id FROM users WHERE email = $1 AND id != $2",
          [email.toLowerCase(), payload.userId]
        );

        if (emailCheckResult.rows.length > 0) {
          return errorResponse("An account with this email already exists");
        }

        // For email changes, we'll send verification but not update immediately
        emailChangeRequested = true;

        // Generate verification token for email change
        const verificationToken = generateVerificationToken();
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        // Store email change request
        await client.query(
          `
          INSERT INTO verification_tokens (id, email, token, type, "expiresAt", "createdAt")
          VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW())
          ON CONFLICT (email, type) DO UPDATE SET
          token = $2, "expiresAt" = $4, "createdAt" = NOW()
        `,
          [email.toLowerCase(), verificationToken, "EMAIL_CHANGE", expiresAt]
        );

        // Send verification email
        const verificationUrl = `${process.env.APP_URL}/auth/verify-email-change?token=${verificationToken}`;

        if (isDev) {
          console.log("🔗 Email Change Verification URL:", verificationUrl);
          await sendEmailDev({
            to: email,
            subject: "Verify your new email - VU Assistant",
            html: `<p>Click this link to verify your new email address: <a href="${verificationUrl}">${verificationUrl}</a></p>`,
          });
        }
      }

      // Handle password change
      if (newPassword !== undefined) {
        if (!currentPassword) {
          return validationErrorResponse(
            "Current password is required to change password"
          );
        }

        // Verify current password
        const bcrypt = require("bcryptjs");
        const isCurrentPasswordValid = await bcrypt.compare(
          currentPassword,
          currentUser.password
        );

        if (!isCurrentPasswordValid) {
          return errorResponse("Current password is incorrect", 400);
        }

        // Validate new password
        if (newPassword.length < 8) {
          return validationErrorResponse(
            "New password must be at least 8 characters long"
          );
        }

        const passwordRegex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
          return validationErrorResponse(
            "New password must contain uppercase, lowercase, and number"
          );
        }

        const hashedNewPassword = await hashPassword(newPassword);
        updates.push(`password = $${paramCount}`);
        values.push(hashedNewPassword);
        paramCount++;
      }

      // Apply updates if any
      if (updates.length > 0) {
        updates.push(`"updatedAt" = NOW()`);
        values.push(payload.userId);

        const updateQuery = `
          UPDATE users 
          SET ${updates.join(", ")} 
          WHERE id = $${paramCount}
          RETURNING id, email, "fullName", "displayName", theme, verified
        `;

        const updateResult = await client.query(updateQuery, values);
        const updatedUser = updateResult.rows[0];

        console.log("Profile updated successfully for user:", payload.userId);

        return successResponse(
          emailChangeRequested
            ? "Profile updated! Please check your new email to verify the email change."
            : "Profile updated successfully!",
          {
            user: updatedUser,
            emailChangeRequested,
          }
        );
      } else if (emailChangeRequested) {
        return successResponse(
          "Email change requested! Please check your new email to verify the change.",
          { emailChangeRequested: true }
        );
      } else {
        return successResponse("No changes were made to your profile");
      }
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Profile update error:", error);
    return errorResponse("An error occurred while updating profile", 500);
  }
}
