import axios from "axios";

// Central Axios instance every *Api.ts file should import instead of
// calling axios directly, so the base URL and auth header only need to be
// wired up once.
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attaches the stored JWT to every outgoing request. Reads from
// localStorage directly rather than importing AuthContext, to avoid a
// circular dependency (AuthContext itself calls into loginApi.ts, which
// imports this client).
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("osda_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
