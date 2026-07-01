const BASE = "http://localhost:5000/api";

const getToken = () => localStorage.getItem("token");

async function request(path, options = {}) {
  const token = getToken();

  const response = await fetch(BASE + path, {
    ...options,

    headers: {
      "Content-Type": "application/json",

      ...(token && {
        Authorization: `Bearer ${token}`,
      }),

      ...(options.headers || {}),
    },
  });

  const data = await response.json();

  if (!response.ok) throw new Error(data.message);

  return data;
}

const api = {
  get: (path) => request(path),

  post: (path, body) =>
    request(path, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  put: (path, body) =>
    request(path, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  del: (path) =>
    request(path, {
      method: "DELETE",
    }),
};
