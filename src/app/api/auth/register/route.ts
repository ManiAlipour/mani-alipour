import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import { registerService } from "@/services/auth.service";
import { registerSchema } from "@/lib/validators/auth.validator";
import { ZodError } from "zod";
import { sendEmail } from "@/lib/nodemailer"; // ایمپورتی که قبلا اضافه کردی

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    // 1. اعتبارسنجی داده‌ها
    const validatedData = registerSchema.parse(body);

    const { user } = await registerService(validatedData);

    const otpCode = user.otpCode;

    try {
      await sendEmail({
        to: user.email,
        subject: "کد تایید ثبت‌نام در سایت",
        html: `
          <div style="font-family: Tahoma, sans-serif; direction: rtl; text-align: right; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #2563eb;">سلام👋</h2>
            <p>خوشحالیم که به جمع ما پیوستی. کد تایید شما برای فعال‌سازی حساب کاربری:</p>
            <div style="background: #f8fafc; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1e40af; border: 2px dashed #bfdbfe; margin: 20px 0;">
              ${otpCode}
            </div>
            <p style="font-size: 13px; color: #64748b;">این کد برای امنیت حساب شما صادر شده است. اگر شما این درخواست را نداده‌اید، این ایمیل را نادیده بگیرید.</p>
          </div>
        `,
      });
    } catch (mailError) {
      console.error("خطا در ارسال ایمیل تایید:", mailError);
    }

    const response = NextResponse.json(
      {
        message:
          "ثبت‌نام با موفقیت انجام شد! کد تایید به ایمیل شما ارسال گردید.",
        user,
      },
      { status: 201 },
    );

    return response;
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: "خطا در داده‌های ورودی",
          errors: error,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { message: error.message || "خطای سرور رخ داد" },
      { status: 400 },
    );
  }
}
