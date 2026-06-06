import SearchBox from "@/components/sections/blogs/SearchBox";
import BlogCard from "@/components/ui/BlogCard";
import { LuBookText } from "react-icons/lu";

export type PageProps = {
  searchParams: Promise<{
    search: string;
  }>;
};

export default async function BlogsPage({ searchParams }: PageProps) {
  const { search } = await searchParams;
  console.log(search);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/blogs?${
      search ? `search=${search}` : ""
    }`,
  );
  const data = await response.json();
  const blogs = data.data;


  // TODO: ADD TAGS, ADD FILTERS AND RESPONSIVE 
  return (
    <div className="min-h-lvh px-5 py-5 bg-gradient-to-br from-slate-800 to-neon-blue/30">
      <div className="text-3xl font-bold  gap-2 px-10 py-5">
        <div className="flex items-center gap-2">
          <LuBookText />
          <h2>مقالات من</h2>
        </div>

        <span className="text-cyan-200/70 text-base md:text-lg ml-auto mr-10">
          {blogs.length} مقاله
        </span>

        <p className="text-cyan-200/70 text-base md:text-lg mr-10">
          درباره توسعه نرم‌افزار، تکنولوژی‌های وب و ساخت تجربه‌های دیجیتالی که
          متمایز هستند.
        </p>
      </div>

      <div className="my-10">
        <SearchBox />
      </div>

      <h3 className="text-2xl mx-20 my-10">لیست مقالات</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {blogs.map((blog: TBlog) => (
          <BlogCard key={blog.slug} blog={blog} />
        ))}
      </div>
    </div>
  );
}
