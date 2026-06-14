import nodemailer from "nodemailer";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const sendEmail = async ({
  to,
  subject,
  html,
  text,
}: SendEmailOptions) => {
  try {
    const info = await transporter.sendMail({
      from: `"مانی علی‌پور" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      text: text || "لطفاً نسخه HTML ایمیل را چک کنید.",
      html,
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("خطا در ارسال ایمیل:", error);
    return { success: false, error };
  }
};
