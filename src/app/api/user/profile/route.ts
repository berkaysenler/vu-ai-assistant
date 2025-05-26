import { NextRequest } from "next/server";
import { Pool } from "pg";
import {
  verifyJWT,
  hashPassword,
  generateVerificationToken,
  isValidEmail,
  verifyPassword,
} from "@/lib/auth";
import { sendEmail, getEmailChangeVerificationTemplate } from "@/lib/email";
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
} from "@/lib/response";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// PUT /api/user/profile - Update user profile
export async function PUT(request: NextRequest) {
  console.log("Profile update API called");

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
    const {
      displayName,
      email,
      currentPassword,
      newPassword,
      theme,
      emailChangePassword,
    } = body;

    console.log("Profile update request:", {
      userId: payload.userId,
      displayName,
      email,
      theme,
      hasCurrentPassword: !!currentPassword,
      hasNewPassword: !!newPassword,
      hasEmailChangePassword: !!emailChangePassword,
    });

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
      let emailChangeRequested = false;

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
        console.log("Will update displayName to:", displayName.trim());
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
        console.log("Will update theme to:", theme);
      }

      // Handle email change with password verification and email confirmation
      if (
        email !== undefined &&
        email.toLowerCase() !== currentUser.email.toLowerCase()
      ) {
        if (!isValidEmail(email)) {
          return validationErrorResponse("Please enter a valid email address");
        }

        // Require password for email changes
        if (!emailChangePassword) {
          return validationErrorResponse(
            "Password is required to change email address"
          );
        }

        // Verify password
        const isPasswordValid = await verifyPassword(
          emailChangePassword,
          currentUser.password
        );
        if (!isPasswordValid) {
          return errorResponse("Incorrect password", 400);
        }

        // Check if email already exists
        const emailCheckResult = await client.query(
          "SELECT id FROM users WHERE LOWER(email) = LOWER($1) AND id != $2",
          [email.trim(), payload.userId]
        );

        if (emailCheckResult.rows.length > 0) {
          return errorResponse("An account with this email already exists");
        }

        // Don't update email immediately - create verification token instead
        emailChangeRequested = true;

        // Generate verification token for email change
        const verificationToken = generateVerificationToken();
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        // Delete any existing email change tokens for this user
        await client.query(
          `DELETE FROM verification_tokens 
           WHERE email = $1 AND type = 'EMAIL_CHANGE'`,
          [currentUser.email]
        );

        // Insert new email change token with the NEW email stored
        await client.query(
          `INSERT INTO verification_tokens (id, email, token, type, "expiresAt", "createdAt", "userId")
           VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW(), $5)`,
          [
            email.toLowerCase().trim(),
            verificationToken,
            "EMAIL_CHANGE",
            expiresAt,
            payload.userId,
          ]
        );

        // Send verification email to NEW email address
        const verificationUrl = `${process.env.APP_URL}/auth/verify-email-change?token=${verificationToken}`;

        console.log("🔗 Email Change Verification URL:", verificationUrl);

        const emailTemplate = getEmailChangeVerificationTemplate(
          verificationUrl,
          currentUser.fullName,
          currentUser.email,
          email.toLowerCase().trim()
        );

        await sendEmail({
          to: email,
          subject: "Verify your new email address - VU Assistant",
          html: emailTemplate,
        });

        console.log("Email change verification sent to:", email);
      }

      // Handle password change
      if (newPassword !== undefined && newPassword.trim() !== "") {
        if (!currentPassword) {
          return validationErrorResponse(
            "Current password is required to change password"
          );
        }

        // Verify current password
        const isCurrentPasswordValid = await verifyPassword(
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
        console.log("Will update password");
      }

      // Apply updates if any (excluding email)
      if (updates.length > 0) {
        updates.push(`"updatedAt" = NOW()`);
        values.push(payload.userId);

        const updateQuery = `
          UPDATE users 
          SET ${updates.join(", ")} 
          WHERE id = $${paramCount}
          RETURNING id, email, "fullName", "displayName", theme, verified
        `;

        console.log("Update query:", updateQuery);
        console.log("Update values:", values);

        const updateResult = await client.query(updateQuery, values);
        const updatedUser = updateResult.rows[0];

        console.log("Profile updated successfully:", updatedUser);

        let message = "Profile updated successfully!";
        if (emailChangeRequested) {
          message =
            "Profile updated successfully! Please check your new email address to verify the email change.";
        }

        return successResponse(message, {
          user: updatedUser,
          emailChangeRequested,
        });
      } else if (emailChangeRequested) {
        return successResponse(
          "Email change requested! Please check your new email address to verify the change.",
          { emailChangeRequested: true }
        );
      } else {
        console.log("No changes to apply");
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
