// src/lib/email-production.ts
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

interface EmailResult {
  success: boolean;
  data?: any;
  error?: any;
}

export async function sendEmailProduction({
  to,
  subject,
  html,
}: EmailOptions): Promise<EmailResult> {
  try {
    console.log(`📧 [PRODUCTION] Sending email to: ${to}`);
    console.log(`📧 [PRODUCTION] Subject: ${subject}`);

    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    if (!process.env.EMAIL_FROM) {
      throw new Error("EMAIL_FROM is not configured");
    }

    const data = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: [to], // Resend expects an array
      subject,
      html,
    });

    console.log("✅ [PRODUCTION] Email sent successfully:", {
      data,
      to: to,
    });

    return { success: true, data };
  } catch (error: any) {
    console.error("❌ [PRODUCTION] Email sending failed:", {
      error: error.message,
      to: to,
      subject: subject,
    });

    // Log specific Resend errors
    if (error.name === "ResendError") {
      console.error("Resend API Error Details:", error);
    }

    return { success: false, error: error.message };
  }
}
