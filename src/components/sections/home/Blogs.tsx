import BlogCard from "@/components/ui/BlogCard";
import React from "react";

const blogs: any[] = [];

function BlogsNotFound() {
  return (
    <div className="w-full flex flex-col items-center justify-center text-center py-20 px-6">
      <div className="relative flex flex-col items-center">
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-48 h-48 bg-gradient-to-tr from-cyan-500/10 via-indigo-500/15 to-indigo-700/10 blur-2xl rounded-full z-0 pointer-events-none"></div>
        <span className="text-[5rem] z-10 mb-3 select-none">✍️</span>
      </div>
      <h2 className="text-2xl md:text-3xl font-black text-cyan-100/90 mb-2 drop-shadow-lg">
        وبلاگی هنوز نوشته نشده!
      </h2>
      <p className="text-cyan-200/70 text-base md:text-lg mb-3">
        به زودی نوشته‌ها و مقالات جدید اینجا قرار خواهند گرفت.
      </p>
      <div className="flex items-center justify-center gap-2 mb-4">
        <span className="text-cyan-400 text-lg md:text-xl animate-pulse">
          ⏳
        </span>
        <span className="text-cyan-300/80 font-medium text-sm">
          منتظر مطالب جذاب باشید!
        </span>
      </div>
    </div>
  );
}

export default function Blogs() {
  return (
    <section
      id="blogs"
      className="relative w-full py-24 px-2 md:px-0 bg-gradient-to-br from-[#111c2e] via-[#173058] to-[#254062] overflow-x-clip rounded-[2.5rem] shadow-2xl border-t border-cyan-800/40 mt-20"
    >
      <div
        aria-hidden
        className="absolute -top-36 left-1/2 -translate-x-1/2 w-[100vw] max-w-7xl h-48 bg-gradient-to-tr from-cyan-400/10 via-indigo-500/15 to-indigo-700/10 blur-3xl rounded-[2.5rem] z-0 pointer-events-none"
      />
      <div className="relative flex flex-col items-center gap-3 max-w-3xl mx-auto mb-14 z-10">
        <div className="flex items-center gap-2">
          <span className="text-4xl md:text-5xl animate-wiggle">📝</span>
          <span className="text-transparent bg-gradient-to-l from-cyan-400 via-indigo-200 to-cyan-500 bg-clip-text font-black text-3xl md:text-4xl leading-tight drop-shadow-lg">
            جدیدترین نوشته‌ها
          </span>
        </div>
        <div className="flex flex-row-reverse items-center gap-2">
          <span className="bg-gradient-to-tr from-cyan-700 via-indigo-600 to-cyan-400 py-1 px-4 rounded-lg text-cyan-50 border border-cyan-400/30 shadow-sm text-sm font-bold tracking-wider select-none">
            Blog Posts
          </span>
          <span className="hidden sm:inline-block w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-400 via-cyan-400 to-indigo-400 animate-pulse opacity-70" />
        </div>
        <div className="text-center text-cyan-200/80 text-base md:text-lg leading-relaxed mt-1">
          مجموعه‌ای از جدیدترین مطالب، آموزش‌ها و تحلیل‌ها درباره توسعه،
          تکنولوژی و نرم‌افزار
        </div>
      </div>
      {blogs.length === 0 ? (
        <BlogsNotFound />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {blogs.map((blog) => (
            <BlogCard key={blog.slug} blog={blog} />
          ))}
        </div>
      )}
    </section>
  );
}
