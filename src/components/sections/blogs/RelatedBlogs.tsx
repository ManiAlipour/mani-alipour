import BlogCard from "@/components/sections/blogs/BlogCard";
import { BlogDTO } from "@/lib/data/serializeBlog";

interface RelatedBlogsProps {
  blogs: BlogDTO[];
}

export default function RelatedBlogs({ blogs }: RelatedBlogsProps) {
  if (!blogs.length) return null;

  return (
    <section className="mt-20 border-t border-white/10 pt-12">
      <h2 className="mb-8 text-2xl font-black text-cyan-50">مقالات مرتبط</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog) => (
          <BlogCard key={blog._id} blog={blog} />
        ))}
      </div>
    </section>
  );
}
