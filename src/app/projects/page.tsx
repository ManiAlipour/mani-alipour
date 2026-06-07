import { Suspense } from "react";
import Link from "next/link";
import ProjectCard from "@/components/sections/projects/ProjectCard";
import ProjectFilters from "@/components/sections/projects/ProjectFilters";
import ProjectsEmpty from "@/components/sections/projects/ProjectsEmpty";
import { fetchPublishedProjects } from "@/lib/data/projects";
import { LuLayers, LuRocket } from "react-icons/lu";

export type PageProps = {
  searchParams: Promise<{
    q?: string;
    status?: string;
  }>;
};

export default async function ProjectsPage({ searchParams }: PageProps) {
  const { q = "", status = "" } = await searchParams;
  const projects = await fetchPublishedProjects({ q, status, limit: 100 });

  const hasFilters = Boolean(q || status);
  const featured =
    !hasFilters && projects.length
      ? projects.find((p) => p.featured) ?? projects[0]
      : null;
  const rest = featured
    ? projects.filter((p) => p._id !== featured._id)
    : projects;

  const doneCount = projects.filter((p) => p.status === "done").length;
  const inProgressCount = projects.filter(
    (p) => p.status === "in-progress",
  ).length;

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
              <LuLayers />
              نمونه‌کارها
            </div>
            <h1 className="text-4xl font-black leading-tight text-white sm:text-5xl">
              پروژه‌هایی که
              <span className="block bg-gradient-to-l from-indigo-300 via-cyan-200 to-emerald-300 bg-clip-text text-transparent">
                ایده را به محصول تبدیل کردند
              </span>
            </h1>
            <p className="mt-4 text-base leading-8 text-cyan-100/70 sm:text-lg">
              مجموعه‌ای از پروژه‌های واقعی با تمرکز بر معماری تمیز، UI مدرن و
              تجربه کاربری روان — از ایده تا اجرا.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 backdrop-blur-md">
              <p className="text-2xl font-black text-cyan-300 sm:text-3xl">
                {projects.length}
              </p>
              <p className="text-xs text-cyan-200/60">پروژه</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 backdrop-blur-md">
              <p className="text-2xl font-black text-emerald-300 sm:text-3xl">
                {doneCount}
              </p>
              <p className="text-xs text-cyan-200/60">تکمیل‌شده</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 backdrop-blur-md">
              <p className="text-2xl font-black text-amber-300 sm:text-3xl">
                {inProgressCount}
              </p>
              <p className="text-xs text-cyan-200/60">در حال توسعه</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-cyan-500/15 bg-[#111b2e]/80 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-6">
          <Suspense
            fallback={<div className="h-24 animate-pulse rounded-2xl bg-white/5" />}
          >
            <ProjectFilters />
          </Suspense>
        </div>

        {featured ? (
          <div className="mt-10">
            <div className="mb-4 flex items-center gap-2 text-sm font-bold text-indigo-300">
              <LuRocket />
              پروژه شاخص
            </div>
            <div className="grid grid-cols-1 gap-6">
              <ProjectCard project={featured} featured />
            </div>
          </div>
        ) : null}

        <div className="mt-12">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="text-2xl font-black text-cyan-50">
              {hasFilters ? "نتایج جستجو" : "همه پروژه‌ها"}
            </h2>
            {hasFilters ? (
              <Link
                href="/projects"
                className="text-sm font-medium text-cyan-400 transition hover:text-cyan-300"
              >
                مشاهده همه
              </Link>
            ) : null}
          </div>

          {rest.length ? (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {rest.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          ) : !featured ? (
            <ProjectsEmpty />
          ) : null}
        </div>
      </section>
    </div>
  );
}
