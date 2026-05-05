import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { deleteBlogService, updateBlogService } from "@/services/blog.service";
import { withAdmin } from "@/lib/middleware/admin";
import { updateBlogSchema } from "@/lib/validators/blog.validator";

// PUT (update blog) - only admin
export const PUT = withAdmin(
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    try {
      await connectDB();
      const { id } = params;
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
  },
);

// DELETE blog - only admin
export const DELETE = withAdmin(
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    try {
      await connectDB();
      const { id } = params;

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
  },
);
