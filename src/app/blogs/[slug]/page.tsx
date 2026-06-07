import { getBlog } from "@/utils/api/get-blog";
import { fetchPublishedBlogs } from "@/lib/data/blogs";
import ReadingProgress from "@/components/sections/blogs/ReadingProgress";
import RelatedBlogs from "@/components/sections/blogs/RelatedBlogs";
import ShareBlogButton from "@/components/sections/blogs/ShareBlogButton";
import Link from "next/link";
import Image from "next/image";
import { FaArrowRight, FaHashtag, FaRegClock, FaUser } from "react-icons/fa";
import { MdOutlineDateRange } from "react-icons/md";
import { notFound } from "next/navigation";

interface IBlogPage {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: IBlogPage) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) return { title: "مقاله یافت نشد" };

  return {
    title: blog.title,
    description: blog.excerpt,
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      images: blog.cover ? [{ url: blog.cover }] : [],
    },
  };
}

export default async function BlogPage({ params }: IBlogPage) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) notFound();

  const allBlogs = await fetchPublishedBlogs({ limit: 6 });
  const related = allBlogs.filter((item) => item.slug !== slug).slice(0, 3);

  return (
    <>
      <ReadingProgress />

      <main className="min-h-screen bg-gradient-to-br from-[#0d1117] via-[#111b2a] to-[#172236] pb-32 selection:bg-cyan-600/30">
        {/* Sticky Top Bar */}
        <nav className="sticky top-0 z-40 border-b border-cyan-800/40 bg-[#0b1622]/70 py-3 px-0 backdrop-blur-[4px] shadow-sm">
          <div className="mx-auto flex max-w-4xl items-center justify-between px-4">
            <Link
              href="/blogs"
              className="group flex items-center gap-2 text-cyan-400 hover:text-white font-bold text-base transition-all duration-200"
              aria-label="بازگشت به وبلاگ"
            >
              <FaArrowRight className="transition-transform group-hover:-translate-x-1 text-lg" />
              بازگشت به وبلاگ
            </Link>
            <ShareBlogButton slug={slug} />
          </div>
        </nav>
        <article className="mx-auto max-w-4xl mt-10 md:mt-14 px-4 md:px-8 pb-4 w-full">
          {/* Blog Cover */}
          {blog.cover && (
            <div className="relative overflow-hidden rounded-3xl border border-cyan-800/20 shadow-lg aspect-[21/9] mb-10 flex items-center justify-center bg-cyan-950/20">
              <Image
                src={blog.cover}
                alt={blog.title}
                fill
                priority
                className="object-cover object-center transition-transform duration-700 scale-100 hover:scale-105"
                sizes="(max-width: 896px) 100vw, 896px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121c2c]/85 via-transparent to-transparent pointer-events-none" />
            </div>
          )}

          {/* Blog Title */}
          <header className="mb-12 flex flex-col gap-4 w-full" dir="rtl">
            <h1 className="w-full text-right text-4xl md:text-5xl font-black text-transparent bg-linear-to-br from-neon-green to-neon-blue bg-clip-text break-words leading-tight">
              {blog.title}
            </h1>

            <div className="flex flex-wrap gap-x-6 gap-y-3 items-center justify-start text-cyan-200/90 font-medium text-sm">
              <span className="inline-flex items-center gap-2 rounded-lg border border-cyan-700/40 px-3 py-1.5 bg-cyan-900/40">
                <FaUser className="text-cyan-500 text-lg" />
                <span dir="ltr">{blog.author?.name ?? "مانی علی‌پور"}</span>
              </span>

              <span className="inline-flex items-center gap-2 rounded-lg border border-cyan-700/40 px-3 py-1.5 bg-cyan-900/40">
                <MdOutlineDateRange className="text-emerald-400 text-lg" />
                <span>
                  {new Date(blog.createdAt as string).toLocaleDateString(
                    "fa-IR",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    },
                  )}
                </span>
              </span>

              {blog.readAt && (
                <span className="inline-flex items-center gap-2 rounded-lg border border-amber-500/40 px-3 py-1.5 bg-yellow-900/10 text-amber-300">
                  <FaRegClock className="text-amber-400 text-lg" />
                  {blog.readAt} دقیقه مطالعه
                </span>
              )}
            </div>
          </header>

          {/* Blog Excerpt */}
          {blog.excerpt && (
            <blockquote className="relative mb-10 md:mb-14 px-7 py-6 border-r-4 border-neon-green/80 bg-gradient-to-l from-cyan-800/10 to-transparent text-xl leading-relaxed text-white/90 shadow-lg rounded-xl text-justify not-italic">
              <span className="absolute -top-6 right-4 text-7xl text-neon-green/10 select-none pointer-events-none">
                “
              </span>
              {blog.excerpt}
            </blockquote>
          )}

          {/* Blog Tags */}
          {blog.tags && Array.isArray(blog.tags) && blog.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-8 md:mb-12">
              <span className="flex items-center gap-1 text-cyan-300 text-sm font-bold ml-2">
                <FaHashtag className="text-neon-green text-lg" />
                برچسب‌ها:
              </span>
              {blog.tags.map((t: any) => (
                <Link
                  key={t._id}
                  href={`/blogs?tag=${t.slug}`}
                  className="rounded-xl border border-cyan-800/20 bg-cyan-800/20 px-3 py-1.5 text-xs font-semibold text-cyan-200 hover:bg-neon-cyan/20 hover:text-neon-cyan transition"
                >
                  {t.name}
                </Link>
              ))}
            </div>
          )}

          {/* Blog Content */}
          <section
            className="
              blog-content-custom
              prose prose-invert prose-lg
              max-w-none
              text-justify
              leading-9
              text-slate-100
              prose-blockquote:font-serif
              prose-blockquote:text-lg
              prose-blockquote:text-neon-green/90
              prose-blockquote:not-italic
              prose-h2:text-xl
              prose-h2:font-black
              prose-a:text-neon-blue
              prose-a:underline
              prose-a:font-mono
              hover:prose-a:text-neon-cyan
              prose-code:rounded
              prose-code:bg-slate-800/70
              prose-code:text-neon-orange
              prose-code:px-2
              prose-code:font-mono 
              prose-code:text-sm
              prose-img:rounded-2xl
              prose-img:shadow-xl
              prose-pre:rounded-lg
              prose-pre:bg-[#101926]
              prose-pre:border
              prose-pre:border-neon-cyan/20
              prose-li:marker:text-neon-cyan
              not-italic
            "
            dir="rtl"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Footer */}
          <footer className="mt-20 border-t border-cyan-800/30 pt-8 relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
              <p className="text-xs text-cyan-300/60 flex items-center gap-2">
                آخرین به‌روزرسانی:
                <span className="text-cyan-200">
                  {new Date(blog.updatedAt as string).toLocaleDateString(
                    "fa-IR",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  )}
                </span>
              </p>
              <span className="text-cyan-300/60 text-xs">
                &copy; {new Date().getFullYear()}{" "}
                <Link
                  href="/"
                  className="text-neon-cyan font-semibold hover:underline"
                  title="من ialipour.ir"
                >
                  manialipour.ir
                </Link>{" "}
                — تمامی حقوق محفوظ است.
              </span>
            </div>

            <div className="mt-12 rounded-3xl border border-amber-400/20 bg-gradient-to-br from-amber-500/10 to-orange-500/20 p-10 text-center shadow-xl flex flex-col items-center gap-2">
              <h3 className="mb-2 text-2xl font-bold text-neon-orange drop-shadow">
                این مطلب برات مفید بود؟
              </h3>
              <p className="mb-6 text-slate-300 text-base leading-relaxed not-italic">
                با حمایتت بهم انرژی می‌دی که تولید محتوای تخصصی‌تر، رایگان و
                باکیفیت‌تر رو ادامه بدم.
              </p>
              <a
                href="https://coffeebede.ir/manialipour"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 rounded-lg bg-amber-400 text-[#1a1a1a] font-bold text-base px-7 py-3 shadow-xl shadow-amber-400/20 transition-all hover:bg-amber-500 hover:text-black hover:scale-105 focus:ring focus:ring-amber-400 focus:outline-none"
              >
                ☕️ یه قهوه مهمونم کن
              </a>
            </div>
          </footer>

          {/* Related Blogs */}
          <aside className="mt-20">
            <RelatedBlogs blogs={related} />
          </aside>
        </article>
      </main>
    </>
  );
}
