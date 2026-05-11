import { NextRequest, NextResponse } from "next/server";
import Project from "@/models/Projects";
import { connectDB } from "@/lib/mongodb";
import { isAdmin } from "@/lib/middleware/admin";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    await connectDB();
    const { id } = await params;

    // Allow finding by _id or slug
    let project;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      project = await Project.findById(id);
    }
    if (!project) {
      project = await Project.findOne({ slug: id });
    }

    if (!project) {
      return NextResponse.json(
        { message: "پروژه مورد نظر یافت نشد" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "پروژه با موفقیت دریافت شد",
      data: project,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: "خطا در دریافت پروژه", error: error?.message },
      { status: 500 },
    );
  }
};

export const PATCH = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
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
    const { id } = await params;
    const body = await req.json();

    let existing;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      existing = await Project.findById(id);
    }
    if (!existing) {
      existing = await Project.findOne({ slug: id });
    }
    if (!existing) {
      return NextResponse.json(
        { message: "پروژه مورد نظر یافت نشد" },
        { status: 404 },
      );
    }

    // If slug is being updated, check for duplicate
    if (body.slug && body.slug !== existing.slug) {
      const slugTaken = await Project.findOne({ slug: body.slug });
      if (slugTaken) {
        return NextResponse.json(
          { message: "پروژه با این اسلاگ قبلاً ثبت شده است" },
          { status: 409 },
        );
      }
    }

    Object.assign(existing, body);
    await existing.save();

    return NextResponse.json({
      message: "پروژه با موفقیت بروزرسانی شد",
      data: existing,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: "خطا در بروزرسانی پروژه", error: error?.message },
      { status: 500 },
    );
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
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
    const { id } = await params;

    let project;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      project = await Project.findByIdAndDelete(id);
    }
    if (!project) {
      project = await Project.findOneAndDelete({ slug: id });
    }
    if (!project) {
      return NextResponse.json(
        { message: "پروژه مورد نظر یافت نشد" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "پروژه با موفقیت حذف شد",
      data: project,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: "خطا در حذف پروژه", error: error?.message },
      { status: 500 },
    );
  }
};
