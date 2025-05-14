import axios from "axios";
import { getSession } from "next-auth/react";

const axiosInstance = axios.create({
  baseURL: "/api/proxy",
});

axiosInstance.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  } else {
    console.warn("Session or user data is missing!");
  }

  return config;
});

export default axiosInstance;
