// src/lib/email.ts - Complete email service with all templates
import { sendEmailDev } from "./email-dev";
import { sendEmailProduction } from "./email-production";

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

export async function sendEmail(options: EmailOptions): Promise<EmailResult> {
  const emailEnvironment = process.env.EMAIL_ENVIRONMENT || "development";

  console.log(`📧 Email Environment: ${emailEnvironment}`);
  console.log(`📧 Sending to: ${options.to}`);
  console.log(`📧 Subject: ${options.subject}`);

  if (emailEnvironment === "production") {
    console.log("📧 Using PRODUCTION email service (Resend)");
    return await sendEmailProduction(options);
  } else {
    console.log("📧 Using DEVELOPMENT email service (Console)");
    return await sendEmailDev(options);
  }
}

// Email template functions
export function getEmailChangeVerificationTemplate(
  verificationUrl: string,
  userName: string,
  oldEmail: string,
  newEmail: string
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Verify Email Change - VU Assistant</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px; background-color: #2563eb; color: white; padding: 20px; border-radius: 8px;">
        <h1 style="margin: 0;">Victoria University Assistant</h1>
        <p style="margin: 5px 0 0 0; opacity: 0.9;">Email Address Change</p>
      </div>
      
      <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #1e293b; margin-top: 0;">Hello ${userName}!</h2>
        <p>You have requested to change your email address for your VU Assistant account.</p>
      </div>
      
      <div style="background-color: #f1f5f9; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0;">
        <p style="margin: 0;"><strong>Current Email:</strong> ${oldEmail}</p>
        <p style="margin: 0;"><strong>New Email:</strong> ${newEmail}</p>
      </div>
      
      <p>To complete this change, please verify your new email address by clicking the button below:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationUrl}" 
           style="background-color: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
          🔗 Verify New Email Address
        </a>
      </div>
      
      <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 15px; margin: 20px 0;">
        <p style="margin: 0; color: #92400e;"><strong>⚠️ Important Security Information:</strong></p>
        <ul style="color: #92400e; margin: 10px 0; padding-left: 20px;">
          <li>This verification link expires in <strong>24 hours</strong></li>
          <li>Your email will NOT change until you click the verification link</li>
          <li>You can continue using your current email address until verified</li>
          <li>Only click this link if you requested this change</li>
        </ul>
      </div>
      
      <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0; font-size: 14px; color: #6b7280;">
          <strong>Can't click the button?</strong> Copy and paste this link into your browser:
        </p>
        <p style="word-break: break-all; color: #3b82f6; background-color: white; padding: 10px; border-radius: 4px; font-family: monospace; font-size: 12px;">${verificationUrl}</p>
      </div>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
      
      <div style="color: #6b7280; font-size: 14px;">
        <p><strong>Didn't request this change?</strong></p>
        <p>If you didn't request this email change, please ignore this email. Your account remains secure and no changes will be made.</p>
        
        <div style="margin-top: 20px; text-align: center; font-size: 12px;">
          <p>Victoria University Assistant</p>
          <p>This verification email was sent to: ${newEmail}</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function getRegistrationVerificationTemplate(
  verificationUrl: string,
  userName: string
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Welcome to VU Assistant</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px; background-color: #2563eb; color: white; padding: 20px; border-radius: 8px;">
        <h1 style="margin: 0;">Welcome to VU Assistant!</h1>
        <p style="margin: 5px 0 0 0; opacity: 0.9;">Your AI-powered university guide</p>
      </div>
      
      <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #1e293b; margin-top: 0;">Hello ${userName}!</h2>
        <p>Welcome to Victoria University Assistant! We're excited to help you with all your university-related questions.</p>
      </div>
      
      <p>To get started, please verify your email address by clicking the button below:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationUrl}" 
           style="background-color: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
          ✅ Verify Email Address
        </a>
      </div>
      
      <div style="background-color: #ecfdf5; border: 1px solid #10b981; border-radius: 8px; padding: 15px; margin: 20px 0;">
        <p style="margin: 0; color: #065f46;"><strong>🎓 What can VU Assistant help you with?</strong></p>
        <ul style="color: #065f46; margin: 10px 0; padding-left: 20px;">
          <li>Course information and requirements</li>
          <li>Enrollment procedures and deadlines</li>
          <li>Campus facilities and services</li>
          <li>Academic policies and procedures</li>
          <li>Student support resources</li>
        </ul>
      </div>
      
      <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0; font-size: 14px; color: #6b7280;">
          <strong>Can't click the button?</strong> Copy and paste this link into your browser:
        </p>
        <p style="word-break: break-all; color: #3b82f6; background-color: white; padding: 10px; border-radius: 4px; font-family: monospace; font-size: 12px;">${verificationUrl}</p>
      </div>
      
      <div style="margin-top: 30px; text-align: center; color: #6b7280; font-size: 12px;">
        <p>Victoria University Assistant</p>
        <p>If you didn't create this account, you can safely ignore this email.</p>
      </div>
    </body>
    </html>
  `;
}

export function getPasswordResetTemplate(
  resetUrl: string,
  userName: string
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Reset Your Password - VU Assistant</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px; background-color: #dc2626; color: white; padding: 20px; border-radius: 8px;">
        <h1 style="margin: 0;">Password Reset Request</h1>
        <p style="margin: 5px 0 0 0; opacity: 0.9;">VU Assistant Account</p>
      </div>
      
      <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #1e293b; margin-top: 0;">Hello ${userName}!</h2>
        <p>We received a request to reset the password for your VU Assistant account.</p>
      </div>
      
      <div style="background-color: #fef2f2; border: 1px solid #fca5a5; border-radius: 8px; padding: 15px; margin: 20px 0;">
        <p style="margin: 0; color: #991b1b;"><strong>🔒 Security Notice:</strong></p>
        <p style="color: #991b1b; margin: 5px 0 0 0;">If you didn't request this password reset, please ignore this email. Your account is still secure.</p>
      </div>
      
      <p>To reset your password, click the button below:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" 
           style="background-color: #dc2626; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
          🔑 Reset My Password
        </a>
      </div>
      
      <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 15px; margin: 20px 0;">
        <p style="margin: 0; color: #92400e;"><strong>⚠️ Important:</strong></p>
        <ul style="color: #92400e; margin: 10px 0; padding-left: 20px;">
          <li>This reset link expires in <strong>1 hour</strong> for security</li>
          <li>You can only use this link once</li>
          <li>After clicking, you'll be able to set a new password</li>
        </ul>
      </div>
      
      <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0; font-size: 14px; color: #6b7280;">
          <strong>Can't click the button?</strong> Copy and paste this link into your browser:
        </p>
        <p style="word-break: break-all; color: #dc2626; background-color: white; padding: 10px; border-radius: 4px; font-family: monospace; font-size: 12px;">${resetUrl}</p>
      </div>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
      
      <div style="color: #6b7280; font-size: 14px;">
        <p><strong>Having trouble?</strong></p>
        <p>If you continue to have problems, you can contact support or try registering a new account.</p>
        
        <div style="margin-top: 20px; text-align: center; font-size: 12px;">
          <p>Victoria University Assistant</p>
          <p>This email was sent because a password reset was requested for this account.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
