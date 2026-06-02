import { connectDB } from "@/lib/mongodb";
import { isSessionUser, requireAuth } from "@/lib/middleware/user";
import Comment from "@/models/Comment";
import Like from "@/models/Like";
import Blog from "@/models/Blog";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    if (!isSessionUser(auth)) return auth;

    await connectDB();

    const user = await User.findById(auth.userId)
      .select("name email role createdAt likedBlogs")
      .lean();

    if (!user) {
      return NextResponse.json({ message: "کاربر یافت نشد" }, { status: 404 });
    }

    const [likesCount, commentsCount, recentLikes, recentComments, latestBlogs] =
      await Promise.all([
        Like.countDocuments({ userId: auth.userId }),
        Comment.countDocuments({ userId: auth.userId }),
        Like.find({ userId: auth.userId })
          .sort({ _id: -1 })
          .limit(4)
          .populate("postId", "title slug cover excerpt createdAt")
          .lean(),
        Comment.find({ userId: auth.userId })
          .sort({ createdAt: -1 })
          .limit(5)
          .populate("postId", "title slug")
          .lean(),
        Blog.find({ isPublished: true })
          .sort({ createdAt: -1 })
          .limit(4)
          .select("title slug cover excerpt readAt createdAt")
          .lean(),
      ]);

    return NextResponse.json({
      message: "داشبورد با موفقیت دریافت شد",
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
        stats: {
          likesCount,
          commentsCount,
          savedCount: user.likedBlogs?.length ?? 0,
        },
        recentLikes,
        recentComments,
        latestBlogs,
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
