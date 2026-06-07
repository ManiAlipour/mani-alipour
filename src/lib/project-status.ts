export const PROJECT_STATUS_LABELS: Record<TProjectStatus, string> = {
  planned: "در برنامه",
  "in-progress": "در حال توسعه",
  done: "تکمیل‌شده",
  archived: "آرشیو",
};

export const PROJECT_STATUS_STYLES: Record<TProjectStatus, string> = {
  done: "from-emerald-500/90 to-cyan-500/90 text-white border-emerald-400/30",
  "in-progress":
    "from-amber-400/90 to-orange-500/90 text-zinc-900 border-amber-300/40",
  planned: "from-slate-500/90 to-cyan-700/90 text-white border-cyan-400/20",
  archived: "from-zinc-600/90 to-slate-700/90 text-slate-200 border-slate-500/30",
};
