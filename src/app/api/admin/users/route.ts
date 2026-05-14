import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/middleware/admin";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export const GET = async (req: NextRequest) => {
  try {
    const adminCheck = await isAdmin(req);
    if (!adminCheck)
      return NextResponse.json({ message: "خطای دسترسی" }, { status: 401 });

    await connectDB();

    const users = await User.find({}, "-password -__v").sort({ createdAt: -1 });

    return NextResponse.json({
      message: "لیست کاربران",
      data: users,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { message: "خطای سرور هنگام دریافت کاربران" },
      { status: 500 },
    );
  }
};
