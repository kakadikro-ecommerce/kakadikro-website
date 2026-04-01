export const normalizeImageSrc = (
  src?: string | null,
  fallback = "/assets/kde-logo.webp"
) => {
  if (!src) {
    return fallback;
  }

  if (
    src.startsWith("/") ||
    src.startsWith("http://") ||
    src.startsWith("https://") ||
    src.startsWith("data:") ||
    src.startsWith("blob:")
  ) {
    return src;
  }

  return `/${src.replace(/^\.?\//, "")}`;
};
