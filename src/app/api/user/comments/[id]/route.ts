import { connectDB } from "@/lib/mongodb";
import { isSessionUser, requireAuth } from "@/lib/middleware/user";
import Comment from "@/models/Comment";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireAuth(req);
    if (!isSessionUser(auth)) return auth;

    await connectDB();
    const { id } = await context.params;

    const deleted = await Comment.findOneAndDelete({
      _id: id,
      userId: auth.userId,
    });

    if (!deleted) {
      return NextResponse.json(
        { message: "نظر مورد نظر یافت نشد" },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: "نظر با موفقیت حذف شد" });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { message: "خطای ارتباط با سرور" },
      { status: 500 },
    );
  }
}
