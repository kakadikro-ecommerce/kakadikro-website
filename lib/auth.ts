import type { AuthUser } from "@/types/user";

const USER_STORAGE_KEY = "kd-user";
const ACCESS_TOKEN_STORAGE_KEY = "kd-access-token";

let accessTokenMemory: string | null = null;

const canUseStorage = () => typeof window !== "undefined";

export const getAccessToken = () => {
  if (accessTokenMemory) {
    return accessTokenMemory;
  }

  if (!canUseStorage()) {
    return null;
  }

  const storedToken = window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  accessTokenMemory = storedToken;
  return storedToken;
};

export const setAccessToken = (token: string | null) => {
  accessTokenMemory = token;

  if (!canUseStorage()) {
    return;
  }

  if (token) {
    window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
    return;
  }

  window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
};

export const getStoredUser = (): AuthUser | null => {
  if (!canUseStorage()) {
    return null;
  }

  const rawUser = window.localStorage.getItem(USER_STORAGE_KEY);

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser) as AuthUser;
  } catch {
    window.localStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }
};

export const setStoredUser = (user: AuthUser | null) => {
  if (!canUseStorage()) {
    return;
  }

  if (user) {
    window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    return;
  }

  window.localStorage.removeItem(USER_STORAGE_KEY);
};

export const clearStoredAuth = () => {
  setAccessToken(null);
  setStoredUser(null);
};
