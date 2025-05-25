// Environment variables validation

const requiredEnvVars = [
  "DATABASE_URL",
  "JWT_SECRET",
  "NEXTAUTH_SECRET",
  "APP_URL",
] as const;

const optionalEnvVars = [
  "RESEND_API_KEY",
  "EMAIL_FROM",
  "OPENAI_API_KEY",
] as const;

export function validateEnv() {
  const missing: string[] = [];

  // Check required variables
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }

  if (missing.length > 0) {
    console.error(
      `❌ Missing required environment variables: ${missing.join(", ")}`
    );
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }

  // Warn about optional variables
  const missingOptional: string[] = [];
  for (const envVar of optionalEnvVars) {
    if (!process.env[envVar]) {
      missingOptional.push(envVar);
    }
  }

  if (missingOptional.length > 0) {
    console.warn(
      `⚠️  Optional environment variables not set: ${missingOptional.join(", ")}`
    );
  }

  console.log("✅ Environment variables validated");
}

// Validate on import
try {
  validateEnv();
} catch (error) {
  console.error("Environment validation failed:", error);
}

// Type-safe environment variables
export const env = {
  DATABASE_URL: process.env.DATABASE_URL!,
  JWT_SECRET: process.env.JWT_SECRET!,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET!,
  APP_URL: process.env.APP_URL!,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  EMAIL_FROM: process.env.EMAIL_FROM || "VU Assistant <noreply@localhost>",
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  NODE_ENV: process.env.NODE_ENV || "development",
} as const;

// Check if we're in development mode
export const isDev = env.NODE_ENV === "development";
export const isProd = env.NODE_ENV === "production";
