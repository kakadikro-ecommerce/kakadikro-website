"use client";

import Image from "next/image";

interface HeroProps {
    title: string;
    image: string;
    ctaText?: string;
    onCtaClick?: () => void;
}

export default function HeroSection({
    title,
    image,
    ctaText = "Explore",
    onCtaClick,
}: HeroProps) {
    return (
        <section className="relative w-full h-[400px] md:h-[450px] lg:h-[500px]">
            <Image
                src={image}
                alt={title}
                fill
                priority
                className="object-cover"
            />

            <div className="absolute inset-0 " />

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                    {title}
                </h1>

                {ctaText && (
                    <button
                        onClick={onCtaClick}
                        className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm md:text-base shadow-lg transition-all duration-300 mt-8"
                    >
                        {ctaText}
                    </button>
                )}
            </div>
        </section>
    );
}