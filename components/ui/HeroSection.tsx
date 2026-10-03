import Link from "next/link";
import Image from "next/image";

interface HeroLink {
  label: string;
  href: string;
}

interface HeroProps {
  title?: string;
  image?: string;
  alt?: string;
  eyebrow?: string;
  description?: string;
  primaryCta?: HeroLink;
  secondaryCta?: HeroLink;
  className?: string;
  buttonClassName?: string;
  contentClassName?: string;
  panelClassName?: string;
  layout?: "overlay" | "split";
}

const BANNER_SIZE: Record<string, { width: number; height: number }> = {
  "/assets/banner.png": { width: 1844, height: 853 },
  "/assets/banner1.webp": { width: 1280, height: 720 },
  "/assets/banner2.png": { width: 1847, height: 851 },
  "/assets/banner3.png": { width: 1897, height: 829 },
  "/assets/banner4.png": { width: 2017, height: 780 },
  "/assets/banner5.png": { width: 2017, height: 780 },
};

export default function HeroSection({
  title,
  image,
  alt,
  eyebrow,
  description,
  primaryCta,
  secondaryCta,
  className,
  buttonClassName,
  contentClassName,
  panelClassName,
  layout = "overlay",
}: HeroProps) {
  const src = image || "/assets/banner.png";
  const size = BANNER_SIZE[src] ?? { width: 1844, height: 853 };

  return (
    <section className="relative w-full overflow-hidden">
      <Image
        src={src}
        alt={alt || title || ""}
        width={size.width}
        height={size.height}
        priority
        sizes="100vw"
        className="block h-auto w-full"
      />

      {layout === "split" ? (
        <div className="absolute inset-0 z-10 grid grid-cols-2 items-center">
          {secondaryCta ? (
            <div className="flex justify-center px-3">
              <Link
                href={secondaryCta.href}
                className={
                  buttonClassName ||
                  "rounded-full bg-[#f5a012] px-5 py-2.5 text-sm font-semibold text-[#1a1204] shadow-md transition duration-300 ease-out hover:-translate-y-1 hover:scale-105 hover:bg-[#ffb326] hover:shadow-[0_10px_24px_rgba(245,160,18,0.45)] active:translate-y-0 active:scale-100 sm:px-8 sm:py-3.5 sm:text-base"
                }
              >
                {secondaryCta.label}
              </Link>
            </div>
          ) : (
            <div />
          )}
          {primaryCta ? (
            <div className="flex justify-center px-3">
              <Link
                href={primaryCta.href}
                className={
                  buttonClassName ||
                  "rounded-full bg-[#1f7a34] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition duration-300 ease-out hover:-translate-y-1 hover:scale-105 hover:bg-[#25913e] hover:shadow-[0_10px_24px_rgba(31,122,52,0.45)] active:translate-y-0 active:scale-100 sm:px-8 sm:py-3.5 sm:text-base"
                }
              >
                {primaryCta.label}
              </Link>
            </div>
          ) : null}
        </div>
      ) : (
        <div
          className={`absolute inset-0 z-10 flex ${
            contentClassName || "items-center px-5 py-4 sm:px-8 sm:py-8 lg:px-14"
          }`}
        >
          <div className={`${panelClassName || "max-w-2xl"} ${className || "text-white"}`}>
            {eyebrow ? (
              <p className="mb-2 hidden text-[10px] uppercase tracking-widest sm:mb-3 sm:block sm:text-xs">
                {eyebrow}
              </p>
            ) : null}

            {title ? (
              <h1 className="hidden text-xl font-semibold sm:block sm:text-4xl lg:text-5xl">
                {title}
              </h1>
            ) : null}

            {description ? (
              <p className="mt-2 hidden text-sm text-current/85 sm:mt-3 sm:block sm:text-base lg:text-lg">
                {description}
              </p>
            ) : null}

            {primaryCta || secondaryCta ? (
              <div className="flex flex-wrap gap-2 sm:mt-5 sm:gap-3">
                {primaryCta ? (
                  <Link
                    href={primaryCta.href}
                    className={
                      buttonClassName ||
                      "rounded-full bg-[#EB9F19] px-4 py-2 text-sm font-medium text-[#173129] transition hover:bg-[#f7e3a8] sm:px-5 shadow-md transition duration-300 ease-out hover:-translate-y-1 hover:scale-105"
                    }
                  >
                    {primaryCta.label}
                  </Link>
                ) : null}
                {secondaryCta ? (
                  <Link
                    href={secondaryCta.href}
                    className={
                      buttonClassName ||
                      "rounded-full bg-[#EB9F19] px-4 py-2 text-sm font-medium text-[#173129] transition hover:bg-[#f7e3a8] sm:px-5 shadow-md transition duration-300 ease-out hover:-translate-y-1 hover:scale-105"
                    }
                  >
                    {secondaryCta.label}
                  </Link>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </section>
  );
}
