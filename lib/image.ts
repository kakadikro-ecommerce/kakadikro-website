export const DEFAULT_PRODUCT_FALLBACK = "/assets/kde-logo.png";

const CLOUDFRONT_BASE_URL = (
  process.env.NEXT_PUBLIC_CLOUDFRONT_BASE_URL ||
  "https://d30tmy2skw22g1.cloudfront.net"
).replace(/\/+$/, "");

const joinCloudFrontPath = (key: string) =>
  `${CLOUDFRONT_BASE_URL}/${key
    .replace(/^\/+/, "")
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/")}`;

/** Public CloudFront URL for a storage key, S3 URL, or existing CloudFront URL. */
export const toCloudFrontMediaUrl = (value?: string | null) => {
  if (!value) {
    return "";
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  if (
    trimmed.startsWith("/") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("blob:")
  ) {
    return trimmed;
  }

  if (!/^https?:\/\//i.test(trimmed)) {
    return joinCloudFrontPath(trimmed.split(/[?#]/)[0]);
  }

  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.toLowerCase();
    if (host.includes("amazonaws.com") || host.includes("cloudfront.net")) {
      const path = decodeURIComponent(parsed.pathname || "").replace(/^\/+/, "");
      return path ? joinCloudFrontPath(path) : trimmed;
    }
  } catch {
    return trimmed;
  }

  return trimmed;
};

export const normalizeImageSrc = (
  src?: string | null,
  fallback = DEFAULT_PRODUCT_FALLBACK
) => {
  if (!src) {
    return fallback;
  }

  const trimmed = src.trim();
  if (!trimmed) {
    return fallback;
  }

  return toCloudFrontMediaUrl(trimmed) || fallback;
};

export const shouldBypassImageOptimization = (src?: string | null) => {
  if (!src) {
    return false;
  }

  return src.startsWith("http://") || src.startsWith("https://");
};
