export const DEFAULT_PRODUCT_FALLBACK = "/assets/kde-logo.png";

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

  if (
    trimmed.startsWith("/") ||
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("blob:")
  ) {
    return trimmed;
  }

  return `/${trimmed.replace(/^\.?\//, "")}`;
};

export const shouldBypassImageOptimization = (src?: string | null) => {
  if (!src) {
    return false;
  }

  return src.startsWith("http://") || src.startsWith("https://");
};
