import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("kd-user");

      if (storedUser && config.headers) {
        const parsedUser = JSON.parse(storedUser);

        if (parsedUser?.token) {
          config.headers.Authorization = `Bearer ${parsedUser.token}`;
        }
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;