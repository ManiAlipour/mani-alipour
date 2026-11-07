import type { MetadataRoute } from "next";
import { fetchPublishedBlogs } from "@/lib/data/blogs";
import { fetchPublishedProjects } from "@/lib/data/projects";

const SITE_URL = "https://manialipour.ir";
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blogs, projects] = await Promise.all([
    fetchPublishedBlogs({ limit: 5000 }),
    fetchPublishedProjects({ limit: 5000 }),
  ]);

  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/blogs`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/projects`, changeFrequency: "weekly", priority: 0.9 },
    ...blogs.map((blog) => ({
      url: `${SITE_URL}/blogs/${blog.slug}`,
      lastModified: blog.updatedAt || blog.createdAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...projects.map((project) => ({
      url: `${SITE_URL}/projects/${project.slug}`,
      lastModified: project.updatedAt || project.createdAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
