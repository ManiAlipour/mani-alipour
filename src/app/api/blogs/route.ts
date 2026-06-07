import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getBlogsService, createBlogService } from "@/services/blog.service";
import { createBlogSchema } from "@/lib/validators/blog.validator";
import { AuthRequest } from "@/lib/middleware/auth";
import { isAdmin } from "@/lib/middleware/admin";
import Tag from "@/models/Tag";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const search = searchParams.get("search") || "";
    const tag = searchParams.get("tag") || "";

    await connectDB();
    const result = await getBlogsService(limit, page, search, tag);

    const { blogs, total, totalPages } = result;

    return NextResponse.json(
      {
        success: true,
        data: blogs,
        pagination: {
          total,
          totalPages,
          currentPage: page,
          pageSize: limit,
        },
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to fetch blogs",
        error: error.message,
      },
      { status: 500 },
    );
  }
}

export const POST = async (req: NextRequest) => {
  try {
    const admin = isAdmin(req);

    if (!admin)
      return NextResponse.json(
        {
          message: "دسترسی نامعتبر",
        },
        { status: 401 },
      );

    await connectDB();
    const body = await req.json();

    const parseResult = createBlogSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: parseResult.error.issues,
        },
        { status: 400 },
      );
    }

    const { user } = req as AuthRequest;
    if (!user?.userId) {
      return NextResponse.json(
        { success: false, message: "User ID missing" },
        { status: 401 },
      );
    }

    const newBlog = await createBlogService(parseResult.data, user.userId);

    const tags = await Tag.find({ _id: parseResult.data.tags });

    tags.forEach(async (t) => {
      t.postCount++;
      await t.save();
    });

    return NextResponse.json({ success: true, data: newBlog }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to add blog" },
      { status: 500 },
    );
  }
};
