import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import Project from "@/models/Projects";
import Blog from "@/models/Blog";
import { connectDB } from "@/lib/mongodb";
import { isAdmin } from "@/lib/middleware/admin";
import View from "@/models/View";

export const GET = async (req: NextRequest) => {
  try {
    const adminCheck = await isAdmin(req);
    if (!adminCheck)
      return NextResponse.json(
        {
          message: "خطای دسترسی",
        },
        { status: 401 },
      );

    await connectDB();

    const [userCount, blogCount, projectCount, viewCount] = await Promise.all([
      User.countDocuments(),
      Blog.countDocuments(),
      Project.countDocuments(),
      View.countDocuments(),
    ]);

    return NextResponse.json({
      message: "موفق!",
      data: {
        userCount,
        blogCount,
        projectCount,
        viewCount,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "خطای ارتباط با سرور" },
      { status: 500 },
    );
  }
};
