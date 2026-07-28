import nodemailer from "nodemailer";
import { EMAIL_USER, EMAIL_PASS, EMAIL_FROM } from "./constant";

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter | null {
    if (!EMAIL_USER || !EMAIL_PASS) {
        console.warn(
            "[mailer] EMAIL_USER / EMAIL_PASS not set in .env — password reset emails will not be sent. " +
                "See backend/.env for Gmail App Password setup instructions."
        );
        return null;
    }
    if (!transporter) {
        transporter = nodemailer.createTransport({
            service: "gmail",
            auth: { user: EMAIL_USER, pass: EMAIL_PASS },
        });
    }
    return transporter;
}

export async function sendOtpEmail(to: string, otp: string): Promise<void> {
    const t = getTransporter();
    if (!t) {
        // Fail loudly in the server logs (but don't crash the request) so it's
        // obvious in development why no email arrived.
        console.warn(`[mailer] Would have sent OTP ${otp} to ${to}, but email is not configured.`);
        return;
    }

    await t.sendMail({
        from: `"Futsal Buddy" <${EMAIL_FROM}>`,
        to,
        subject: "Your Futsal Buddy password reset code",
        html: `
            <div style="font-family: sans-serif; max-width: 420px; margin: 0 auto;">
                <h2 style="color: #15803d;">Reset your password</h2>
                <p>Use this code to reset your Futsal Buddy password. It expires in 10 minutes.</p>
                <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; background: #f0fdf4; color: #15803d; padding: 16px 24px; border-radius: 8px; text-align: center; margin: 16px 0;">
                    ${otp}
                </div>
                <p style="color: #6b7280; font-size: 13px;">If you didn't request this, you can safely ignore this email.</p>
            </div>
        `,
    });
}
