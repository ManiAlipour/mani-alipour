import Blog from "@/models/Blog";
import { CreateBlogInput } from "@/lib/validators/blog.validator";
import { UpdateBlogInput } from "@/lib/validators/blog.validator";
import "@/models/User";
import "@/models/Tag";

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

export async function getBlogsService() {
  const blogs = await Blog.find({ isPublished: true })
    .populate("author", "name")
    .populate("tags", "name slug")
    .sort({ createdAt: -1 })
    .lean();

  return blogs;
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

  return blog;
}

export async function deleteBlogService(id: string) {
  const blog = await Blog.findByIdAndDelete(id);

  if (!blog) {
    throw new Error("مقاله پیدا نشد");
  }

  return true;
}
