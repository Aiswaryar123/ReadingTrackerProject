import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

// ADDED THIS PART:
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    // IMPORTANT: Make sure there is a SPACE after 'Bearer'
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
