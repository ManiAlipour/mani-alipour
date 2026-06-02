import { connectDB } from "@/lib/mongodb";
import { isSessionUser, requireAuth } from "@/lib/middleware/user";
import { updateProfileSchema } from "@/lib/validators/user.validator";
import User from "@/models/User";
import { comparePassword, hashPassword } from "@/utils/bcrypt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    if (!isSessionUser(auth)) return auth;

    await connectDB();
    const user = await User.findById(auth.userId).select("-password").lean();

    if (!user) {
      return NextResponse.json({ message: "کاربر یافت نشد" }, { status: 404 });
    }

    return NextResponse.json({
      message: "پروفایل دریافت شد",
      data: user,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { message: "خطای ارتباط با سرور" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    if (!isSessionUser(auth)) return auth;

    await connectDB();
    const body = await req.json();
    const parsed = updateProfileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "داده‌های نامعتبر", errors: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { name, currentPassword, newPassword } = parsed.data;
    const user = await User.findById(auth.userId).select("+password");

    if (!user) {
      return NextResponse.json({ message: "کاربر یافت نشد" }, { status: 404 });
    }

    if (name) user.name = name;

    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { message: "رمز فعلی برای تغییر رمز الزامی است" },
          { status: 400 },
        );
      }
      const match = await comparePassword(currentPassword, user.password);
      if (!match) {
        return NextResponse.json(
          { message: "رمز عبور فعلی اشتباه است" },
          { status: 400 },
        );
      }
      user.password = await hashPassword(newPassword);
    }

    await user.save();

    const safe = await User.findById(auth.userId).select("-password").lean();

    return NextResponse.json({
      message: "پروفایل با موفقیت به‌روز شد",
      data: safe,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { message: "خطای ارتباط با سرور" },
      { status: 500 },
    );
  }
}
