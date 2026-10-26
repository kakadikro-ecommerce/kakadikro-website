const CART_TOKEN_KEY = "kd_guest_cart_token";
const ORDER_TOKEN_KEY = "kd_guest_order_token";
const IDEMPOTENCY_KEY = "kd_checkout_idempotency";

const canUseStorage = () => typeof window !== "undefined";

const read = (key: string) => {
  if (!canUseStorage()) {
    return "";
  }

  return window.localStorage.getItem(key) || "";
};

const write = (key: string, value: string) => {
  if (!canUseStorage() || !value) {
    return;
  }

  window.localStorage.setItem(key, value);
};

export const getGuestCartToken = () => read(CART_TOKEN_KEY);

export const setGuestCartToken = (token: string) => {
  write(CART_TOKEN_KEY, token.trim());
};

export const getGuestOrderToken = () => read(ORDER_TOKEN_KEY);

export const setGuestOrderToken = (token: string) => {
  write(ORDER_TOKEN_KEY, token.trim());
};

export const clearGuestOrderToken = () => {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(ORDER_TOKEN_KEY);
};

export const clearGuestCartToken = () => {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(CART_TOKEN_KEY);
};

export const hasCheckoutIdempotencyKey = () => {
  if (!canUseStorage()) {
    return false;
  }

  return /^[A-Za-z0-9_-]{8,80}$/.test(window.sessionStorage.getItem(IDEMPOTENCY_KEY) || "");
};

export const getCheckoutIdempotencyKey = () => {
  if (!canUseStorage()) {
    return "";
  }

  const existing = window.sessionStorage.getItem(IDEMPOTENCY_KEY) || "";
  if (/^[A-Za-z0-9_-]{8,80}$/.test(existing)) {
    return existing;
  }

  const key = window.crypto.randomUUID();
  window.sessionStorage.setItem(IDEMPOTENCY_KEY, key);
  return key;
};

export const clearCheckoutIdempotencyKey = () => {
  if (!canUseStorage()) {
    return;
  }

  window.sessionStorage.removeItem(IDEMPOTENCY_KEY);
};
