import axios from "axios";
import { getSession } from "next-auth/react";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_URL,
});

axiosInstance.interceptors.request.use(async (config) => {
  const session = await getSession();
  console.log("Session:", session);
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  } else {
    console.warn("Session or user data is missing!");
  }
  console.log("Config:", config);
  return config;
});

export default axiosInstance;
