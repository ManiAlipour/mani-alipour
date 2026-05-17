import { NextRequest, NextResponse } from "next/server";
import Blog from "@/models/Blog";
import { connectDB } from "@/lib/mongodb";
import { isAdmin } from "@/lib/middleware/admin";

export const GET = async (req: NextRequest) => {
  try {
    const adminCheck = await isAdmin(req);
    if (!adminCheck)
      return NextResponse.json(
        {
          message: "عدم دسترسی",
        },
        { status: 401 },
      );

    await connectDB();
    const blogs = (await Blog.find({})).reverse();

    return NextResponse.json({
      message: "بلاگ ها با موفقیت دریافت شد",
      data: blogs,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "خطا در اتصال به سرور",
      },
      { status: 500 },
    );
  }
};
