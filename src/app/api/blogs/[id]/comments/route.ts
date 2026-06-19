import { isSessionUser, requireAuth } from "@/lib/middleware/user";
import { connectDB } from "@/lib/mongodb";
import { createUserCommentSchema } from "@/lib/validators/user.validator";
import Blog from "@/models/Blog";
import Comment from "@/models/Comment";
import SiteSettings, { SETTINGS_KEY } from "@/models/SiteSettings";
import { NextRequest, NextResponse } from "next/server";

// GET: دریافت تمام کامنت‌های یک پست خاص
export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await params;
    await connectDB();

    // استفاده از populate برای گرفتن نام و تصویر کاربر از مدل User
    // فرض بر این است که در مدل User فیلدهای name و image داری
    const comments = await Comment.find({ postId: id })
      .populate("userId", "name image isAdmin")
      .sort({ createdAt: -1 }); // جدیدترین‌ها اول

    return NextResponse.json(
      {
        message: "Comments fetched successfully",
        data: comments,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("GET_COMMENTS_ERROR", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
};

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    if (!isSessionUser(auth)) return auth;

    await connectDB();

    const settings = await SiteSettings.findOne({ key: SETTINGS_KEY }).lean();
    if (settings && settings.allowComments === false) {
      return NextResponse.json(
        { message: "ثبت نظر در حال حاضر غیرفعال است" },
        { status: 403 },
      );
    }

    const body = await req.json();
    const parsed = createUserCommentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "داده‌های نامعتبر", errors: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { postId, content } = parsed.data;

    const blog = await Blog.findOne({ _id: postId, isPublished: true });
    if (!blog) {
      return NextResponse.json(
        { message: "مقاله مورد نظر یافت نشد" },
        { status: 404 },
      );
    }

    const comment = await Comment.create({
      userId: auth.userId,
      postId,
      content,
    });

    const populated = await Comment.findById(comment._id)
      .populate("postId", "title slug")
      .lean();

    return NextResponse.json(
      { message: "نظر شما ثبت شد", data: populated },
      { status: 201 },
    );
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { message: "خطای ارتباط با سرور" },
      { status: 500 },
    );
  }
}
