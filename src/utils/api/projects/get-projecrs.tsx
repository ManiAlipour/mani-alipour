import { apiFetch } from "..";

export const getProjects = async (limit: number = 10) => {
  try {
    const res = await apiFetch(`/projects?limit=${limit}`);

    const data = await res.json();
    return data.data;
  } catch (error) {
    return [];
  }
};
