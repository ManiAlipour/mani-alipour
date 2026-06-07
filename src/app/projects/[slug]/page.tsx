import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  PROJECT_STATUS_LABELS,
  PROJECT_STATUS_STYLES,
} from "@/lib/project-status";
import { fetchProjectBySlug, fetchPublishedProjects } from "@/lib/data/projects";
import ProjectCard from "@/components/sections/projects/ProjectCard";
import { FaArrowRight } from "react-icons/fa";
import { FiExternalLink, FiGithub } from "react-icons/fi";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await fetchProjectBySlug(slug);

  if (!project) return { title: "پروژه یافت نشد" };

  return {
    title: project.title,
    description: project.shortDescription || project.description.slice(0, 160),
    openGraph: {
      title: project.title,
      description: project.shortDescription,
      images: project.coverImage ? [{ url: project.coverImage }] : [],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await fetchProjectBySlug(slug);

  if (!project) notFound();

  const allProjects = await fetchPublishedProjects({ limit: 6 });
  const related = allProjects
    .filter((item) => item.slug !== slug)
    .slice(0, 3);

  const isHtml = /<[a-z][\s\S]*>/i.test(project.description);

  return (
    <main className="min-h-screen bg-[#0b1220] pb-24">
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#0f172a]/75 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/projects"
            className="group flex items-center gap-2 font-medium text-cyan-400 transition-colors hover:text-cyan-300"
          >
            <FaArrowRight className="transition-transform group-hover:-translate-x-1" />
            بازگشت به پروژه‌ها
          </Link>
          <div className="flex items-center gap-2">
            {project.demoUrl ? (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-400/30 bg-cyan-500/15 px-3 py-2 text-xs font-bold text-cyan-100 transition hover:bg-cyan-500/25 sm:text-sm"
              >
                <FiExternalLink />
                مشاهده دمو
              </a>
            ) : null}
            {project.githubUrl ? (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-cyan-200 transition hover:bg-white/10 sm:text-sm"
              >
                <FiGithub />
                گیت‌هاب
              </a>
            ) : null}
          </div>
        </div>
      </nav>

      <article className="mx-auto max-w-5xl px-4 pt-10 sm:px-6 lg:px-8">
        <header className="mb-10">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span
              className={`rounded-full border bg-gradient-to-r px-4 py-1.5 text-sm font-bold ${PROJECT_STATUS_STYLES[project.status]}`}
            >
              {PROJECT_STATUS_LABELS[project.status]}
            </span>
            {project.featured ? (
              <span className="rounded-full border border-indigo-400/30 bg-indigo-500/20 px-4 py-1.5 text-sm font-bold text-indigo-100">
                ⭐ پروژه ویژه
              </span>
            ) : null}
            <span className="text-sm text-cyan-200/60">
              {new Date(project.updatedAt).toLocaleDateString("fa-IR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>

          <h1 className="mb-4 bg-gradient-to-l from-white via-cyan-100 to-slate-300 bg-clip-text text-4xl font-black leading-tight text-transparent md:text-5xl">
            {project.title}
          </h1>

          {project.shortDescription ? (
            <p className="max-w-3xl text-lg leading-8 text-cyan-100/75">
              {project.shortDescription}
            </p>
          ) : null}

          {project.techStack?.length ? (
            <div className="mt-6 flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-xl border border-cyan-500/20 bg-cyan-900/30 px-3 py-1.5 text-sm font-medium text-cyan-100"
                >
                  {tech}
                </span>
              ))}
            </div>
          ) : null}
        </header>

        {project.coverImage ? (
          <div className="group relative mb-10 aspect-[21/9] overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl">
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              priority
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 1024px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/60 via-transparent to-transparent" />
          </div>
        ) : null}

        <section className="rounded-3xl border border-white/10 bg-[#111b2e]/60 p-6 sm:p-8">
          <h2 className="mb-5 text-2xl font-black text-cyan-50">درباره پروژه</h2>
          {isHtml ? (
            <div
              className="prose prose-invert max-w-none leading-8 text-slate-300 prose-a:text-cyan-400"
              dir="rtl"
              dangerouslySetInnerHTML={{ __html: project.description }}
            />
          ) : (
            <p className="whitespace-pre-line text-base leading-8 text-slate-300">
              {project.description}
            </p>
          )}
        </section>

        {project.gallery?.length ? (
          <section className="mt-10">
            <h2 className="mb-5 text-2xl font-black text-cyan-50">گالری تصاویر</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {project.gallery.map((image, index) => (
                <div
                  key={image}
                  className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-slate-900/50"
                >
                  <Image
                    src={image}
                    alt={`${project.title} - تصویر ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-12 rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-indigo-500/10 p-8 text-center">
          <h3 className="text-2xl font-bold text-cyan-100">
            پروژه‌ای شبیه این می‌خوای؟
          </h3>
          <p className="mt-2 text-slate-400">
            برای همکاری، مشاوره فنی یا سفارش پروژه با من در تماس باش.
          </p>
          <Link
            href="/#contact"
            className="mt-6 inline-flex rounded-2xl border border-cyan-400/30 bg-cyan-500/20 px-8 py-3 font-bold text-cyan-50 transition hover:bg-cyan-500/30"
          >
            شروع گفتگو
          </Link>
        </section>

        {related.length ? (
          <section className="mt-16 border-t border-white/10 pt-12">
            <h2 className="mb-8 text-2xl font-black text-cyan-50">
              پروژه‌های مرتبط
            </h2>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {related.map((item) => (
                <ProjectCard key={item._id} project={item} />
              ))}
            </div>
          </section>
        ) : null}
      </article>
    </main>
  );
}
