import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Tag from "@/models/Tag";
import { createTagSchema } from "@/lib/validators/tag.validator";

export const GET = async () => {
  try {
    await connectDB();

    const tags = await Tag.find();

    return NextResponse.json({
      message: "تگ ها با موفقیت دریافت شد",
      data: tags,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "خطای ارتباط به سرور" },
      { status: 500 },
    );
  }
};

export const POST = async (req: NextRequest) => {
  try {
    await connectDB();

    const body = await req.json();

    const { success, data, error } = createTagSchema.safeParse(body);

    if (!success)
      return NextResponse.json(
        {
          message: error.message,
        },
        { status: 400 },
      );

    const exist = await Tag.findOne({
      $or: [{ slug: data.slug }, { name: data.name }],
    });

    if (exist)
      return NextResponse.json(
        {
          message: "این تگ قبلا ثبت شده است",
        },
        { status: 400 },
      );

    const tag = await Tag.create({
      name: data.name,
      slug: data.slug,
      ...(data.description && { description: data.description }),
    });
   return NextResponse.json(
      {
        messsage: "تگ با موفقیت ثبت شد",
        data: tag,
      },
      { status: 201 },
    );
  } catch (_) {
    return NextResponse.json(
      {
        message: "خطا در ارتباط با سرور",

      },
      { status: 500 },
    );
  }
};
