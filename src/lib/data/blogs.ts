import { connectDB } from "@/lib/mongodb";
import Tag from "@/models/Tag";
import { getBlogBySlugService, getBlogsService } from "@/services/blog.service";
import serializeBlog, { BlogDTO } from "./serializeBlog";

export async function fetchPublishedBlogs({
  search = "",
  tag = "",
  page = 1,
  limit = 50,
}: {
  search?: string;
  tag?: string;
  page?: number;
  limit?: number;
} = {}): Promise<BlogDTO[]> {
  await connectDB();

  const result = await getBlogsService(limit, page, search, tag);

  return result.blogs.map(serializeBlog);
}

export async function fetchBlogBySlug(slug: string): Promise<BlogDTO | null> {
  await connectDB();

  try {
    const blog = await getBlogBySlugService(slug);

    if (!blog) return null;

    return serializeBlog(blog);
  } catch {
    return null;
  }
}

export async function fetchAllTags() {
  await connectDB();

  const tags = await Tag.find().sort({ name: 1 }).lean();

  return tags.map((tag) => ({
    _id: tag._id.toString(),
    name: tag.name,
    slug: tag.slug,
    description: tag.description ?? "",
    postCount: tag.postCount ?? 0,
    createdAt: tag.createdAt ? tag.createdAt.toISOString() : null,
    updatedAt: tag.updatedAt ? tag.updatedAt.toISOString() : null,
  }));
}
