import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";

export async function GET() {
  await connectDB();

  const blogs = await Blog.find({}, "slug updatedAt");

  return NextResponse.json(blogs);
}
