import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { verifyJWT } from "@/utils/jwt";
import View from "@/models/View";
import Blog from "@/models/Blog";
import { withAdmin } from "@/lib/middleware/admin";

export const GET = withAdmin(
  async (
    req: NextRequest,
    {
      params,
    }: {
      params: Promise<{ id: string }>;
    },
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

      const totalViews = await View.countDocuments({ postId });

      const uniqueUsers = await View.distinct("userId", {
        postId,
        userId: { $ne: null },
      });
      const uniqueIps = await View.distinct("ip", { postId, userId: null });

      return NextResponse.json({
        message: "آمار بازدید با موفقیت دریافت شد",
        data: {
          totalViews,
          uniqueUserCount: uniqueUsers.length,
          uniqueIpCount: uniqueIps.length,
        },
      });
    } catch (error: any) {
      return NextResponse.json(
        { message: "خطا در دریافت آمار بازدید", error: error?.message },
        { status: 500 },
      );
    }
  },
);

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

    let existingView = null;
    const query: any = { postId };
    if (userId) {
      query.userId = userId;
    } else if (ip) {
      query.userId = null;
      query.ip = ip;
    }

    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    query.createdAt = { $gte: since };
    existingView = await View.findOne(query);

    if (existingView) {
      return NextResponse.json(
        { message: "بازدید شما اخیراً ثبت شده است" },
        { status: 200 },
      );
    }

    await View.create({
      postId,
      userId: userId || undefined,
      ip: userId ? undefined : ip,
    });

    return NextResponse.json(
      { message: "بازدید با موفقیت ثبت شد!" },
      { status: 201 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "خطای سرور در ثبت بازدید", error: error?.message },
      { status: 500 },
    );
  }
};
