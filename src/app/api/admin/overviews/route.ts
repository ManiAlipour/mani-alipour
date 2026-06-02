import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import Project from "@/models/Projects";
import Blog from "@/models/Blog";
import Comment from "@/models/Comment";
import Contact from "@/models/Contact";
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

    const [
      userCount,
      blogCount,
      projectCount,
      viewCount,
      commentCount,
      contactCount,
      publishedBlogCount,
      newContactCount,
    ] = await Promise.all([
      User.countDocuments(),
      Blog.countDocuments(),
      Project.countDocuments(),
      View.countDocuments(),
      Comment.countDocuments(),
      Contact.countDocuments(),
      Blog.countDocuments({ isPublished: true }),
      Contact.countDocuments({ status: "new" }),
    ]);

    return NextResponse.json({
      message: "موفق!",
      data: {
        userCount,
        blogCount,
        projectCount,
        viewCount,
        commentCount,
        contactCount,
        publishedBlogCount,
        newContactCount,
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
