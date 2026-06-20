import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import mongoose from "mongoose";

import { connectDB } from "@/lib/mongodb";
import Like from "@/models/Like";

type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "شناسه مقاله معتبر نیست",
        },
        { status: 400 },
      );
    }

    const postId = new mongoose.Types.ObjectId(id);

    const userId = null;

    const visitorId = req.cookies.get("visitorId")?.value || null;

    const identityConditions = [];

    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      identityConditions.push({
        userId: new mongoose.Types.ObjectId(userId),
      });
    }

    if (visitorId) {
      identityConditions.push({
        visitorId,
      });
    }

    const liked =
      identityConditions.length > 0
        ? Boolean(
            await Like.findOne({
              postId,
              $or: identityConditions,
            }).lean(),
          )
        : false;

    const likeCount = await Like.countDocuments({ postId });

    return NextResponse.json({
      success: true,
      message: "وضعیت لایک دریافت شد",
      data: {
        liked,
        likeCount,
      },
    });
  } catch (error) {
    console.error("GET_LIKE_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "خطا در دریافت وضعیت لایک",
      },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "شناسه مقاله معتبر نیست",
        },
        { status: 400 },
      );
    }

    const postId = new mongoose.Types.ObjectId(id);

    const userId = null;

    let visitorId = req.cookies.get("visitorId")?.value;
    let shouldSetVisitorCookie = false;

    if (!userId && !visitorId) {
      visitorId = randomUUID();
      shouldSetVisitorCookie = true;
    }

    const identityConditions = [];

    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      identityConditions.push({
        userId: new mongoose.Types.ObjectId(userId),
      });
    }

    if (visitorId) {
      identityConditions.push({
        visitorId,
      });
    }

    if (identityConditions.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "شناسه کاربر یا بازدیدکننده یافت نشد",
        },
        { status: 400 },
      );
    }

    const existingLike = await Like.findOne({
      postId,
      $or: identityConditions,
    });

    let liked: boolean;

    if (existingLike) {
      await Like.deleteOne({
        _id: existingLike._id,
      });

      liked = false;
    } else {
      const createPayload: {
        postId: mongoose.Types.ObjectId;
        userId?: mongoose.Types.ObjectId;
        visitorId?: string;
      } = {
        postId,
      };

      if (userId && mongoose.Types.ObjectId.isValid(userId)) {
        createPayload.userId = new mongoose.Types.ObjectId(userId);
      } else if (visitorId) {
        createPayload.visitorId = visitorId;
      }

      await Like.create(createPayload);

      liked = true;
    }

    const likeCount = await Like.countDocuments({ postId });

    const response = NextResponse.json({
      success: true,
      message: liked ? "مقاله لایک شد" : "لایک حذف شد",
      data: {
        liked,
        likeCount,
      },
    });

    if (shouldSetVisitorCookie && visitorId) {
      response.cookies.set("visitorId", visitorId, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 365,
        path: "/",
      });
    }

    return response;
  } catch (error: any) {
    console.error("POST_LIKE_ERROR:", error);

    if (error?.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: "این مقاله قبلاً لایک شده است",
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "خطا در ثبت یا حذف لایک",
      },
      { status: 500 },
    );
  }
}
