import { NextRequest } from "next/server";
import { Pool } from "pg";
import { successResponse, errorResponse } from "@/lib/response";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(request: NextRequest) {
  console.log("Email verification API called");

  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    console.log(
      "Token received:",
      token ? token.substring(0, 10) + "..." : "null"
    );

    if (!token) {
      console.log("No token provided");
      return errorResponse("Verification token is required", 400);
    }

    const client = await pool.connect();

    try {
      // Find the verification token
      console.log("Searching for token in database...");
      const tokenResult = await client.query(
        "SELECT * FROM verification_tokens WHERE token = $1 AND type = $2",
        [token, "EMAIL_VERIFICATION"]
      );

      console.log("Database query result:", {
        rowsFound: tokenResult.rows.length,
        searchedToken: token.substring(0, 10) + "...",
      });

      if (tokenResult.rows.length === 0) {
        // Let's also check if there are any tokens at all
        const allTokensResult = await client.query(
          "SELECT COUNT(*) as count FROM verification_tokens WHERE type = $1",
          ["EMAIL_VERIFICATION"]
        );
        console.log(
          "Total EMAIL_VERIFICATION tokens in database:",
          allTokensResult.rows[0].count
        );

        console.log("Token not found in database");
        return errorResponse("Invalid or expired verification token", 400);
      }

      const verificationToken = tokenResult.rows[0];
      console.log("Token found for email:", verificationToken.email);

      // Check if token is expired
      if (new Date() > new Date(verificationToken.expiresAt)) {
        console.log("Token expired");
        return errorResponse("Verification token has expired", 400);
      }

      // Find the user
      const userResult = await client.query(
        "SELECT * FROM users WHERE email = $1",
        [verificationToken.email]
      );

      if (userResult.rows.length === 0) {
        console.log("User not found");
        return errorResponse("User not found", 404);
      }

      const user = userResult.rows[0];

      // Check if user is already verified
      if (user.verified) {
        console.log("User already verified");
        return successResponse("Email already verified", {
          email: user.email,
          alreadyVerified: true,
        });
      }

      // Update user as verified
      await client.query(
        'UPDATE users SET verified = true, "updatedAt" = NOW() WHERE email = $1',
        [user.email]
      );

      // Delete the verification token (it's been used)
      await client.query("DELETE FROM verification_tokens WHERE token = $1", [
        token,
      ]);

      console.log("Email verified successfully for:", user.email);

      return successResponse(
        "Email verified successfully! You can now log in.",
        {
          email: user.email,
          verified: true,
        }
      );
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Email verification error:", error);
    return errorResponse(
      "An error occurred during verification. Please try again.",
      500
    );
  }
}
