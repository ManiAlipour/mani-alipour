import { isAdmin } from "@/lib/middleware/admin";
import { connectDB } from "@/lib/mongodb";
import Comment from "@/models/Comment";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const adminCheck = await isAdmin(req);
    if (!adminCheck) {
      return NextResponse.json({ message: "خطای دسترسی" }, { status: 401 });
    }

    await connectDB();
    const { id } = await context.params;

    const deleted = await Comment.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { message: "کامنت مورد نظر یافت نشد" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "کامنت با موفقیت حذف شد",
      data: deleted,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { message: "خطای ارتباط با سرور" },
      { status: 500 },
    );
  }
}
