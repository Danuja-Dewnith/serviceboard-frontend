import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://serviceboard-backend-production.up.railway.app",
  timeout: 10000,
});

// Add token to requests if it exists
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Handle response errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle unauthorized (401)
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (typeof window !== 'undefined') {
        window.location.href = "/login";
      }
    }

    const message =
      error?.response?.data?.message || error.message || "Something went wrong";
    return Promise.reject({ ...error, message });
  },
);

// Job endpoints
export const getJobs = (filters = {}) => API.get("/jobs", { params: filters });
export const getMyJobs = () => API.get("/jobs/my-jobs");
export const getJobById = (id) => API.get(`/jobs/${id}`);
export const createJob = (data) => API.post("/jobs", data);
export const updateJobStatus = (id, status) =>
  API.patch(`/jobs/${id}`, { status });
export const deleteJob = (id) => API.delete(`/jobs/${id}`);

export default API;