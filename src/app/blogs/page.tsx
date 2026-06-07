import BlogNotFound from "@/components/sections/blogs/BlogNotFound";
import SearchBox from "@/components/sections/blogs/SearchBox";
import TagsSecton from "@/components/sections/blogs/TagsSecton";
import BlogCard from "@/components/ui/BlogCard";
import { getBlogs } from "@/utils/api/get-blogs";
import { getTags } from "@/utils/api/get-tags";
import { LuBookText } from "react-icons/lu";

export type PageProps = {
  searchParams: Promise<{
    search: string;
    tag: string;
  }>;
};

export default async function BlogsPage({ searchParams }: PageProps) {
  const { search, tag } = await searchParams;
  const blogs = await getBlogs(search, tag);
  const tags = await getTags();

  return (
    <div className="min-h-lvh px-2 sm:px-4 py-4 sm:py-8 bg-gradient-to-br from-slate-800 to-neon-blue/30">
      {/* Title */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-2 px-2 sm:px-10 py-4 sm:py-5 items-start sm:items-center">
        <div className="flex items-center gap-2">
          <LuBookText className="text-2xl sm:text-3xl" />
          <h2 className="text-2xl sm:text-3xl font-bold">مقالات من</h2>
        </div>
        <span className="text-cyan-200/70 text-base sm:text-lg mt-1 sm:mt-0 sm:ml-auto sm:mr-10">
          {blogs.length} مقاله
        </span>
      </div>
      <p className="text-cyan-200/70 text-sm sm:text-base md:text-lg px-2 sm:px-10 mb-6">
        درباره توسعه نرم‌افزار، تکنولوژی‌های وب و ساخت تجربه‌های دیجیتالی که
        متمایز هستند.
      </p>
      {/* Search Bar */}
      <div className="my-6 sm:my-10 px-0 sm:px-10">
        <SearchBox />
      </div>
      {/* Tags Section */}
      <TagsSecton tags={tags} />

      {/* Blog Lists */}
      <h3 className="text-lg sm:text-2xl font-bold mx-4 sm:mx-20 my-6 sm:my-10">
        لیست مقالات
      </h3>
      {blogs.length ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 sm:gap-8 max-w-full sm:max-w-6xl mx-auto">
          {blogs.map((blog: TBlog) => (
            <BlogCard key={blog.slug} blog={blog} />
          ))}
        </div>
      ) : (
        <div className="px-2 sm:px-10">
          <BlogNotFound />
        </div>
      )}
      <div className="block sm:hidden mt-10">
        <div className="flex justify-between items-center gap-3 text-xs text-slate-400">
          <span>← اسکرول کنید</span>
          <span>نتایج بیشتر را ببینید</span>
        </div>
      </div>
    </div>
  );
}
