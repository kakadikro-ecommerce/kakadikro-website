import axios, { AxiosError, AxiosHeaders } from "axios";
import { clearStoredAuth, getAccessToken, setAccessToken as persistAccessToken } from "@/lib/auth";
import {
  clearGuestOrderToken,
  getGuestCartToken,
  setGuestCartToken,
  setGuestOrderToken,
} from "@/lib/guestSession";

let storeRef: any;

export const injectStore = (store: any) => {
  storeRef = store;
};

const apiBaseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://api.kakadikro.com/api";

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
  clearGuestOrderToken();
  storeRef?.dispatch({ type: "user/logoutUser" });
  storeRef?.dispatch({ type: "order/resetOrderState" });

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("auth:logout"));
  }
};

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    const headers =
      config.headers instanceof AxiosHeaders
        ? config.headers
        : new AxiosHeaders(config.headers);

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    } else {
      const guestCartToken = getGuestCartToken();
      if (guestCartToken) {
        headers.set("X-Guest-Cart-Token", guestCartToken);
      }
    }

    config.headers = headers;
    return config;
  },
  (error) => Promise.reject(error)
);

const headerValue = (
  headers: { get?: (name: string) => unknown } | undefined,
  name: string
) => {
  const value = headers?.get?.(name);
  return typeof value === "string" ? value : "";
};

axiosInstance.interceptors.response.use(
  (response) => {
    const body = response.data as {
      guestCartToken?: unknown;
      data?: { guestOrderToken?: unknown };
    };
    const headers = response.headers as { get?: (name: string) => unknown };
    const cartToken =
      headerValue(headers, "x-guest-cart-token") ||
      (typeof body?.guestCartToken === "string" ? body.guestCartToken : "");
    const orderToken =
      headerValue(headers, "x-guest-order-token") ||
      (typeof body?.data?.guestOrderToken === "string" ? body.data.guestOrderToken : "");

    if (cartToken) {
      setGuestCartToken(cartToken);
    }

    if (orderToken) {
      setGuestOrderToken(orderToken);
    }

    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      syncAccessToken(null);
      forceLogout();
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;