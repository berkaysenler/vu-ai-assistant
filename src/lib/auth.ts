import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { randomBytes } from "crypto";

// Password hashing
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// JWT token functions (for API routes - Node.js runtime)
export function generateJWT(payload: object): string {
  console.log("Generating JWT with payload:", payload);
  console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);

  const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "7d" });
  console.log("Generated token (first 20 chars):", token.substring(0, 20));
  return token;
}

export function verifyJWT(token: string): any {
  try {
    console.log(
      "Verifying JWT token (first 20 chars):",
      token.substring(0, 20)
    );
    console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);

    const payload = jwt.verify(token, process.env.JWT_SECRET!);
    console.log("JWT verification successful:", payload);
    return payload;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}

// Generate verification token
export function generateVerificationToken(): string {
  return randomBytes(32).toString("hex");
}

// Email validation
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Password validation
export function isValidPassword(password: string): boolean {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
}
