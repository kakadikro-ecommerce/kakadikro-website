import axios, { AxiosError, AxiosHeaders } from "axios";
import { clearStoredAuth, getAccessToken, setAccessToken as persistAccessToken } from "@/lib/auth";

let storeRef: any;

export const injectStore = (store: any) => {
  storeRef = store;
};

const apiBaseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const axiosInstance = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const syncAccessToken = (token: string | null) => {
  persistAccessToken(token);
  storeRef?.dispatch({ type: "user/setAccessToken", payload: token });
};

const forceLogout = () => {
  clearStoredAuth();
  storeRef?.dispatch({ type: "user/logoutUser" });

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("auth:logout"));
  }
};

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();

    if (token) {
      const headers =
        config.headers instanceof AxiosHeaders
          ? config.headers
          : new AxiosHeaders(config.headers);

      headers.set("Authorization", `Bearer ${token}`);
      config.headers = headers;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      syncAccessToken(null);
      forceLogout();
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;