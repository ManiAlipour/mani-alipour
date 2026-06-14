import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { signJWT } from "@/utils/jwt";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { email, code } = await req.json();

    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("کاربر یافت نشد");
    }

    if (user.otpCode !== +code) {
      throw new Error("کد تایید اشتباه است");
    }

    if (user.otpExpires < new Date()) {
      throw new Error("کد تایید منقضی شده است");
    }

    user.isVerified = true;
    user.otpCode = undefined;
    user.otpExpires = undefined;

    await user.save();

    const tokenPayload = {
      userId: user._id,
      email: user.email,
      role: user.role,
    };

    const token = signJWT(tokenPayload, "30d");

    (await cookies()).set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
    });

    return NextResponse.json({
      message: "حساب شما با موفقیت تایید شد",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "خطای سرور" },
      { status: 400 },
    );
  }
}
