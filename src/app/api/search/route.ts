import { NextResponse } from "next/server";
import {connectDB} from "@/lib/mongodb"; // مطمئن شو مسیر فایل اتصال به دیتابیست درسته
import Blog from "@/models/Blog";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");

    if (!q || q.length < 2) {
      return NextResponse.json({ results: [] });
    }

    await connectDB();

    const blogs = await Blog.find({
      isPublished: true,
      $or: [
        { title: { $regex: q, $options: "i" } },
        { excerpt: { $regex: q, $options: "i" } },
      ],
    })
      .select("title slug") // فقط فیلدهای مورد نیاز رو برمی‌گردونیم برای سرعت بیشتر
      .limit(8)
      .lean();

    return NextResponse.json({ results: blogs });
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
