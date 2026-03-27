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
            className="object-cover"
          />
        </div>

        <div className="flex flex-col justify-center">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-4">
            About Us
          </h2>

          <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-6 whitespace-pre-line">
            {`Kakadikro spices brings the authentic taste of traditional Indian spices straight to your kitchen. 
              Crafted with carefully selected ingredients and blended using time-honored techniques, 
              our masalas deliver rich aroma and unmatched flavor.
              Founded with a passion for quality and purity, Kakadikro ensures every product reflects trust,
              freshness, and the true essence of homemade spices. 
              Experience the difference with Kakadikro – where every pinch tells a story of heritage and taste.
              here at Kakadikro, we are committed to providing you with the finest spices that not only enhance your culinary creations but also connect you to the rich tapestry of Indian flavors. 
              `}
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
