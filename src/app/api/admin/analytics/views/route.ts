import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { isAdmin } from "@/lib/middleware/admin";
import View from "@/models/View";
import Blog from "@/models/Blog";
import User from "@/models/User";

export const GET = async (req: NextRequest) => {
  try {
    await connectDB();

    const adminCheck = await isAdmin(req);
    if (!adminCheck)
      return NextResponse.json(
        {
          message: "دسترسی مجاز نیست",
        },
        { status: 401 },
      );

    // تمام ویوها
    const totalViews = await View.countDocuments();

    // ویوها براساس نوع
    const viewsByType = await View.aggregate([
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
        },
      },
    ]);

    // ویوها براساس ماه
    const monthlyViews = await View.aggregate([
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
    
    // ویوها براساس IP (یعنی unique views)
    const uniqueViews = await View.distinct("ip");

    // بیشترین بازدیدها برای هر نوع (top 5 blog, top 5 pages,...)
    const topViewedBlogs = await Blog.find({})
      .sort({ views: -1 })
      .limit(5)
      .select("title slug author views createdAt");
    // اگر ویو برای صفحات دیگر/انواع دیگر داریم
    const topViewedPages = await View.aggregate([
      { $match: { type: "page" } },
      { $group: { _id: "$slug", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    // میانگین ویو هر بلاگ
    const avgViewsPerBlogAgg = await Blog.aggregate([
      {
        $group: {
          _id: null,
          avgViews: { $avg: "$views" },
        },
      },
    ]);
    const avgViewsPerBlog = avgViewsPerBlogAgg[0]?.avgViews || 0;

    // کاربران با بیشترین بازدید دریافت‌شده روی مطالب‌شان (top 5 authors by total blog views)
    const topAuthorsAgg = await Blog.aggregate([
      {
        $group: {
          _id: "$author",
          totalViews: { $sum: "$views" },
        },
      },
      { $sort: { totalViews: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "users", // دقت کن نام کالکشن باید درست باشد
          localField: "_id",
          foreignField: "_id",
          as: "authorInfo",
        },
      },
      {
        $unwind: {
          path: "$authorInfo",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          totalViews: 1,
          author: "$authorInfo.name",
          email: "$authorInfo.email",
        },
      },
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalViews,
        uniqueViews: uniqueViews.length,
        viewsByType,
        monthlyViews,
        topViewedBlogs,
        topViewedPages,
        avgViewsPerBlog,
        topAuthors: topAuthorsAgg,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message ? error.message : "خطای سرور" },
      { status: 500 },
    );
  }
};