interface BlogCardProps {
  blog: any;
}

export default function BlogCard({ blog }: BlogCardProps) {
  return (
    <div
      key={blog.slug}
      className="group flex flex-col rounded-[1.5rem] border border-cyan-900/50 shadow-xl overflow-hidden bg-gradient-to-br from-[#18243c]/90 to-[#222f47]/90 hover:scale-[1.025] hover:-translate-y-2 transition-transform duration-300 hover:shadow-2xl cursor-pointer"
    >
      <div className="relative overflow-hidden aspect-video w-full bg-cyan-950/40">
        {blog.coverImage ? (
          <img
            src={blog.coverImage}
            alt={blog.title}
            loading="lazy"
            className="object-cover w-full h-full scale-105 group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl text-cyan-200/80 bg-cyan-950/30">
            📚
          </div>
        )}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-t from-[#22365b]/60 via-transparent to-transparent pointer-events-none" />
      </div>
      <div className="flex-1 flex flex-col justify-between px-6 py-5 gap-2">
        <div>
          <h3 className="text-cyan-200 text-2xl font-black mb-1 group-hover:text-cyan-300 transition">
            {blog.title}
          </h3>
          {blog.shortDescription && (
            <p className="text-cyan-300/90 text-base mb-1">
              {blog.shortDescription}
            </p>
          )}
          <p className="text-cyan-100/90 text-xs md:text-sm mb-2 leading-6 line-clamp-3">
            {blog.description}
          </p>
        </div>
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-cyan-400 font-medium">
            {blog.publishedAt
              ? new Date(blog.publishedAt).toLocaleDateString("fa-IR", {
                  year: "2-digit",
                  month: "short",
                  day: "numeric",
                })
              : ""}
          </span>
          {blog.url && (
            <a
              href={blog.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 bg-gradient-to-r from-cyan-400 to-indigo-500 px-3 py-1.5 rounded-xl text-white font-bold text-xs shadow hover:from-cyan-500 hover:to-indigo-400 hover:scale-105 transition-all duration-200"
            >
              مطالعه
              <svg width="16" height="16" fill="none" className="inline ml-0.5">
                <path
                  stroke="currentColor"
                  strokeWidth="2"
                  d="M4.5 11.5 11 5m0 0H6.4m4.6 0v4.5"
                />
              </svg>
            </a>
          )}
        </div>
      </div>
      <div className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-80 bg-gradient-to-br from-cyan-400/25 via-indigo-400/10 to-transparent z-10 rounded-[1.5rem]" />
    </div>
  );
}
