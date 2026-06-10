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

export const getView = async (id: string) => {
  try {
    const res = await apiFetch(`/blogs/${id}/view`);
    const data = await res.json();
    return data.data.totalViews as number;
  } catch (error) {
    return 0;
  }
};
