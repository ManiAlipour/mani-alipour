import { NextRequest, NextResponse } from "next/server";
import Like from "@/models/Like";
import Blog from "@/models/Blog";
import { connectDB } from "@/lib/mongodb";
import { verifyJWT } from "@/utils/jwt";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    await connectDB();
    const { id: postId } = await params;

    const blog = await Blog.findById(postId);
    if (!blog) {
      return NextResponse.json(
        { message: "پست مورد نظر یافت نشد" },
        { status: 404 },
      );
    }

    const likeCount = await Like.countDocuments({ postId });

    return NextResponse.json({
      message: "آمار لایک‌ها با موفقیت دریافت شد",
      data: { likeCount },
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: "خطا در دریافت لایک‌ها", error: error?.message },
      { status: 500 },
    );
  }
};

export const POST = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    await connectDB();
    const { id: postId } = await params;

    const blog = await Blog.findById(postId);
    if (!blog) {
      return NextResponse.json(
        { message: "پست مورد نظر یافت نشد" },
        { status: 404 },
      );
    }

    const authHeader = req.headers.get("authorization");
    let userId: string | undefined;
    let ip: string | undefined;

    if (authHeader) {
      try {
        const token = authHeader.replace("Bearer ", "").trim();
        const user = await verifyJWT(token);
        userId = user?.userId;
      } catch (error) {
        userId = undefined;
      }
    }

    ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();

    const query: any = { postId };
    if (userId) {
      query.userId = userId;
    } else if (ip) {
      query.userId = null;
      query.ip = ip;
    }

    const existingLike = await Like.findOne(query);

    if (existingLike) {
      await Like.deleteOne({ _id: existingLike._id });
      return NextResponse.json(
        { message: "لایک شما حذف شد!", data: { liked: false } },
        { status: 200 },
      );
    } else {
      await Like.create({
        postId,
        userId: userId || undefined,
        ip: userId ? undefined : ip,
      });
      return NextResponse.json(
        { message: "پست با موفقیت لایک شد!", data: { liked: true } },
        { status: 201 },
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { message: "خطا در ثبت لایک", error: error?.message },
      { status: 500 },
    );
  }
};
