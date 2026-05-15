import { NextRequest, NextResponse } from "next/server";
import Project, { IProjectDocument, ProjectStatus } from "@/models/Projects";
import { connectDB } from "@/lib/mongodb";
import { isAdmin } from "@/lib/middleware/admin";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    await connectDB();
    const { id } = await params;

    // جستجو بر اساس ObjectId یا slug
    let project: IProjectDocument | null = null;
    if (/^[0-9a-fA-F]{24}$/.test(id)) {
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

// PATCH: بروزرسانی پروژه
export const PATCH = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const admin = await isAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { message: "دسترسی نامعتبر" },
        { status: 401 }
      );
    }

    await connectDB();
    const { id } = await params;
    const body = await req.json();

    // فقط اجازه پراپرتی‌های موجود در مدل رو به روز کن
    const allowedFields: (keyof IProjectDocument)[] = [
      "title",
      "slug",
      "shortDescription",
      "description",
      "status",
      "techStack",
      "githubUrl",
      "demoUrl",
      "coverImage",
      "gallery",
      "featured",
      "order",
      "isPublished",
    ];

    let existing: IProjectDocument | null = null;
    if (/^[0-9a-fA-F]{24}$/.test(id)) {
      existing = await Project.findById(id);
    }
    if (!existing) {
      existing = await Project.findOne({ slug: id });
    }
    if (!existing) {
      return NextResponse.json(
        { message: "پروژه مورد نظر یافت نشد" },
        { status: 404 }
      );
    }

    // اگر slug عوض می‌شود چک کن که تکراری نباشد
    if (
      body.slug &&
      body.slug !== existing.slug &&
      (await Project.findOne({ slug: body.slug }))
    ) {
      return NextResponse.json(
        { message: "پروژه با این اسلاگ قبلاً ثبت شده است" },
        { status: 409 }
      );
    }

    // فقط پراپرتی‌های مجاز را اعمال کن
    for (const key of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(body, key)) {
        // نوع دهی و تبدیل انواع خاص
        if (key === "techStack" && Array.isArray(body[key])) {
          (existing as any)[key] = body[key].map((x: any) => String(x));
        } else if (key === "gallery" && Array.isArray(body[key])) {
          (existing as any)[key] = body[key].map((x: any) => String(x));
        } else if (key === "order" && body[key] !== undefined) {
          (existing as any)[key] =
            typeof body[key] === "number"
              ? body[key]
              : Number(body[key]) || 0;
        } else if (key === "featured" || key === "isPublished") {
          (existing as any)[key] = Boolean(body[key]);
        } else if (body[key] !== undefined) {
          (existing as any)[key] = body[key];
        }
      }
    }

    await existing.save();

    return NextResponse.json({
      message: "پروژه با موفقیت بروزرسانی شد",
      data: existing,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: "خطا در بروزرسانی پروژه", error: error?.message },
      { status: 500 }
    );
  }
};

// DELETE: حذف یک پروژه
export const DELETE = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const admin = await isAdmin(req);

    if (!admin) {
      return NextResponse.json(
        { message: "دسترسی نامعتبر" },
        { status: 401 }
      );
    }

    await connectDB();
    const { id } = await params;

    let project: IProjectDocument | null = null;
    if (/^[0-9a-fA-F]{24}$/.test(id)) {
      project = await Project.findByIdAndDelete(id);
    }
    if (!project) {
      project = await Project.findOneAndDelete({ slug: id });
    }
    if (!project) {
      return NextResponse.json(
        { message: "پروژه مورد نظر یافت نشد" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "پروژه با موفقیت حذف شد",
      data: project,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: "خطا در حذف پروژه", error: error?.message },
      { status: 500 }
    );
  }
};
