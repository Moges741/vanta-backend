import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private resend: Resend;
  private readonly logger = new Logger(EmailService.name);
  private readonly fromEmail: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    if (!apiKey) {
      this.logger.error('RESEND_API_KEY is not defined in environment variables');
    }
    
    // Initialize Resend with your API Key
    this.resend = new Resend(apiKey);
    
    // Fallback to onboarding@resend.dev if EMAIL_FROM is missing
    this.fromEmail = this.configService.get<string>('EMAIL_FROM') || 'onboarding@resend.dev';
  }

  /**
   * Sends a beautifully formatted password reset email.
   */
  async sendPasswordResetEmail(to: string, resetToken: string): Promise<boolean> {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
    // This is the link the user will click in their email
    const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;

    this.logger.log(`Attempting to send reset email to: ${to}`);

    try {
      const { data, error } = await this.resend.emails.send({
        from: `Event Hub <${this.fromEmail}>`,
        to: [to], // Note: During local testing with onboarding@resend.dev, 'to' MUST be your own verified email address
        subject: 'Reset Your Password - Event Hub',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2>Password Reset Request</h2>
            <p>We received a request to reset your password for your Event Hub account.</p>
            <p>Click the button below to choose a new password. This link will expire in 1 hour.</p>
            <div style="margin: 30px 0;">
              <a href="${resetLink}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Reset My Password
              </a>
            </div>
            <p style="font-size: 14px; color: #666;">
              If you didn't request this, you can safely ignore this email. Your password will remain unchanged.
            </p>
            <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
            <p style="font-size: 12px; color: #999;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              ${resetLink}
            </p>
          </div>
        `,
      });

      if (error) {
        this.logger.error(`Failed to send email via Resend: ${error.message}`);
        return false;
      }

      this.logger.log(`Email sent successfully! Resend ID: ${data?.id}`);
      return true;

    } catch (err: any) {
      this.logger.error(`Unexpected error sending email: ${err.message}`, err.stack);
      return false;
    }
  }

  async sendVerificationEmail(to: string, verificationLink: string) {
  await this.resend.emails.send({
    from: 'EventHub <noreply@eventhub.com>',   // Change this later
    to: [to],
    subject: 'Verify Your EventHub Account',
    html: `
      <h2>Welcome to EventHub!</h2>
      <p>Please click the button below to verify your email address:</p>
      <a href="${verificationLink}" 
         style="background:#3b82f6; color:white; padding:14px 28px; text-decoration:none; border-radius:8px; display:inline-block;">
        Verify My Email
      </a>
      <p>This link will expire in 24 hours.</p>
      <p>If you didn't create this account, please ignore this email.</p>
    `,
  });
}
}