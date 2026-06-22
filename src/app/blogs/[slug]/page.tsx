import { getBlog } from "@/utils/api/blog/get-blog";
import { fetchPublishedBlogs } from "@/lib/data/blogs";
import ReadingProgress from "@/components/sections/blogs/ReadingProgress";
import ShareBlogButton from "@/components/sections/blogs/ShareBlogButton";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import {
  FaArrowRight,
  FaHashtag,
  FaRegClock,
  FaUser,
  FaListUl,
  FaEye,
  FaStar,
} from "react-icons/fa";
import { MdOutlineDateRange } from "react-icons/md";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import { generateToc } from "@/lib/generateToc";
import { Metadata } from "next";
import ViewCounter from "@/components/providers/ViewConuter";
import CommentsSection from "@/components/sections/blogs/comments";
import BlogLikeButton from "@/components/features/BlogLikeButton";
import { PiCoffeeFill } from "react-icons/pi";
import BlogViews from "@/components/sections/blogs/BlogViews";

const SITE_URL = "https://manialipour.ir";

function getAbsoluteUrl(url?: string | null) {
  if (!url) return undefined;

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  return `${SITE_URL}${url.startsWith("/") ? url : `/${url}`}`;
}

const RelatedBlogs = dynamic(
  () => import("@/components/sections/blogs/RelatedBlogs"),
  {
    ssr: true,
    loading: () => (
      <div className="h-48 animate-pulse rounded-2xl bg-white/5" />
    ),
  },
);

async function RelatedBlogsSection({ currentSlug }: { currentSlug: string }) {
  const allBlogs = await fetchPublishedBlogs({ limit: 6 });

  const related = allBlogs
    .filter((item) => item.slug !== currentSlug)
    .slice(0, 3);

  return <RelatedBlogs blogs={related} />;
}

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

  const canonicalUrl = `${SITE_URL}/blogs/${post.slug}`;
  const coverUrl = getAbsoluteUrl(post.cover);
  const keywords = post.tags?.map((tag: any) => tag.name).filter(Boolean);

  return {
    title: post.title,
    description: post.excerpt,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "article",
      url: canonicalUrl,
      title: post.title,
      description: post.excerpt,
      images: coverUrl
        ? [
            {
              url: coverUrl,
              alt: post.title,
            },
          ]
        : [],
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt || post.createdAt,
      authors: [post.author?.name ?? "مانی علی‌پور"],
      tags: keywords,
      locale: "fa_IR",
      siteName: "مانی علی‌پور",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: coverUrl ? [coverUrl] : [],
    },
  };
}

export const revalidate = 3600;
export const dynamicParams = true;

export default async function BlogPage({ params }: IBlogPage) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) notFound();

  const { toc, updatedHtml } = generateToc(blog.content);

  const canonicalUrl = `${SITE_URL}/blogs/${blog.slug}`;
  const coverUrl = getAbsoluteUrl(blog.cover);
  const authorName = blog.author?.name ?? "مانی علی‌پور";
  const keywords = blog.tags?.map((tag: any) => tag.name).filter(Boolean) ?? [];

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${canonicalUrl}#blogposting`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    url: canonicalUrl,
    headline: blog.title,
    name: blog.title,
    description: blog.excerpt,
    image: coverUrl ? [coverUrl] : undefined,
    datePublished: blog.createdAt,
    dateModified: blog.updatedAt || blog.createdAt,
    inLanguage: "fa-IR",
    isAccessibleForFree: true,
    author: {
      "@type": "Person",
      name: authorName,
      url: `${SITE_URL}/about`,
    },
    publisher: {
      "@type": "Person",
      name: "مانی علی‌پور",
      url: SITE_URL,
    },
    keywords: keywords.length > 0 ? keywords.join(", ") : undefined,
    articleSection: keywords.length > 0 ? keywords : undefined,
    timeRequired: blog.readAt ? `PT${blog.readAt}M` : "PT5M",
  };

  const TocComponent = (
    <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-7 backdrop-blur-sm max-h-[calc(100vh-160px)] flex flex-col">
      <div className="flex items-center gap-3 mb-6 font-bold text-white shrink-0">
        <FaListUl className="text-xs text-cyan-500" />
        <h2 className="text-base">فهرست مطالب</h2>
      </div>

      <nav className="pl-2 overflow-y-auto custom-scrollbar">
        <ul className="space-y-4">
          {toc.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="group flex items-start gap-3 text-[13px] leading-relaxed text-slate-400 transition-all hover:text-cyan-400"
              >
                <span className="w-1 h-1 mt-2 transition-colors rounded-full shrink-0 bg-slate-700 group-hover:bg-cyan-500" />
                <span className="break-words">{item.text}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <ViewCounter blogId={blog._id} />
      <ReadingProgress />

      <main className="min-h-screen bg-[#0d1117] pb-20 selection:bg-cyan-500/30">
        {/* Navbar */}
        <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#0d1117]/80 py-4 backdrop-blur-xl">
          <div className="flex items-center justify-between px-6 mx-auto max-w-7xl">
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 text-sm font-medium transition-colors group text-slate-400 hover:text-white"
            >
              <FaArrowRight className="transition-transform group-hover:translate-x-1" />
              بازگشت به مقالات
            </Link>

            <div className="flex items-center gap-3">
              <BlogLikeButton id={blog._id} />
              <ShareBlogButton slug={slug} />
            </div>
          </div>
        </nav>

        <article className="px-6 pt-12 mx-auto max-w-7xl">
          {blog.cover && (
            <div className="relative mb-16 aspect-[21/9] w-full overflow-hidden rounded-[2.5rem] border border-white/5 shadow-2xl">
              <Image
                src={blog.cover}
                alt={blog.title}
                fill
                priority
                fetchPriority="high"
                sizes="(max-width: 1280px) calc(100vw - 48px), 1280px"
                quality={80}
                className="object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117]/60 to-transparent" />
            </div>
          )}

          <div className="grid grid-cols-1 gap-16 lg:grid-cols-12" dir="rtl">
            {/* Sidebar */}
            <aside className="hidden lg:block lg:col-span-3">
              <div className="space-y-10 lg:sticky lg:top-28">
                {toc.length > 0 && TocComponent}

                <div className="px-2">
                  <h3 className="flex items-center gap-2 mb-4 text-xs font-bold tracking-widest uppercase text-slate-500">
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

            {/* Content */}
            <div className="lg:col-span-9 lg:max-w-4xl">
              <header className="mb-12 text-right">
                <h1 className="mb-6 text-3xl font-black leading-snug text-transparent bg-linear-to-bl from-neon-green to-neon-blue bg-clip-text md:text-4xl lg:text-5xl">
                  {blog.title}
                </h1>

                {toc.length > 0 && (
                  <div className="mb-10 lg:hidden">{TocComponent}</div>
                )}

                {/* Metadata */}
                <div className="grid grid-cols-2 gap-3 text-sm text-slate-400 lg:flex lg:flex-wrap lg:items-center lg:gap-6">
                  <Link
                    href="/about"
                    className="flex items-center gap-2 px-3 py-3 border bg-white/2 rounded-2xl border-white/5 lg:border-0 lg:bg-transparent lg:p-0 lg:pl-6 lg:border-l lg:border-white/10"
                  >
                    <div className="relative w-8 h-8 overflow-hidden border rounded-full shrink-0 border-cyan-500/30">
                      <FaUser className="absolute inset-0 m-auto text-cyan-500" />
                    </div>
                    <span className="truncate text-slate-200">
                      {authorName}
                    </span>
                  </Link>

                  <div className="flex items-center gap-2 px-3 py-3 border rounded-2xl border-white/5 bg-white/2 lg:border-0 lg:bg-transparent lg:p-0 lg:pl-6 lg:border-l lg:border-white/10">
                    <MdOutlineDateRange className="text-slate-500" />
                    <span>
                      {blog.createdAt
                        ? new Date(blog.createdAt).toLocaleDateString("fa-IR")
                        : "—"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 px-3 py-3 border rounded-2xl border-white/5 bg-white/2 lg:border-0 lg:bg-transparent lg:p-0 lg:pl-6 lg:border-l lg:border-white/10">
                    <FaRegClock className="text-slate-500" />
                    <span>{blog.readAt || 5} دقیقه مطالعه</span>
                  </div>

                  <div className="flex items-center gap-2 px-3 py-3 border rounded-2xl border-white/5 bg-white/2 lg:border-0 lg:bg-transparent lg:p-0 lg:pl-6 lg:border-l lg:border-white/10">
                    <FaEye className="text-slate-500" />

                    <Suspense fallback={<span>— بازدید</span>}>
                      <BlogViews blogId={blog._id} />
                    </Suspense>
                  </div>
                </div>
              </header>

              <section
                className="prose blog-content prose-invert prose-cyan max-w-none"
                dangerouslySetInnerHTML={{ __html: updatedHtml }}
              />

              <div className="rounded-3xl border border-amber-400/20 bg-gradient-to-br from-slate-900/95 via-amber-950/25 to-orange-950/30 p-8 text-center shadow-[0_18px_55px_rgba(0,0,0,0.28)] sm:p-10">
                <h3 className="flex flex-col items-center justify-center gap-3 mb-4 text-xl font-black text-amber-300 drop-shadow sm:flex-row sm:text-2xl">
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

          <footer className="pt-20 border-t mt-28 border-white/5">
            <Suspense
              fallback={
                <div className="h-48 animate-pulse rounded-2xl bg-white/5" />
              }
            >
              <RelatedBlogsSection currentSlug={slug} />
            </Suspense>
          </footer>
        </article>
      </main>
    </>
  );
}
