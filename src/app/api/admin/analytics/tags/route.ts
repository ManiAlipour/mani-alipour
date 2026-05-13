import { NextRequest, NextResponse } from "next/server";
import Tag from "@/models/Tag";
import Blog from "@/models/Blog";
import { connectDB } from "@/lib/mongodb";
import { isAdmin } from "@/lib/middleware/admin";

export const GET = async (req: NextRequest) => {
  try {
    await connectDB();

    const adminCheck = await isAdmin(req);
    if (!adminCheck)
      return NextResponse.json(
        {
          messsage: "دسترسی مجاز نیست",
        },
        { status: 401 },
      );

    // Total tags count
    const totalTags = await Tag.countDocuments();

    // Tags in use (used in at least one blog post)
    const tagsInUseAgg = await Blog.aggregate([
      { $unwind: "$tags" },
      { $group: { _id: "$tags", blogCount: { $sum: 1 } } },
      {
        $lookup: {
          from: "tags",
          localField: "_id",
          foreignField: "_id",
          as: "tagInfo"
        }
      },
      { $unwind: "$tagInfo" },
      { $project: { _id: 1, blogCount: 1, name: "$tagInfo.name" } }
    ]);

    // Number of distinct tags used
    const tagsInUse = tagsInUseAgg.length;

    // Unused tags (tags not used in any blog)
    const usedTagIds = tagsInUseAgg.map(t => t._id);
    const unusedTags = await Tag.find(usedTagIds.length ? { _id: { $nin: usedTagIds } } : {}).select("name");

    // Top tags by blog usage
    const topTags = tagsInUseAgg
      .sort((a, b) => b.blogCount - a.blogCount)
      .slice(0, 5)
      .map(t => ({
        tagId: t._id,
        name: t.name,
        blogCount: t.blogCount
      }));

    // Distribution: number of tags per blog (for statistics)
    const tagsPerBlogAgg = await Blog.aggregate([
      { $project: { tagsCount: { $size: "$tags" } } },
      {
        $group: {
          _id: "$tagsCount",
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Most recently added tags
    const latestTags = await Tag.find({}).sort({ createdAt: -1 }).limit(5).select("name createdAt");

    return NextResponse.json({
      success: true,
      data: {
        totalTags,
        tagsInUse,
        unusedTags: unusedTags.map(t => t.name),
        topTags,
        tagsPerBlogDistribution: tagsPerBlogAgg, // array of { _id: <tagsCount>, count: <blogsWithThisCount> }
        latestTags,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message ? error.message : "خطای سرور" },
      { status: 500 },
    );
  }
};