import { NextRequest, NextResponse } from "next/server";
import Project from "@/models/Projects";
import { connectDB } from "@/lib/mongodb";

export const GET = async (req: NextRequest) => {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    
    // Filters: ?q=search&isPublished=true&featured=true&status=done, etc.
    const filters: any = {};
    if (searchParams.has("q")) {
      const q = searchParams.get("q")!;
      filters.$or = [
        { title: { $regex: q, $options: "i" } },
        { shortDescription: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { techStack: { $elemMatch: { $regex: q, $options: "i" } } },
      ];
    }
    if (searchParams.has("isPublished")) {
      filters.isPublished = searchParams.get("isPublished") === "true";
    }
    if (searchParams.has("featured")) {
      filters.featured = searchParams.get("featured") === "true";
    }
    if (searchParams.has("status")) {
      filters.status = searchParams.get("status");
    }
    if (searchParams.has("slug")) {
      filters.slug = searchParams.get("slug");
    }

    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const projects = await Project.find(filters)
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

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

// POST /api/pojects - Create a new project
export const POST = async (req: NextRequest) => {
  try {
    await connectDB();
    const body = await req.json();

    // Validation (rudimentary, replace with Zod/Joi as needed)
    if (!body.title || !body.slug || !body.description) {
      return NextResponse.json(
        { message: "اطلاعات ضروری پروژه ناقص است" },
        { status: 400 },
      );
    }

    const exists = await Project.findOne({ slug: body.slug });
    if (exists) {
      return NextResponse.json(
        { message: "پروژه با این اسلاگ قبلاً ثبت شده است" },
        { status: 409 },
      );
    }

    const newProject = await Project.create(body);

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