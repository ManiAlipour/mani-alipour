import { Suspense } from "react";
import Link from "next/link";
import BlogNotFound from "@/components/sections/blogs/BlogNotFound";
import SearchBox from "@/components/sections/blogs/SearchBox";
import TagsSecton from "@/components/sections/blogs/TagsSecton";
import BlogCard from "@/components/ui/BlogCard";
import { getBlogs } from "@/utils/api/blog/get-blogs";
import { getTags } from "@/utils/api/get-tags";
import { LuBookText, LuFileText, LuTags, LuSparkles } from "react-icons/lu";

export type PageProps = {
  searchParams: Promise<{
    search?: string;
    tag?: string;
  }>;
};

export default async function BlogsPage({ searchParams }: PageProps) {
  const { search = "", tag = "" } = await searchParams;

  const blogs = await getBlogs(search, tag);
  const tags = await getTags();

  const hasFilters = Boolean(search || tag);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b1220] pb-24">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-indigo-500/15 via-cyan-500/10 to-emerald-500/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl"
      />

      <section className="relative mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-400/25 bg-indigo-500/10 px-4 py-1.5 text-sm font-bold text-indigo-200">
              <LuBookText />
              وبلاگ
            </div>

            <h1 className="text-4xl font-black leading-tight text-white sm:text-5xl">
              نوشته‌هایی درباره
              <span className="block bg-gradient-to-l from-indigo-300 via-cyan-200 to-emerald-300 bg-clip-text text-transparent">
                توسعه وب و تجربه دیجیتال
              </span>
            </h1>

            <p className="mt-4 text-base leading-8 text-cyan-100/70 sm:text-lg">
              درباره توسعه نرم‌افزار، تکنولوژی‌های وب، معماری فرانت‌اند، نکات
              کاربردی برنامه‌نویسی و ساخت تجربه‌های دیجیتالی متمایز.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 backdrop-blur-md">
              <p className="text-2xl font-black text-cyan-300 sm:text-3xl">
                {blogs.length}
              </p>
              <p className="text-xs text-cyan-200/60">مقاله</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 backdrop-blur-md">
              <p className="text-2xl font-black text-emerald-300 sm:text-3xl">
                {tags.length}
              </p>
              <p className="text-xs text-cyan-200/60">تگ</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 backdrop-blur-md">
              <p className="text-2xl font-black text-amber-300 sm:text-3xl">
                {hasFilters ? "فعال" : "همه"}
              </p>
              <p className="text-xs text-cyan-200/60">فیلتر</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-cyan-500/15 bg-[#111b2e]/80 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-6">
          <div className="grid gap-6">
            <Suspense
              fallback={
                <div className="h-14 animate-pulse rounded-2xl bg-white/5" />
              }
            >
              <SearchBox />
            </Suspense>

            <div className="border-t border-white/10 pt-5">
              <TagsSecton tags={tags} />
            </div>
          </div>
        </div>

        <div className="mt-12">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm font-bold text-indigo-300">
                <LuSparkles />
                {hasFilters ? "نتایج فیلتر شده" : "آخرین نوشته‌ها"}
              </div>

              <h2 className="text-2xl font-black text-cyan-50">
                {hasFilters ? "نتایج جستجو" : "همه مقالات"}
              </h2>
            </div>

            {hasFilters ? (
              <Link
                href="/blogs"
                className="text-sm font-medium text-cyan-400 transition hover:text-cyan-300"
              >
                مشاهده همه
              </Link>
            ) : null}
          </div>

          {blogs.length ? (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {blogs.map((blog: TBlog) => (
                <BlogCard key={blog.slug} blog={blog} />
              ))}
            </div>
          ) : (
            <BlogNotFound />
          )}
        </div>
      </section>
    </div>
  );
}
