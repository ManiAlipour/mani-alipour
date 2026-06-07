import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import {
  deleteBlogService,
  getBlogBySlugService,
  updateBlogService,
} from "@/services/blog.service";
import { isAdmin } from "@/lib/middleware/admin";
import { updateBlogSchema } from "@/lib/validators/blog.validator";

// GET request f
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const { id: slug } = await context.params;

    if (!slug) {
      return NextResponse.json(
        { success: false, message: "Slug is required" },
        { status: 400 },
      );
    }

    const blog = await getBlogBySlugService(slug);

    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Blog not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: blog }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to fetch blog" },
      { status: 500 },
    );
  }
}

// PUT - only admin
export const PUT = async (
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) => {
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
    const { id } = await context.params;
    const body = await req.json();

    const parseResult = updateBlogSchema.safeParse(body);
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

    const updatedBlog = await updateBlogService(id, parseResult.data);

    if (!updatedBlog) {
      return NextResponse.json(
        { success: false, message: "Blog not found or update failed" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: true, data: updatedBlog },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to update blog" },
      { status: 500 },
    );
  }
};

// DELETE blog - only admin
export const DELETE = async (
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) => {
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
    const { id } = await context.params;

    const deletedBlog = await deleteBlogService(id);

    if (!deletedBlog) {
      return NextResponse.json(
        { success: false, message: "Blog not found or delete failed" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: true, message: "Blog deleted successfully" },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to delete blog" },
      { status: 500 },
    );
  }
};
