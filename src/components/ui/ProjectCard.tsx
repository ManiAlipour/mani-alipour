import Link from "next/link";
import { ProjectCardProps } from "../sections/home/Projects";
import Image from "next/image";

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="group relative flex flex-col items-stretch rounded-[1.5rem] border border-cyan-900/50 shadow-xl overflow-hidden bg-gradient-to-br from-[#18243c]/95 to-[#222f47]/95 hover:scale-[1.025] hover:-translate-y-2 transition-transform duration-300 hover:shadow-2xl cursor-pointer">
      <div className="relative overflow-hidden aspect-video w-full bg-cyan-950/40">
        {project.coverImage ? (
          <img
            src={project.coverImage}
            alt={project.title}
            loading="lazy"
            className="object-cover w-full h-full scale-105 group-hover:scale-110 transition-transform duration-500"
            style={{
              filter:
                project.status === "in-progress" ? "grayscale(30%)" : undefined,
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl text-cyan-200/80 bg-cyan-950/30">
            🚀
          </div>
        )}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
          <span
            className={`px-2 py-1 text-xs rounded-2xl font-bold shadow border
            ${
              project.status === "done"
                ? "bg-gradient-to-r from-green-500 to-blue-500 text-white border-green-300/30"
                : project.status === "in-progress"
                  ? "bg-gradient-to-r from-yellow-400 via-cyan-400 to-yellow-400 text-zinc-900 border-yellow-200/40"
                  : "bg-gradient-to-r from-slate-400 to-cyan-700 text-white border-cyan-400/20"
            }`}
          >
            {project.status === "done"
              ? "اتمام‌شده"
              : project.status === "in-progress"
                ? "در حال توسعه"
                : project.status === "planned"
                  ? "در برنامه"
                  : "آرشیو"}
          </span>
          {project.featured && (
            <span className="px-2 py-0.5 text-[11px] rounded-xl bg-indigo-600/80 text-white text-center border border-indigo-300/30 shadow">
              ویژه ⭐
            </span>
          )}
        </div>
        <div className="absolute bottom-2 left-2 flex gap-2 z-10">
          {project.gallery && project.gallery.length > 0 && (
            <div className="flex gap-1">
              {project.gallery.slice(0, 2).map((img: string, j: number) => (
                <Image
                  key={img}
                  src={img}
                  alt={`عکس ${j + 1} ${project.title}`}
                  className="w-8 h-8 rounded border border-cyan-500/25 object-cover shadow-md"
                  loading="lazy"
                  width={32}
                  height={32}
                />
              ))}
              {project.gallery.length > 2 && (
                <span className="bg-cyan-950/70 text-cyan-100 px-2 py-1 rounded text-xs flex items-center border border-cyan-900/50">
                  +{project.gallery.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
        <div className="absolute inset-0 w-full h-full bg-gradient-to-t from-[#22365b]/60 via-transparent to-transparent pointer-events-none" />
      </div>

      <div className="flex-1 flex flex-col justify-between px-6 py-5 gap-2">
        <div>
          <h3 className="text-cyan-200 text-2xl font-black mb-1 group-hover:text-cyan-300 transition">
            {project.title}
          </h3>
          {project.shortDescription && (
            <p className="text-cyan-300/90 text-base mb-1">
              {project.shortDescription}
            </p>
          )}
          <p className="text-cyan-100/90 text-xs md:text-sm mb-2 leading-6 line-clamp-3">
            {project.description}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 mb-2 justify-end">
          {project.techStack.map((tech: string) => (
            <span
              key={tech}
              className="bg-gradient-to-tr from-cyan-800/80 to-indigo-800/70 border border-cyan-500/25 px-3 py-0.5 rounded-lg text-cyan-100 font-semibold text-xs shadow shadow-cyan-950/15 hover:bg-cyan-700/90 hover:text-white transition"
            >
              {tech}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-cyan-400 font-medium">
            {project.updatedAt.toLocaleDateString("fa-IR", {
              year: "2-digit",
              month: "short",
              day: "numeric",
            })}
          </span>
          <div className="flex gap-2">
            {project.demoUrl && (
              <Link
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 bg-gradient-to-r from-cyan-400 to-indigo-500 px-3 py-1.5 rounded-xl text-white font-bold text-xs shadow hover:from-cyan-500 hover:to-indigo-400 hover:scale-105 transition-all duration-200"
              >
                پیش‌نمایش
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  className="inline ml-0.5"
                >
                  <path
                    stroke="currentColor"
                    strokeWidth="2"
                    d="M4.5 11.5 11 5m0 0H6.4m4.6 0v4.5"
                  />
                </svg>
              </Link>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 bg-gradient-to-r from-zinc-800 via-cyan-800 to-indigo-900 px-3 py-1.5 rounded-xl text-cyan-100 font-bold text-xs shadow hover:bg-zinc-800/80 hover:scale-105 hover:text-white transition-all duration-200"
              >
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  className="inline"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M8 1.6c-3.54 0-6.4 2.89-6.4 6.44 0 2.85 1.84 5.27 4.38 6.13.32.06.44-.14.44-.32v-1.14c-1.78.39-2.15-.77-2.15-.77-.28-.71-.69-.9-.69-.9-.57-.39.04-.38.04-.38.63.04.96.65.96.65.56.97 1.46.69 1.81.53.06-.41.22-.69.4-.85-1.42-.16-2.92-.72-2.92-3.2 0-.71.25-1.3.66-1.76-.06-.17-.28-.86.06-1.83 0 0 .54-.17 1.76.66a5.97 5.97 0 0 1 1.6-.22c.54 0 1.08.08 1.59.22 1.22-.83 1.76-.66 1.76-.66.35.97.13 1.66.07 1.83.41.46.66 1.05.66 1.76 0 2.48-1.5 3.04-2.93 3.2.23.19.43.57.43 1.16V14c0 .18.12.39.44.32A6.41 6.41 0 0 0 14.4 8.04C14.4 4.5 11.54 1.6 8 1.6Z"
                    clipRule="evenodd"
                  />
                </svg>
                گیت‌هاب
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-80 bg-gradient-to-br from-cyan-400/25 via-indigo-400/10 to-transparent z-10 rounded-[1.5rem]" />
    </div>
  );
}
