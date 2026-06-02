import { connectDB } from "@/lib/mongodb";
import { isSessionUser, requireAuth } from "@/lib/middleware/user";
import { createUserCommentSchema } from "@/lib/validators/user.validator";
import Comment from "@/models/Comment";
import Blog from "@/models/Blog";
import SiteSettings, { SETTINGS_KEY } from "@/models/SiteSettings";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    if (!isSessionUser(auth)) return auth;

    await connectDB();
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit")) || 10));
    const skip = (page - 1) * limit;

    const filter = { userId: auth.userId };

    const [comments, totalItems] = await Promise.all([
      Comment.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("postId", "title slug cover")
        .lean(),
      Comment.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalItems / limit) || 1;

    return NextResponse.json({
      message: "نظرات شما دریافت شد",
      data: comments,
      meta: {
        totalItems,
        totalPages,
        currentPage: page,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { message: "خطای ارتباط با سرور" },
      { status: 500 },
    );
  }
}

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
