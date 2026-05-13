import { NextRequest, NextResponse } from "next/server";
import Blog from "@/models/Blog";
import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";
import { isAdmin } from "@/lib/middleware/admin";

export const GET = async (req: NextRequest) => {
  try {
    await connectDB();

    // Check Admin Permission
    const adminCheck = await isAdmin(req);
    if (!adminCheck) {
      return NextResponse.json(
        { message: "دسترسی مجاز نیست" },
        { status: 401 },
      );
    }

    // Total Blogs Count
    const totalBlogs = await Blog.countDocuments();

    // Published / Draft Blogs Count
    const publishedBlogs = await Blog.countDocuments({ status: "published" });
    const draftBlogs = await Blog.countDocuments({ status: "draft" });

    // Blogs by Author Count
    // Group by Author and count blogs
    const blogsByAuthor = await Blog.aggregate([
      {
        $group: {
          _id: "$author",
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "authorInfo",
        },
      },
      {
        $unwind: { path: "$authorInfo", preserveNullAndEmptyArrays: true },
      },
      {
        $project: {
          _id: 0,
          authorId: "$_id",
          authorName: "$authorInfo.name",
          authorEmail: "$authorInfo.email",
          count: 1,
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Blog Monthly Stats (createdAt)
    const monthlyStats = await Blog.aggregate([
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

    // Latest Blogs
    const latestBlogs = await Blog.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title slug author status createdAt");

    // Top Viewed Blogs
    const topViewedBlogs = await Blog.find({})
      .sort({ views: -1 })
      .limit(5)
      .select("title slug author views createdAt");

    // Average Views per Blog
    const avgViews = await Blog.aggregate([
      {
        $group: {
          _id: null,
          avgViews: { $avg: "$views" },
        },
      },
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalBlogs,
        publishedBlogs,
        draftBlogs,
        blogsByAuthor,
        monthlyStats,
        latestBlogs,
        topViewedBlogs,
        averageViews: avgViews[0]?.avgViews || 0,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message ? error.message : "خطای سرور",
      },
      { status: 500 },
    );
  }
};
