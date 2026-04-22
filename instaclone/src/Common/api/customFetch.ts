export const customFetch: typeof fetch = async (input, init) => {
  const res = await fetch(input, {
    ...init,
    credentials: "include", // or headers for JWT
  });

  if (res.status === 401) {
    window.dispatchEvent(new Event("unauthorized"));
  }

  return res;
};