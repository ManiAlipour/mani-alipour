import { fetchBlogBySlug } from "@/lib/data/blogs";

export const getBlog = async (slug: string) => {
  try {
    return await fetchBlogBySlug(slug);
  } catch (error) {
    console.error(error);
    return null;
  }
};
