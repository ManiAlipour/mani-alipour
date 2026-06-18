"use client";

import Image from "next/image";
import Link from "next/link";
import {
  PROJECT_STATUS_LABELS,
  PROJECT_STATUS_STYLES,
} from "@/lib/project-status";
import { FiExternalLink, FiGithub } from "react-icons/fi";

interface ProjectCardProps {
  project: TProject;
  featured?: boolean;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function ProjectCard({
  project,
  featured = false,
}: ProjectCardProps) {
  const description =
    project.shortDescription ||
    project.description.replace(/<[^>]+>/g, "").slice(0, 160);

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-3xl border border-cyan-500/15 bg-gradient-to-br from-[#121c2e]/95 via-[#172338]/95 to-[#1a2740]/95 shadow-xl transition-all duration-500 hover:-translate-y-1.5 hover:border-cyan-400/35 hover:shadow-2xl hover:shadow-cyan-900/30 ${
        featured ? "lg:col-span-2 lg:flex-row" : ""
      }`}
    >
      <Link
        href={`/projects/${project.slug}`}
        className={`relative block overflow-hidden bg-cyan-950/40 ${
          featured
            ? "lg:w-[52%] aspect-[16/10] lg:aspect-auto lg:min-h-[300px]"
            : "aspect-[16/10]"
        }`}
      >
        {project.coverImage ? (
          <Image
            src={project.coverImage}
            alt={project.title}
            title={`تصویر پروژه: ${project.title}`}
            fill
            sizes={
              featured
                ? "(max-width: 1024px) 100vw, 50vw"
                : "(max-width: 768px) 100vw, 33vw"
            }
            className={`object-cover transition-transform duration-700 group-hover:scale-110 ${
              project.status === "in-progress" ? "grayscale-[20%]" : ""
            }`}
          />
        ) : (
          <div className="flex h-full min-h-[180px] items-center justify-center bg-gradient-to-br from-cyan-950/60 to-indigo-950/60 text-6xl">
            🚀
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/85 via-[#0f172a]/15 to-transparent" />

        <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
          <span
            className={`rounded-full border bg-gradient-to-r px-3 py-1 text-xs font-bold shadow-lg ${PROJECT_STATUS_STYLES[project.status]}`}
          >
            {PROJECT_STATUS_LABELS[project.status]}
          </span>
          {project.featured ? (
            <span className="rounded-full border border-indigo-400/30 bg-indigo-500/25 px-3 py-1 text-xs font-bold text-indigo-100 backdrop-blur-md">
              ⭐ پروژه ویژه
            </span>
          ) : null}
        </div>
      </Link>

      <div
        className={`flex flex-1 flex-col gap-4 p-6 ${featured ? "lg:justify-center" : ""}`}
      >
        <div className="flex items-center justify-between gap-3 text-xs text-cyan-300/70">
          <span className="rounded-full border border-white/5 bg-white/5 px-2.5 py-1">
            {formatDate(project.updatedAt)}
          </span>
          {project.gallery?.length ? (
            <span className="rounded-full border border-white/5 bg-white/5 px-2.5 py-1">
              {project.gallery.length} تصویر
            </span>
          ) : null}
        </div>

        <div>
          <Link href={`/projects/${project.slug}`}>
            <h3
              className={`font-black leading-snug text-cyan-50 transition-colors hover:text-cyan-300 ${
                featured ? "text-2xl lg:text-3xl" : "text-xl"
              }`}
            >
              {project.title}
            </h3>
          </Link>
          <p
            className={`mt-2 text-cyan-100/75 leading-relaxed ${
              featured ? "line-clamp-4 text-base" : "line-clamp-3 text-sm"
            }`}
          >
            {description}
            {description.length >= 160 ? "..." : ""}
          </p>
        </div>

        {project.techStack?.length ? (
          <div className="flex flex-wrap gap-2">
            {project.techStack.slice(0, featured ? 6 : 4).map((tech) => (
              <span
                key={tech}
                className="rounded-lg border border-cyan-500/20 bg-cyan-900/30 px-2.5 py-0.5 text-xs font-medium text-cyan-200/90"
              >
                {tech}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-auto flex flex-wrap items-center gap-2">
          <Link
            href={`/projects/${project.slug}`}
            className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-500/15 px-4 py-2 text-sm font-bold text-cyan-100 transition hover:bg-cyan-500/25"
          >
            جزئیات پروژه
            <span className="transition-transform group-hover:-translate-x-1">
              ←
            </span>
          </Link>
          {project.demoUrl ? (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-cyan-200 transition hover:bg-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <FiExternalLink />
              دمو
            </a>
          ) : null}
          {project.githubUrl ? (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-cyan-200 transition hover:bg-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <FiGithub />
              گیت‌هاب
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
