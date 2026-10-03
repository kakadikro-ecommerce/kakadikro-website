"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AboutPreview({ showCTA = true }) {
  const router = useRouter();

  return (
    <section className="w-full py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6 grid md:grid-cols-2 gap-10 items-center">
        <div className="relative w-full h-[300px] md:h-[400px] rounded-2xl overflow-hidden shadow-lg">
          <Image
            src="/assets/about.webp"
            alt="Kakadikro spices"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col justify-center">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-4">
            About Us
          </h2>

          <p className="mb-6 text-sm leading-relaxed text-gray-600 md:text-base">
            Kaka Dikro is a Gujarat-based shop for homes and farms. We sell two
            lines: Cross Life for agri foods and spices, and Cross Line for agri
            equipment such as torches and water pumps. Both are chosen for
            everyday use, so you can see what each line includes before you shop.
          </p>

          {showCTA && (
            <button
              onClick={() => router.push("/about")}
              className="w-fit px-6 py-3 bg-[#7A330F] hover:bg-[#5f2609] text-white text-sm md:text-base font-medium rounded-xl shadow-md transition-all duration-300"
            >
              Read More
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
