import { NextRequest } from "next/server";
import {
  createUser,
  findUserByEmail,
  createVerificationToken,
} from "@/lib/db-direct";
import {
  hashPassword,
  generateVerificationToken,
  isValidEmail,
  isValidPassword,
} from "@/lib/auth";
import { sendEmailDev } from "@/lib/email-dev";
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
} from "@/lib/response";

export async function POST(request: NextRequest) {
  console.log("Registration API called");

  try {
    // Parse request body
    let body;
    try {
      body = await request.json();
      console.log("Request body parsed:", {
        ...body,
        password: "[HIDDEN]",
        confirmPassword: "[HIDDEN]",
      });
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      return errorResponse("Invalid request format", 400);
    }

    const { email, fullName, password, confirmPassword } = body;

    // Validation
    if (!email || !fullName || !password || !confirmPassword) {
      return validationErrorResponse("All fields are required");
    }

    if (!isValidEmail(email)) {
      return validationErrorResponse("Please enter a valid email address");
    }

    if (!isValidPassword(password)) {
      return validationErrorResponse(
        "Password must be at least 8 characters with uppercase, lowercase, and number"
      );
    }

    if (password !== confirmPassword) {
      return validationErrorResponse("Passwords do not match");
    }

    if (fullName.length < 2) {
      return validationErrorResponse(
        "Full name must be at least 2 characters long"
      );
    }

    // Check if user already exists
    console.log("Checking if user exists...");
    const existingUser = await findUserByEmail(email.toLowerCase());

    if (existingUser) {
      return errorResponse("An account with this email already exists");
    }

    // Hash password
    console.log("Hashing password...");
    const hashedPassword = await hashPassword(password);

    // Generate verification token
    const verificationToken = generateVerificationToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user
    console.log("Creating user...");
    const user = await createUser({
      email: email.toLowerCase(),
      fullName: fullName.trim(),
      password: hashedPassword,
      verified: false,
    });
    console.log("User created with ID:", user.id);

    // Create verification token
    console.log("Creating verification token...");
    const tokenResult = await createVerificationToken({
      email: user.email,
      token: verificationToken,
      type: "EMAIL_VERIFICATION",
      expiresAt,
    });
    console.log("Token created in database:", {
      token: verificationToken.substring(0, 10) + "...",
      email: user.email,
      expiresAt: expiresAt.toISOString(),
    });

    // Send verification email (dev mode)
    console.log("Sending verification email...");
    const verificationUrl = `${process.env.APP_URL}/auth/verify?token=${verificationToken}`;

    // For now, just log the verification URL
    console.log("🔗 Verification URL:", verificationUrl);

    await sendEmailDev({
      to: user.email,
      subject: "Verify your email - VU Assistant",
      html: `<p>Click this link to verify: <a href="${verificationUrl}">${verificationUrl}</a></p>`,
    });

    console.log("Registration completed successfully");

    return successResponse(
      "Registration successful! Please check your email to verify your account.",
      {
        userId: user.id,
        email: user.email,
        requiresVerification: true,
        verificationUrl: verificationUrl, // Include in response for testing
      }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return errorResponse(
      "An error occurred during registration. Please try again.",
      500
    );
  }
}
