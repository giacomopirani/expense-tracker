import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5001/api",
});

api.interceptors.request.use((config) => {
  const raw = localStorage.getItem("auth");
  const token = raw ? (JSON.parse(raw).token as string | null) : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
