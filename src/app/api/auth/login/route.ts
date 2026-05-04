import { connectDB } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { loginService } from "@/services/auth.service";
import { cookies } from "next/headers";
import { loginSchema } from "@/lib/validators/auth.validator";
import { ZodError } from "zod";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    const validatedData = loginSchema.parse(body);

    const { user, token } = await loginService(validatedData);

    const response = NextResponse.json(
      {
        message: "ورود با موفقیت انجام شد مانی جان!",
        user,
      },
      { status: 200 }
    );

    (await cookies()).set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 60 * 60 * 24,
    });

    return response;
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: "خطا در داده‌های ورودی",
          errors: (error as ZodError).message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: error.message || "خطای سرور رخ داد" },
      { status: 400 }
    );
  }
}