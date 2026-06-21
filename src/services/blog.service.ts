import Blog from "@/models/Blog";
import { CreateBlogInput } from "@/lib/validators/blog.validator";
import { UpdateBlogInput } from "@/lib/validators/blog.validator";
import "@/models/User";
import "@/models/Tag";
import { revalidateTag } from "next/cache";
import { revalidatePath } from "next/cache";
import Tag from "@/models/Tag";

export async function createBlogService(
  data: CreateBlogInput,
  authorId: string,
) {
  const existingBlog = await Blog.findOne({ slug: data.slug });

  if (existingBlog) {
    throw new Error("مقاله‌ای با این slug قبلاً ساخته شده");
  }

  const blog = await Blog.create({
    ...data,
    author: authorId,
  });

  return blog;
}

export async function getBlogsService(
  limit: number,
  page: number,
  search?: string,
  tag?: string,
) {
  const query: any = { isPublished: true };

  if (search && search.trim() !== "") {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { excerpt: { $regex: search, $options: "i" } },
      { content: { $regex: search, $options: "i" } },
    ];
  }

  if (tag && tag.trim() !== "") {
    query["tags"] = { $exists: true, $ne: [] };

    const foundTag = await Tag.findOne({ slug: tag }).select("_id");
    if (!foundTag) {
      return {
        blogs: [],
        total: 0,
        page,
        totalPages: 0,
      };
    }
    query["tags"] = foundTag._id;
  }

  const skip = (page - 1) * limit;

  const [blogs, total] = await Promise.all([
    Blog.find(query)
      .skip(skip)
      .limit(limit)
      .populate("author", "name")
      .populate("tags", "name slug")
      .sort({ createdAt: -1 })
      .lean(),
    Blog.countDocuments(query),
  ]);

  return {
    blogs,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getBlogBySlugService(slug: string) {
  const blog = await Blog.findOne({ slug, isPublished: true })
    .populate("author", "name")
    .populate("tags", "name slug")
    .lean();

  if (!blog) {
    throw new Error("مقاله پیدا نشد");
  }

  return blog;
}

export async function updateBlogService(id: string, data: UpdateBlogInput) {
  const blog = await Blog.findByIdAndUpdate(id, { $set: data }, { new: true });

  if (!blog) {
    throw new Error("مقاله پیدا نشد");
  }

  revalidateTag(`blog:${blog.slug}`, "max");
  revalidateTag("blogs", "max");

  revalidatePath(`/blogs/${blog.slug}`);
  revalidatePath("/blogs");

  return blog;
}
export async function deleteBlogService(id: string) {
  const blog = await Blog.findByIdAndDelete(id);

  if (!blog) {
    throw new Error("مقاله پیدا نشد");
  }

  return true;
}
