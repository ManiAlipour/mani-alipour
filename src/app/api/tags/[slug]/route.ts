import { isAdmin } from "@/lib/middleware/admin";
import { connectDB } from "@/lib/mongodb";
import { updateTagSchema } from "@/lib/validators/tag.validator";
import Tag from "@/models/Tag";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) => {
  try {
    await connectDB();

    const { slug } = await params;

    if (!slug)
      return NextResponse.json(
        {
          message: "اسلاگ تگ نامعتبر است",
        },
        { status: 400 },
      );

    const tag = await Tag.findOne({ slug });

    if (!tag)
      return NextResponse.json(
        {
          message: "تگی یافت نشد",
        },
        { status: 404 },
      );

    NextResponse.json({
      message: "تک با موفقیت یافت شد",
      data: tag,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "خطای ارتباط با سرور",
      },
      { status: 500 },
    );
  }
};

export const PUT = async (
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) => {
  try {
    const admin = isAdmin(req);

    if (!admin)
      return NextResponse.json(
        {
          message: "دسترسی نامعتبر",
        },
        { status: 401 },
      );

    await connectDB();

    const { slug } = await params;

    if (!slug)
      return NextResponse.json(
        {
          message: "اسلاک نامعتبر",
        },
        { status: 400 },
      );

    const body = await req.json();

    const { data, success, error } = updateTagSchema.safeParse(body);

    if (!success)
      return NextResponse.json(
        {
          message: error.message,
        },
        { status: 400 },
      );

    const tag = await Tag.findOneAndUpdate(
      { slug },
      {
        ...(data.name && { name: data.name }),
        ...(data.slug && { slug: data.slug }),
        ...(data.description && { description: data.description }),
      },
    );

    if (!tag)
      return NextResponse.json(
        {
          message: "تگ یافت نشد",
        },
        { status: 404 },
      );
    return NextResponse.json({
      message: "تگ با موفقیت اپدیت شد",
      data: tag,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "خطا در ارتباط با سرور",
      },
      { status: 500 },
    );
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) => {
  try {
    const admin = isAdmin(req);

    if (!admin)
      return NextResponse.json(
        {
          message: "دسترسی نامعتبر",
        },
        { status: 401 },
      );

    await connectDB();

    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        {
          message: "اسلاک نامعتبر",
        },
        { status: 400 },
      );
    }

    const tag = await Tag.findOneAndDelete({ slug });

    if (!tag) {
      return NextResponse.json(
        {
          message: "تگ یافت نشد",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "تگ با موفقیت حذف شد",
      data: tag,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "خطا در ارتباط با سرور",
      },
      { status: 500 },
    );
  }
};
