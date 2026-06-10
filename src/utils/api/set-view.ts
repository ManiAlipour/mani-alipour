import { apiFetch } from ".";

export const setView = async (id: string) => {
  try {
    const res = await apiFetch(`/blogs/${id}/view`, {
      method: "POST",
    });
    const data = await res.json();
    return data.data;
  } catch (error) {
    return null;
  }
};
