import { apiFetch } from ".";

export const getBlogs = async (search?: string, tag?: string) => {
  try {
    const response = await apiFetch(
      `/blogs?${search ? `search=${search}` : ""}${tag ? `&tag=${tag}` : ""}`,
    );
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};
