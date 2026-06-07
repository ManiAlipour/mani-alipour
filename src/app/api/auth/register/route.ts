import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import { registerService } from "@/services/auth.service";
import { registerSchema } from "@/lib/validators/auth.validator";
import { ZodError } from "zod";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const validatedData = registerSchema.parse(body);

    const { user, token } = await registerService(validatedData);

    const response = NextResponse.json(
      {
        message: "ثبت‌نام با موفقیت انجام شد !",
        user,
      },
      { status: 201 },
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
        { status: 400 },
      );
    }

    return NextResponse.json(
      { message: error.message || "خطای سرور رخ داد" },
      { status: 400 },
    );
  }
}
