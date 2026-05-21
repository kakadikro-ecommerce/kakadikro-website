"use client";

import Image from "next/image";
import { Leaf, Award, Users, Heart } from "lucide-react";

const WhoWeAre = () => {
  return (
    <section className="w-full py-12 sm:py-16 bg-white text-[#003d4d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center ">
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold">Who We Are</h2>
            <p className="text-sm sm:text-base leading-relaxed text-gray-600">
              Kaka Dikro spices is a Gujarat-based brand dedicated to bringing authentic,
              rich, and traditional Indian spices to your kitchen. Rooted in the culture
              and flavors of Gujarat, we carefully source and blend high-quality spices
              to deliver purity and taste in every pinch.
            </p>
            <p className="text-sm sm:text-base leading-relaxed text-gray-600">
              Our mission is to preserve the essence of homemade masalas while ensuring
              hygiene, freshness, and consistency. From farm to kitchen, we focus on
              delivering spices that enhance every dish with authentic flavor.
            </p>
          </div>

          <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden shadow-md">
            <Image
              src="/assets/whoweare.webp"
              alt="Spices"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="text-center space-y-10">
          <h2 className="text-2xl sm:text-3xl font-bold">Our Aim</h2>
          <p className="max-w-3xl mx-auto text-sm sm:text-base text-gray-600 leading-relaxed">
            Our aim is to deliver pure, chemical-free, and authentic masalas that bring
            back the traditional taste of Indian kitchens. We strive to support local
            farmers, maintain quality standards, and ensure every product reflects trust
            and excellence.
          </p>
        </div>

        <div className="space-y-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-center">Our Strength</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            <div className="p-6 rounded-2xl border hover:shadow-lg transition text-center space-y-3">
              <Leaf className="mx-auto text-green-700" />
              <h3 className="font-semibold text-lg">Pure Ingredients</h3>
              <p className="text-sm text-gray-600">
                We use natural and high-quality raw spices without any artificial additives.
              </p>
            </div>

            <div className="p-6 rounded-2xl border hover:shadow-lg transition text-center space-y-3">
              <Award className="mx-auto text-green-700" />
              <h3 className="font-semibold text-lg">Quality Assurance</h3>
              <p className="text-sm text-gray-600">
                Every batch goes through strict quality checks to ensure consistency and taste.
              </p>
            </div>

            <div className="p-6 rounded-2xl border hover:shadow-lg transition text-center space-y-3">
              <Users className="mx-auto text-green-700" />
              <h3 className="font-semibold text-lg">Customer Trust</h3>
              <p className="text-sm text-gray-600">
                Our growing customer base reflects our commitment to satisfaction and reliability.
              </p>
            </div>

            <div className="p-6 rounded-2xl border hover:shadow-lg transition text-center space-y-3">
              <Heart className="mx-auto text-green-700" />
              <h3 className="font-semibold text-lg">Made with Care</h3>
              <p className="text-sm text-gray-600">
                Each product is crafted with dedication to preserve traditional flavors.
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default WhoWeAre;
