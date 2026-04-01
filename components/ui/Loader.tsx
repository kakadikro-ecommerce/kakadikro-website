"use client";

type LoaderSize = "sm" | "md" | "lg";

interface LoaderProps {
  label?: string;
  className?: string;
  centered?: boolean;
  fullScreen?: boolean;
  overlay?: boolean;
  size?: LoaderSize;
}

const sizeClasses: Record<LoaderSize, { ring: string; dot: string; text: string }> = {
  sm: {
    ring: "h-10 w-10 border-[3px]",
    dot: "h-2.5 w-2.5",
    text: "text-xs",
  },
  md: {
    ring: "h-14 w-14 border-4",
    dot: "h-3 w-3",
    text: "text-sm",
  },
  lg: {
    ring: "h-20 w-20 border-[5px]",
    dot: "h-4 w-4",
    text: "text-base",
  },
};

export default function Loader({
  label = "Loading...",
  className = "",
  centered = true,
  fullScreen = true,
  overlay = true,
  size = "lg",
}: LoaderProps) {
  const currentSize = sizeClasses[size];

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={label}
      className={[
        "w-full bg-[#fff9f5]",
        centered ? "flex items-center justify-center" : "",
        fullScreen ? "fixed inset-0 z-[9999] min-h-screen min-w-full" : "min-h-[180px]",
        overlay ? "backdrop-blur-sm" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex w-full max-w-[280px] flex-col items-center gap-4 px-6 text-center sm:max-w-[320px] sm:px-8">
        <div className="relative flex items-center justify-center">
          <div
            className={[
              "rounded-full border-[#e8d5c7] border-t-[#7A330F] border-r-[#a64b20] animate-spin shadow-[0_0_0_10px_rgba(122,51,15,0.04)] sm:shadow-[0_0_0_14px_rgba(122,51,15,0.05)]",
              currentSize.ring,
            ].join(" ")}
          />
          <div className="absolute flex items-center justify-center rounded-full bg-[#fff9f5] p-2.5 shadow-sm sm:p-3">
            <span className={["rounded-full bg-[#7A330F] animate-pulse", currentSize.dot].join(" ")} />
          </div>
        </div>

        <div className="space-y-1">
          <p className={`${currentSize.text} font-semibold uppercase tracking-[0.24em] text-[#7A330F] sm:tracking-[0.28em]`}>
            Kaka Dikro
          </p>
          <p className={`font-brand-serif text-slate-500 ${currentSize.text}`}>{label}</p>
        </div>
      </div>
    </div>
  );
}
