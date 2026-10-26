/** Resolve only after the browser successfully loads the image. */
export const preloadImage = (src: string): Promise<string> =>
  new Promise((resolve, reject) => {
    if (!src) {
      reject(new Error("Missing image src"));
      return;
    }

    // Local public assets don't need a network preload gate.
    if (src.startsWith("/") && !src.startsWith("//")) {
      resolve(src);
      return;
    }

    const image = new window.Image();
    image.onload = () => resolve(src);
    image.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    image.src = src;
  });

export const preloadImages = async (sources: string[]): Promise<string[]> => {
  const results = await Promise.allSettled(sources.map((src) => preloadImage(src)));
  return results
    .filter((result): result is PromiseFulfilledResult<string> => result.status === "fulfilled")
    .map((result) => result.value);
};
