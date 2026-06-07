export const apiFetch = async (input: RequestInfo, init?: RequestInit) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${input}`,
      init,
    );
    if (!response.ok) {
      throw new Error(
        `apiFetch error: ${response.status} ${response.statusText}`,
      );
    }
    return response;
  } catch (error) {
    throw error;
  }
};
