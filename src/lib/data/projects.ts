import { connectDB } from "@/lib/mongodb";
import Project, { type ProjectStatus } from "@/models/Projects";

export async function fetchPublishedProjects({
  q = "",
  status = "",
  featured,
  limit = 50,
}: {
  q?: string;
  status?: string;
  featured?: boolean;
  limit?: number;
} = {}) {
  await connectDB();

  const filters: Record<string, unknown> = { isPublished: true };

  if (q.trim()) {
    filters.$or = [
      { title: { $regex: q, $options: "i" } },
      { shortDescription: { $regex: q, $options: "i" } },
      { description: { $regex: q, $options: "i" } },
      { techStack: { $elemMatch: { $regex: q, $options: "i" } } },
    ];
  }

  const validStatus: ProjectStatus[] = [
    "planned",
    "in-progress",
    "done",
    "archived",
  ];
  if (status && validStatus.includes(status as ProjectStatus)) {
    filters.status = status;
  }

  if (featured === true) {
    filters.featured = true;
  }

  return Project.find(filters)
    .sort({ featured: -1, order: 1, createdAt: -1 })
    .limit(limit)
    .lean() as Promise<TProject[]>;
}

export async function fetchProjectBySlug(slug: string) {
  await connectDB();
  return Project.findOne({ slug, isPublished: true }).lean() as Promise<TProject | null>;
}
