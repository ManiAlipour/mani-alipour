import { connectDB } from "@/lib/mongodb";
import { isSessionUser, requireAuth } from "@/lib/middleware/user";
import Like from "@/models/Like";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    if (!isSessionUser(auth)) return auth;

    await connectDB();
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit")) || 12));
    const skip = (page - 1) * limit;

    const filter = { userId: auth.userId };

    const [likes, totalItems] = await Promise.all([
      Like.find(filter)
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)
        .populate({
          path: "postId",
          select: "title slug cover excerpt readAt createdAt author",
          populate: { path: "author", select: "name" },
        })
        .lean(),
      Like.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalItems / limit) || 1;

    return NextResponse.json({
      message: "لیست علاقه‌مندی‌ها دریافت شد",
      data: likes,
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
