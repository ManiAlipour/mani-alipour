import { fetchBlogBySlug } from "@/lib/data/blogs";
import { apiFetch } from "..";

export const getBlog = async (slug: string) => {
  try {
    const res = await apiFetch(`/blogs/${slug}`, {
      next: { revalidate: 3600, tags: [`blog:${slug}`, "blogs"] },
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
