export type BlogDTO = {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  readAt: number;
  cover: string;
  isPublished: boolean;
  createdAt: string | null;
  updatedAt: string | null;
  author: {
    name: string;
  };
  tags: {
    _id: string;
    name: string;
    slug: string;
  }[];
};

function serializeBlog(blog: any): BlogDTO {
  return {
    _id: String(blog._id),
    slug: blog.slug,
    title: blog.title,
    excerpt: blog.excerpt ?? "",
    content: blog.content ?? "",
    readAt:
      typeof blog.readAt === "number"
        ? blog.readAt
        : parseInt(blog.readAt) || 1,
    cover: blog.cover ?? "",
    isPublished: Boolean(blog.isPublished),
    createdAt: blog.createdAt ? new Date(blog.createdAt).toISOString() : null,
    updatedAt: blog.updatedAt ? new Date(blog.updatedAt).toISOString() : null,
    author: (() => {
      if (typeof blog.author === "object" && blog.author !== null) {
        // author is populated
        return { name: blog.author.name ?? "" };
      } else if (typeof blog.author === "string") {
        // Only ID is present, fallback to default/unknown
        return { name: "" };
      } else {
        // Unknown/invalid structure
        return { name: "" };
      }
    })(),
    tags: Array.isArray(blog.tags)
      ? blog.tags.map((tag: any) => {
          if (tag && typeof tag === "object") {
            return {
              _id: String(tag._id),
              name: tag.name ?? "",
              slug: tag.slug ?? "",
            };
          }
          // Just ObjectId, not populated
          return {
            _id: String(tag),
            name: "",
            slug: "",
          };
        })
      : [],
  };
}

export default serializeBlog;
