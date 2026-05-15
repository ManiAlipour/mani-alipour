import { NextRequest, NextResponse } from "next/server";
import Project from "@/models/Projects";
import { connectDB } from "@/lib/mongodb";
import { isAdmin } from "@/lib/middleware/admin";
import type { ProjectStatus } from "@/models/Projects";
import { projectValidator } from "@/lib/validators/project.validator";

/**
 * Only permit query/search and creation based on what exists in the @models/Projects model.
 */

export const GET = async (req: NextRequest) => {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    // Construct filters only from schema fields
    const filters: Record<string, any> = {};

    // Fulltext search
    if (searchParams.has("q")) {
      const q = searchParams.get("q")!;
      filters.$or = [
        { title: { $regex: q, $options: "i" } },
        { shortDescription: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { techStack: { $elemMatch: { $regex: q, $options: "i" } } },
      ];
    }

    // Boolean filters for isPublished, featured
    if (searchParams.has("isPublished")) {
      const val = searchParams.get("isPublished");
      if (val === "true" || val === "false")
        filters.isPublished = val === "true";
    }
    if (searchParams.has("featured")) {
      const val = searchParams.get("featured");
      if (val === "true" || val === "false") filters.featured = val === "true";
    }

    // Status filter - must be a valid ProjectStatus
    if (searchParams.has("status")) {
      const status = searchParams.get("status");
      const validStatus: ProjectStatus[] = [
        "planned",
        "in-progress",
        "done",
        "archived",
      ];
      if (status && validStatus.includes(status as ProjectStatus)) {
        filters.status = status;
      }
    }

    // Slug filter (unique, string)
    if (searchParams.has("slug")) {
      filters.slug = searchParams.get("slug")?.toLowerCase();
    }

    // Pagination
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(
      1,
      Math.min(100, parseInt(searchParams.get("limit") || "20", 10)),
    );
    const skip = (page - 1) * limit;

    const projects = await Project.find(filters)
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Project.countDocuments(filters);

    return NextResponse.json({
      message: "Projects fetched successfully",
      data: projects,
      total,
      page,
      pageSize: limit,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: "خطا در دریافت پروژه‌ها", error: error?.message },
      { status: 500 },
    );
  }
};

export const POST = async (req: NextRequest) => {
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
    const body = await req.json();

    let validated;
    try {
      validated = await projectValidator.validate(body, {
        stripUnknown: true,
        abortEarly: false,
      });
    } catch (validationError: any) {
      const errors =
        validationError?.inner?.length > 0
          ? validationError.inner.map((err: any) => err.message)
          : [validationError.message];
      return NextResponse.json(
        { message: "خطا در اعتبارسنجی پروژه", errors },
        { status: 400 },
      );
    }

    validated.slug = validated.slug.trim().toLowerCase();

    const exists = await Project.findOne({ slug: validated.slug });
    if (exists) {
      return NextResponse.json(
        { message: "پروژه با این اسلاگ قبلاً ثبت شده است" },
        { status: 409 },
      );
    }

    const newProject = await Project.create(validated);

    return NextResponse.json(
      { message: "پروژه با موفقیت ایجاد شد", data: newProject },
      { status: 201 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "خطا در ایجاد پروژه", error: error?.message },
      { status: 500 },
    );
  }
};
