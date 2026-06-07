import { apiFetch } from ".";

export const getTags = async () => {
  try {
    const res = await apiFetch("/tags");
    const data = await res.json();

    return data.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};
