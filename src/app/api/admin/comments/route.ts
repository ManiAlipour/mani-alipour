import { isAdmin } from "@/lib/middleware/admin";
import { connectDB } from "@/lib/mongodb";
import Comment from "@/models/Comment";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const adminCheck = await isAdmin(req);
    if (!adminCheck) {
      return NextResponse.json({ message: "خطای دسترسی" }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(req.url);

    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(
      100,
      Math.max(1, Number(searchParams.get("limit")) || 10),
    );
    const userId = searchParams.get("user");

    const query = userId ? { userId } : {};

    const [comments, totalComments] = await Promise.all([
      Comment.find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip((page - 1) * limit),
      Comment.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalComments / limit);

    return NextResponse.json({
      message: userId
        ? "کامنت‌های کاربر با موفقیت دریافت شد"
        : "کامنت‌ها با موفقیت دریافت شد",
      data: comments,
      meta: {
        totalItems: totalComments,
        totalPages: totalPages,
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
