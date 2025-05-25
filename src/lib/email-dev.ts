// Development email service that logs to console instead of sending real emails

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

export async function sendEmailDev({
  to,
  subject,
  html,
}: EmailOptions): Promise<EmailResult> {
  console.log("📧 EMAIL SENT (DEV MODE)");
  console.log("To:", to);
  console.log("Subject:", subject);
  console.log("HTML Content:");
  console.log("─".repeat(50));
  console.log(html);
  console.log("─".repeat(50));

  return { success: true, data: { id: "dev-email-" + Date.now() } };
}

// Extract verification link from email for easy testing
export function extractVerificationLink(html: string): string | null {
  const match = html.match(/href="([^"]*verify[^"]*)"/);
  return match ? match[1] : null;
}
