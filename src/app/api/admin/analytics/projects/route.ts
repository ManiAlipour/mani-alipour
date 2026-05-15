import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/middleware/admin";
import Project from "@/models/Projects";
import Blog from "@/models/Blog";

// /api/admin/analytics/projects
export async function GET(req: NextRequest) {
  try {
    // احراز هویت ادمین
    if (!(await isAdmin(req))) {
      return NextResponse.json(
        { success: false, message: "دسترسی غیرمجاز" },
        { status: 403 },
      );
    }

    // تعداد کل پروژه‌ها
    const totalProjects = await Project.countDocuments();

    // وضعیت پروژه‌ها
    const projectStatusesAgg = await Project.aggregate([
      {
        $group: {
          _id: "$status", 
          count: { $sum: 1 },
        },
      },
    ]);
    const statusCounts: Record<string, number> = {};
    for (const s of projectStatusesAgg) {
      statusCounts[s._id] = s.count;
    }

    // تعداد پروژه‌های هر دسته‌بندی
    const projectsByCategory = await Project.aggregate([
      { $unwind: "$categories" },
      {
        $group: {
          _id: "$categories",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // محبوب‌ترین پروژه‌ها بر اساس views (درصورت وجود)
    let popularProjects: any[] = [];
    if (Project.schema.obj.views !== undefined) {
      popularProjects = await Project.find({})
        .sort({ views: -1 })
        .limit(5)
        .select("title slug views status categories createdAt");
    }

    // آخرین پروژه‌های ایجاد شده
    const latestProjects = await Project.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title slug status categories createdAt");

    // پروژه‌های اخیراً بروزرسانی شده
    const recentlyUpdated = await Project.find({})
      .sort({ updatedAt: -1 })
      .limit(5)
      .select("title slug status categories updatedAt");

    // پروژه‌های اخیراً تکمیل شده
    const recentlyFinished = await Project.find({ status: "finished" })
      .sort({ updatedAt: -1 })
      .limit(5)
      .select("title slug status categories updatedAt");

    // توزیع پروژه‌ها بر اساس ماه و سال
    const monthlyStats = await Project.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // میانگین تعداد بلاگ مرتبط با هر پروژه (در صورت وجود رابطه)
    let avgBlogsPerProject = null;
    if (
      Blog &&
      Blog.schema?.obj?.project !== undefined // اگر Blog مدل رابطه project دارد
    ) {
      const agg = await Blog.aggregate([
        { $group: { _id: "$project", count: { $sum: 1 } } },
        { $group: { _id: null, avgBlogs: { $avg: "$count" } } },
      ]);
      avgBlogsPerProject = agg[0]?.avgBlogs || 0;
    }

    return NextResponse.json({
      success: true,
      data: {
        totalProjects,
        statusCounts,
        projectsByCategory,
        monthlyStats,
        popularProjects,
        latestProjects,
        recentlyUpdated,
        recentlyFinished,
        avgBlogsPerProject,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "خطای سرور" },
      { status: 500 },
    );
  }
}
