// src/app/api/auth/login/route.ts
import { NextRequest } from "next/server";
import { Pool } from "pg";
import {
  verifyPassword,
  generateJWT,
  isValidEmail,
  verifyJWT,
} from "@/lib/auth";
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
} from "@/lib/response";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(request: NextRequest) {
  console.log("Login API called");

  try {
    // Parse request body
    let body;
    try {
      body = await request.json();
      console.log("Login request for email:", body.email);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      return errorResponse("Invalid request format", 400);
    }

    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return validationErrorResponse("Email and password are required");
    }

    if (!isValidEmail(email)) {
      return validationErrorResponse("Please enter a valid email address");
    }

    const client = await pool.connect();

    try {
      // Find user by email
      console.log("Looking up user...");
      const userResult = await client.query(
        "SELECT * FROM users WHERE LOWER(email) = LOWER($1)",
        [email.trim()]
      );

      if (userResult.rows.length === 0) {
        console.log("User not found");
        return errorResponse("Invalid email or password", 401);
      }

      const user = userResult.rows[0];

      // Check if user is verified
      if (!user.verified) {
        console.log("User not verified");
        return errorResponse(
          "Please verify your email address before logging in",
          401
        );
      }

      // Verify password
      console.log("Verifying password...");
      const isPasswordValid = await verifyPassword(password, user.password);

      if (!isPasswordValid) {
        console.log("Invalid password");
        return errorResponse("Invalid email or password", 401);
      }

      // Generate JWT token
      console.log("Generating JWT token...");
      const token = generateJWT({
        userId: user.id,
        email: user.email,
        fullName: user.fullName,
      });

      console.log("JWT token generated, length:", token.length);

      // Test token immediately
      const testPayload = verifyJWT(token);
      console.log(
        "Immediate token verification:",
        testPayload ? "SUCCESS" : "FAILED"
      );

      // Create session in database
      const sessionExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
      await client.query(
        'INSERT INTO sessions (id, "userId", token, "expiresAt", "createdAt") VALUES (gen_random_uuid(), $1, $2, $3, NOW())',
        [user.id, token, sessionExpiresAt]
      );

      console.log("Login successful for user:", user.email);

      // Set HTTP-only cookie
      const response = successResponse("Login successful", {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          displayName: user.displayName || user.fullName,
          theme: user.theme || "blue",
        },
      });

      // Set secure cookie
      response.cookies.set("auth-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
        path: "/",
      });

      return response;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Login error:", error);
    return errorResponse(
      "An error occurred during login. Please try again.",
      500
    );
  }
}
