import { isAxiosError } from "axios";

export const DEFAULT_API_ERROR = "Something went wrong. Please try again.";

export type ApiErrorDetail = {
  message: string;
  path: string;
};

export type ParsedApiError = {
  message: string;
  details: ApiErrorDetail[] | null;
  isAuthExpired: boolean;
  status?: number;
};

type ApiErrorBody = {
  success?: boolean;
  message?: string;
  error?: string;
  details?: Array<{ message?: string; path?: string | string[] }> | null;
};

const SESSION_EXPIRED_PATTERNS = [
  /session expired/i,
  /token expired/i,
  /jwt expired/i,
  /not authenticated/i,
  /unauthorized/i,
  /please (log|sign) ?in/i,
  /authentication (required|failed)/i,
];

const TECHNICAL_PATTERNS = [
  /^network error$/i,
  /^timeout$/i,
  /request failed with status code/i,
  /status code \d+/i,
  /axioserror/i,
  /econnaborted/i,
  /enotfound/i,
  /etimedout/i,
  /failed to fetch/i,
  /load failed/i,
  /unexpected token/i,
  /syntaxerror/i,
  /at\s+\S+\s+\(/i,
];

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const isTechnicalMessage = (message: string): boolean =>
  TECHNICAL_PATTERNS.some((pattern) => pattern.test(message.trim()));

const sanitizeMessage = (message: string | null | undefined, fallback: string): string => {
  if (!isNonEmptyString(message) || isTechnicalMessage(message)) {
    return fallback;
  }

  return message.trim();
};

export const isSessionExpiredMessage = (message: string): boolean =>
  SESSION_EXPIRED_PATTERNS.some((pattern) => pattern.test(message));

const normalizeDetails = (
  details: ApiErrorBody["details"],
): ApiErrorDetail[] | null => {
  if (!Array.isArray(details) || details.length === 0) {
    return null;
  }

  const normalized = details
    .map((detail) => {
      const message = isNonEmptyString(detail?.message)
        ? detail.message.trim()
        : "";
      const rawPath = detail?.path;
      const path = Array.isArray(rawPath)
        ? rawPath.filter(isNonEmptyString).join(".")
        : isNonEmptyString(rawPath)
          ? rawPath.trim()
          : "";

      if (!message || !path) {
        return null;
      }

      return { message, path };
    })
    .filter((detail): detail is ApiErrorDetail => detail !== null);

  return normalized.length > 0 ? normalized : null;
};

const readErrorBody = (error: unknown): ApiErrorBody | null => {
  if (!isAxiosError(error)) {
    return null;
  }

  const data = error.response?.data;
  if (!data || typeof data !== "object") {
    return null;
  }

  return data as ApiErrorBody;
};

export const getApiErrorMessage = (
  error: unknown,
  fallback: string = DEFAULT_API_ERROR,
): string => {
  return parseApiError(error, fallback).message;
};

export const getApiErrorDetails = (error: unknown): ApiErrorDetail[] | null => {
  return parseApiError(error).details;
};

export const parseApiError = (
  error: unknown,
  fallback: string = DEFAULT_API_ERROR,
): ParsedApiError => {
  if (typeof error === "string") {
    const message = sanitizeMessage(error, fallback);
    return {
      message,
      details: null,
      isAuthExpired: isSessionExpiredMessage(message),
    };
  }

  if (isAxiosError(error)) {
    const body = readErrorBody(error);
    const status = error.response?.status;
    const message = sanitizeMessage(
      body?.message || body?.error,
      fallback,
    );
    const details = normalizeDetails(body?.details);

    return {
      message,
      details,
      isAuthExpired:
        status === 401 || isSessionExpiredMessage(message),
      status,
    };
  }

  if (error instanceof Error) {
    const message = sanitizeMessage(error.message, fallback);
    return {
      message,
      details: null,
      isAuthExpired: isSessionExpiredMessage(message),
    };
  }

  return {
    message: fallback,
    details: null,
    isAuthExpired: false,
  };
};

/** Map API `details[].path` values onto form field names. */
export const mapApiDetailsToFields = (
  details: ApiErrorDetail[] | null | undefined,
  fieldMap?: Record<string, string>,
): Record<string, string> => {
  if (!details?.length) {
    return {};
  }

  const fieldErrors: Record<string, string> = {};

  for (const detail of details) {
    const rawPath = detail.path.replace(/^body\.|^data\./i, "");
    const leaf = rawPath.includes(".")
      ? rawPath.slice(rawPath.lastIndexOf(".") + 1)
      : rawPath;
    const fieldName = fieldMap?.[leaf] || fieldMap?.[rawPath] || leaf;

    if (fieldName && !fieldErrors[fieldName]) {
      fieldErrors[fieldName] = detail.message;
    }
  }

  return fieldErrors;
};

export const redirectToLoginIfExpired = (
  error: unknown,
  redirectPath?: string,
): boolean => {
  const parsed = parseApiError(error);

  if (!parsed.isAuthExpired || typeof window === "undefined") {
    return false;
  }

  const next = redirectPath || window.location.pathname + window.location.search;
  const loginUrl = `/login?redirect=${encodeURIComponent(next)}`;

  if (!window.location.pathname.startsWith("/login")) {
    window.location.assign(loginUrl);
  }

  return true;
};
