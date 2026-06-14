import { getBlog } from "@/utils/api/blog/get-blog";
import { fetchPublishedBlogs } from "@/lib/data/blogs";
import ReadingProgress from "@/components/sections/blogs/ReadingProgress";
import RelatedBlogs from "@/components/sections/blogs/RelatedBlogs";
import ShareBlogButton from "@/components/sections/blogs/ShareBlogButton";
import Link from "next/link";
import Image from "next/image";
import {
  FaArrowRight,
  FaHashtag,
  FaRegClock,
  FaUser,
  FaRegEye,
  FaStar,
} from "react-icons/fa";
import { MdOutlineDateRange } from "react-icons/md";
import { notFound } from "next/navigation";
import { getView, setView } from "@/utils/api/blog/set-view";
import { PiCoffeeFill } from "react-icons/pi";

interface IBlogPage {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: IBlogPage) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) {
    return {
      title: "مقاله یافت نشد",
      description: "مقاله موردنظر پیدا نشد.",
    };
  }

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

  await setView(blog._id);
  const views = await getView(blog._id);

  const allBlogs = await fetchPublishedBlogs({ limit: 6 });
  const related = allBlogs.filter((item) => item.slug !== slug).slice(0, 3);

  return (
    <>
      <ReadingProgress />

      <main className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.10),transparent_32rem),linear-gradient(135deg,#0d1117,#111b2a_45%,#172236)] pb-20 selection:bg-cyan-500/30 md:pb-28">
        {/* Sticky Top Bar */}
        <nav className="sticky top-0 z-40 border-b border-cyan-800/35 bg-[#07111d]/75 px-0 py-2.5 shadow-sm backdrop-blur-md md:py-3">
          <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 sm:px-5 lg:px-6">
            <Link
              href="/blogs"
              className="group inline-flex min-h-10 items-center gap-2 rounded-xl border border-cyan-700/25 bg-cyan-950/20 px-3 py-2 text-sm font-bold text-cyan-300 transition-all duration-200 hover:border-cyan-400/40 hover:bg-cyan-900/30 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50 sm:text-base"
              aria-label="بازگشت به وبلاگ"
            >
              <FaArrowRight className="text-base transition-transform group-hover:-translate-x-1 sm:text-lg" />
              <span className="hidden xs:inline">بازگشت به وبلاگ</span>
              <span className="xs:hidden">بازگشت</span>
            </Link>

            <ShareBlogButton slug={slug} />
          </div>
        </nav>

        <article className="mx-auto mt-7 w-full max-w-5xl px-4 pb-4 sm:px-5 md:mt-10 lg:px-6">
          <div className="mx-auto w-full max-w-4xl">
            {/* Blog Cover */}
            {blog.cover && (
              <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-2xl border border-cyan-700/25 bg-cyan-950/20 shadow-[0_18px_60px_rgba(0,0,0,0.35)] sm:rounded-3xl md:mb-10 md:aspect-[21/9]">
                <Image
                  unoptimized
                  src={blog.cover}
                  alt={blog.title}
                  fill
                  priority
                  className="object-cover object-center transition-transform duration-700 hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 896px"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#08111f]/90 via-[#08111f]/15 to-transparent" />
              </div>
            )}

            {/* Blog Title & Meta */}
            <header
              className="mb-8 flex w-full flex-col gap-4 md:mb-10"
              dir="rtl"
            >
              <h1 className="w-full break-words text-right text-3xl font-black leading-[1.55] text-transparent bg-linear-to-br from-neon-green to-neon-blue bg-clip-text sm:text-4xl sm:leading-[1.45] md:text-5xl md:leading-[1.35]">
                {blog.title}
              </h1>

              <div className="flex flex-wrap items-center justify-start gap-2.5 text-sm font-medium text-cyan-100/90 sm:gap-3">
                {/* Author */}
                <span className="inline-flex min-h-9 items-center gap-2 rounded-xl border border-cyan-700/35 bg-cyan-950/35 px-3 py-1.5">
                  <FaUser className="text-base text-cyan-400" />
                  <span dir="ltr">{blog.author?.name ?? "مانی علی‌پور"}</span>
                </span>

                {/* Date */}
                <span className="inline-flex min-h-9 items-center gap-2 rounded-xl border border-cyan-700/35 bg-cyan-950/35 px-3 py-1.5">
                  <MdOutlineDateRange className="text-lg text-emerald-400" />
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

                <span className="inline-flex min-h-9 items-center gap-2 rounded-xl border border-cyan-700/35 bg-cyan-950/35 px-3 py-1.5 text-cyan-300">
                  <FaRegEye className="text-base text-cyan-400" />
                  <span>{views?.toLocaleString("fa-IR") || 0} بازدید</span>
                </span>

                {/* Read Time */}
                {blog.readAt && (
                  <span className="inline-flex min-h-9 items-center gap-2 rounded-xl border border-amber-500/35 bg-amber-950/20 px-3 py-1.5 text-amber-300">
                    <FaRegClock className="text-base text-amber-400" />
                    <span>{blog.readAt} دقیقه مطالعه</span>
                  </span>
                )}
              </div>
            </header>

            {/* Blog Excerpt */}
            {blog.excerpt && (
              <blockquote className="relative mb-8 rounded-2xl border-r-4 border-neon-green/80 bg-gradient-to-l from-cyan-700/12 to-transparent px-5 py-5 text-base leading-9 text-slate-100 shadow-[0_14px_45px_rgba(0,0,0,0.22)] not-italic sm:px-7 sm:py-6 sm:text-lg md:mb-10 md:text-xl">
                <span className="pointer-events-none absolute -top-5 right-4 select-none text-6xl text-neon-green/10 sm:text-7xl">
                  “
                </span>
                <p className="relative m-0 text-justify">{blog.excerpt}</p>
              </blockquote>
            )}

            {/* Blog Tags */}
            {blog.tags && Array.isArray(blog.tags) && blog.tags.length > 0 && (
              <div className="mb-8 flex flex-wrap items-center gap-2 md:mb-10">
                <span className="ml-1 inline-flex items-center gap-1 text-sm font-bold text-cyan-300">
                  <FaHashtag className="text-lg text-neon-green" />
                  برچسب‌ها:
                </span>
                {blog.tags.map((t: any) => (
                  <Link
                    key={t._id}
                    href={`/blogs?tag=${t.slug}`}
                    className="rounded-xl border border-cyan-700/25 bg-cyan-900/25 px-3 py-1.5 text-xs font-semibold text-cyan-100/90 transition hover:border-neon-cyan/40 hover:bg-neon-cyan/15 hover:text-neon-cyan focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                  >
                    {t.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Blog Content */}
            <section
              className="blog-content max-w-none text-justify text-slate-100"
              dir="rtl"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            {/* Footer */}
            <footer className="relative mt-14 border-t border-cyan-800/30 pt-7 md:mt-16 md:pt-8">
              <div className="mb-10 flex flex-col justify-between gap-4 text-xs text-cyan-300/65 md:mb-12 md:flex-row md:items-center">
                <p className="flex flex-wrap items-center gap-2">
                  آخرین به‌روزرسانی:
                  <span className="text-cyan-100/90">
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
              </div>

              {/* Buy Me a Coffee Section */}
              <div className="rounded-3xl border border-amber-400/20 bg-gradient-to-br from-slate-900/95 via-amber-950/25 to-orange-950/30 p-8 text-center shadow-[0_18px_55px_rgba(0,0,0,0.28)] sm:p-10">
                <h3 className="flex flex-col items-center justify-center gap-3 mb-4 text-xl font-black text-amber-300 drop-shadow sm:flex-row sm:text-2xl">
                  {/* اضافه کردن flex-col در موبایل باعث میشه آیکون و متن زیر هم بیان و فضا بازتر بشه */}
                  <FaStar className="animate-bounce" />
                  <span>این مطلب برات مفید بود؟</span>
                </h3>

                <p className="mx-auto mb-8 max-w-2xl text-[15px] leading-[1.8] text-slate-300 px-2 sm:px-0 sm:text-base sm:leading-8">
                  با حمایتت بهم انرژی می‌دی که تولید محتوای تخصصی‌تر، رایگان و
                  باکیفیت‌تر رو ادامه بدم.
                </p>

                <a
                  href="https://coffeebede.ir/manialipour"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[52px] w-full items-center justify-center gap-3 rounded-xl bg-amber-400 px-6 py-3 text-[15px] font-black text-[#181818] shadow-xl shadow-amber-400/15 transition-all hover:scale-[1.03] hover:bg-amber-500 hover:text-black focus:outline-none focus:ring-2 focus:ring-amber-300 sm:w-auto sm:px-7 sm:text-base"
                >
                  <PiCoffeeFill className="text-xl" />
                  یه قهوه مهمونم کن
                </a>
              </div>
            </footer>
          </div>

          {/* Related Blogs */}
          <aside className="mx-auto mt-14 w-full max-w-5xl md:mt-16">
            <RelatedBlogs blogs={related} />
          </aside>
        </article>
      </main>
    </>
  );
}
