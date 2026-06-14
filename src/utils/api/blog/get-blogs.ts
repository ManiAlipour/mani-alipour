import { apiFetch } from "..";

export const getBlogs = async (
  search?: string,
  tag?: string,
  limit: number = 10,
) => {
  try {
    const params = new URLSearchParams();

    if (search) params.append("search", search);
    if (tag) params.append("tag", tag);
    params.append("limit", limit.toString());

    const url = `/blogs?${params.toString()}`;
    console.log("BLOG URL:", url);

    const response = await apiFetch(`/blogs?${params.toString()}`);

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};
