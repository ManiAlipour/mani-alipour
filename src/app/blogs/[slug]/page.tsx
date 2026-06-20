import { getBlog } from "@/utils/api/blog/get-blog";
import { fetchPublishedBlogs } from "@/lib/data/blogs";
import ReadingProgress from "@/components/sections/blogs/ReadingProgress";
import ShareBlogButton from "@/components/sections/blogs/ShareBlogButton";
import Link from "next/link";
import Image from "next/image";
import {
  FaArrowRight,
  FaHashtag,
  FaRegClock,
  FaUser,
  FaStar,
  FaListUl,
} from "react-icons/fa";
import { MdOutlineDateRange } from "react-icons/md";
import { notFound } from "next/navigation";
import { getView } from "@/utils/api/blog/set-view";
import { PiCoffeeFill } from "react-icons/pi";
import dynamic from "next/dynamic";
import { generateToc } from "@/lib/generateToc";
import { Metadata } from "next";
import ViewCounter from "@/components/providers/ViewConuter";
import CommentsSection from "@/components/sections/blogs/comments";

const RelatedBlogs = dynamic(
  () => import("@/components/sections/blogs/RelatedBlogs"),
  {
    ssr: true,
    loading: () => (
      <div className="h-48 animate-pulse rounded-2xl bg-white/5" />
    ),
  },
);

interface IBlogPage {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlog(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `https://manialipour.ir/blogs/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.cover || "" }],
    },
  };
}

export default async function BlogPage({ params }: IBlogPage) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) notFound();

  const [views, allBlogs] = await Promise.all([
    getView(blog._id),
    fetchPublishedBlogs({ limit: 6 }),
  ]);

  const related = allBlogs.filter((item) => item.slug !== slug).slice(0, 3);
  const { toc, updatedHtml } = generateToc(blog.content);

  return (
    <>
      <ViewCounter blogId={blog._id} />
      <ReadingProgress />

      <main className="min-h-screen bg-[#0d1117] pb-20 selection:bg-cyan-500/30">
        {/* Navbar */}
        <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#0d1117]/80 py-4 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
            <Link
              href="/blogs"
              className="group inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition-colors hover:text-white"
            >
              <FaArrowRight className="transition-transform group-hover:translate-x-1" />
              بازگشت به مقالات
            </Link>
            <ShareBlogButton slug={slug} />
          </div>
        </nav>

        <article className="mx-auto max-w-7xl px-6 pt-12">
          {blog.cover && (
            <div className="relative mb-16 aspect-[21/9] w-full overflow-hidden rounded-[2.5rem] border border-white/5 shadow-2xl">
              <Image
                src={blog.cover}
                alt={blog.title}
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117]/60 to-transparent" />
            </div>
          )}

          <div className="grid grid-cols-1 gap-16 lg:grid-cols-12" dir="rtl">
            <aside className="lg:col-span-3">
              <div className="lg:sticky lg:top-28 space-y-10">
                {toc.length > 0 && (
                  <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-7 backdrop-blur-sm">
                    <div className="mb-6 flex items-center gap-3 text-white font-bold">
                      <FaListUl className="text-cyan-500 text-xs" />
                      <h2 className="text-base">فهرست مطالب</h2>
                    </div>
                    <nav>
                      <ul className="space-y-4">
                        {toc.map((item) => (
                          <li key={item.id}>
                            <a
                              href={`#${item.id}`}
                              className="group flex items-start gap-3 text-[13px] leading-relaxed text-slate-400 transition-all hover:text-cyan-400"
                            >
                              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-700 transition-colors group-hover:bg-cyan-500" />
                              {item.text}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  </div>
                )}

                <div className="px-2">
                  <h3 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
                    <FaHashtag className="text-cyan-600" /> برچسب‌ها
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {blog.tags?.map((t: any) => (
                      <Link
                        key={t._id}
                        href={`/blogs?tag=${t.slug}`}
                        className="rounded-lg border border-white/5 bg-white/5 px-3 py-1.5 text-[11px] text-slate-300 transition-colors hover:bg-white/10 hover:text-cyan-400"
                      >
                        {t.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            <div className="lg:col-span-9 lg:max-w-4xl">
              <header className="mb-12 text-right">
                <h1
                  className="mb-6 text-3xl font-black leading-snug bg-linear-to-bl from-neon-green to-neon-blue bg-clip-text text-transparent
                 md:text-4xl lg:text-5xl"
                >
                  {blog.title}
                </h1>

                <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400">
                  <div className="flex items-center gap-2 border-l border-white/10 pl-6">
                    <div className="relative h-8 w-8 overflow-hidden rounded-full border border-cyan-500/30">
                      <FaUser className="absolute inset-0 m-auto text-cyan-500" />
                    </div>
                    <span className="text-slate-200">
                      {blog.author?.name ?? "مانی علی‌پور"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 border-l border-white/10 pl-6">
                    <MdOutlineDateRange className="text-slate-500" />
                    {blog.createdAt
                      ? new Date(blog.createdAt).toLocaleDateString("fa-IR")
                      : "—"}
                  </div>
                  <div className="flex items-center gap-2">
                    <FaRegClock className="text-slate-500" />
                    {blog.readAt || 5} دقیقه مطالعه
                  </div>
                </div>
              </header>

              <section
                className="blog-content prose prose-invert prose-cyan max-w-none 
                prose-h2:mb-8 prose-h2:mt-16 prose-h2:scroll-mt-32 prose-h2:text-3xl prose-h2:font-black prose-h2:text-white
                prose-p:mb-8 prose-p:text-lg prose-p:leading-[2.4rem] prose-p:text-slate-300
                prose-strong:text-white prose-strong:font-bold
                prose-code:rounded-lg prose-code:bg-cyan-500/10 prose-code:px-2 prose-code:py-0.5 prose-code:text-cyan-400
                prose-pre:rounded-3xl prose-pre:border prose-pre:border-white/5 prose-pre:bg-[#080c14]
                prose-img:rounded-[2rem] prose-img:border prose-img:border-white/10"
                dangerouslySetInnerHTML={{ __html: updatedHtml }}
              />

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

              <div className="mt-24">
                <CommentsSection postId={blog._id} slug={blog.slug} />
              </div>
            </div>
          </div>

          <footer className="mt-28 border-t border-white/5 pt-20">
            <RelatedBlogs blogs={related} />
          </footer>
        </article>
      </main>
    </>
  );
}
