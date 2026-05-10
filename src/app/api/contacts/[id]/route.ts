import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { updateContactSchema } from "@/lib/validators/contact.validator";
import {
  getContactById,
  updateContact,
  deleteContact,
} from "@/services/contact.service";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    await connectDB();
    const { id } = await params;

    const contact = await getContactById(id);

    if (!contact) {
      return NextResponse.json(
        { message: "پیام مورد نظر یافت نشد." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "پیام با موفقیت دریافت شد.",
      data: contact,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "خطا در دریافت پیام",
        error: error.message || error,
      },
      { status: 500 },
    );
  }
};

export const PATCH = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    const validated = await updateContactSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const sanitized: Record<string, any> = {};
    for (const [key, value] of Object.entries(validated)) {
      if (value !== null && value !== undefined) {
        sanitized[key] = value;
      }
    }

    const updated = await updateContact(id, sanitized);

    if (!updated) {
      return NextResponse.json(
        { message: "پیام مورد نظر یافت نشد." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "پیام با موفقیت بروزرسانی شد.",
      data: updated,
    });
  } catch (error: any) {
    if (error.name === "ValidationError" && error.errors) {
      return NextResponse.json(
        {
          message: "اعتبارسنجی انجام نشد.",
          errors: error.errors,
        },
        { status: 400 },
      );
    }
    return NextResponse.json(
      {
        message: "خطا در بروزرسانی پیام",
        error: error.message || error,
      },
      { status: 500 },
    );
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    await connectDB();
    const { id } = await params;

    const deleted = await deleteContact(id);

    if (!deleted) {
      return NextResponse.json(
        { message: "پیام مورد نظر یافت نشد." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "پیام با موفقیت حذف شد.",
      data: deleted,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "خطا در حذف پیام",
        error: error.message || error,
      },
      { status: 500 },
    );
  }
};
