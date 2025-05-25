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

export async function sendEmail({
  to,
  subject,
  html,
}: EmailOptions): Promise<EmailResult> {
  try {
    const data = await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to,
      subject,
      html,
    });

    console.log("✅ Email sent successfully:", data);
    return { success: true, data };
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    return { success: false, error };
  }
}

// Email Templates
export function getVerificationEmailTemplate(
  verificationUrl: string,
  userName: string
) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Verify Your Email - VU Assistant</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb;">Victoria University Assistant</h1>
        </div>
        
        <h2>Welcome ${userName}!</h2>
        
        <p>Thank you for registering with Victoria University Assistant. To complete your registration, please verify your email address by clicking the button below:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Verify Email Address
          </a>
        </div>
        
        <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
        
        <p><strong>This link will expire in 24 hours.</strong></p>
        
        <hr style="margin: 30px 0;">
        <p style="color: #666; font-size: 14px;">
          If you didn't create an account with VU Assistant, you can safely ignore this email.
        </p>
      </div>
    </body>
    </html>
  `;
}

export function getPasswordResetEmailTemplate(
  resetUrl: string,
  userName: string
) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Reset Your Password - VU Assistant</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb;">Victoria University Assistant</h1>
        </div>
        
        <h2>Password Reset Request</h2>
        
        <p>Hi ${userName},</p>
        
        <p>We received a request to reset your password. Click the button below to create a new password:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background-color: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        
        <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #666;">${resetUrl}</p>
        
        <p><strong>This link will expire in 1 hour.</strong></p>
        
        <hr style="margin: 30px 0;">
        <p style="color: #666; font-size: 14px;">
          If you didn't request a password reset, you can safely ignore this email. Your password won't be changed.
        </p>
      </div>
    </body>
    </html>
  `;
}
