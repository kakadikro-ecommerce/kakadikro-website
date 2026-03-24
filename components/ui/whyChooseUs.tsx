"use client";

import { Award, Package, Smile } from "lucide-react";

export default function WhyChooseUs() {
  const items = [
    {
      icon: Award,
      title: "Quality Products",
      description: "Delivering top-notch quality every time.",
    },
    {
      icon: Package,
      title: "Premium Spice Selection",
      description:
        "Discover our premium spice selection for authentic flavors.",
    },
    {
      icon: Smile,
      title: "Happy Customers",
      description: "Committed to customer satisfaction.",
    },
  ];

  return (
    <section className="py-12 mt-12">
      <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Why Shop With Us
          </h2>
          <p className="text-gray-600 mt-2 text-sm md:text-base">
            Discover what makes our products stand out from the rest
          </p>
        </div>
      <div className="max-w-6xl mx-auto px-4 grid gap-8 sm:grid-cols-2 md:grid-cols-3">
        {items.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="flex items-start gap-4 group transition-all"
            >
              <div className="bg-[#fdfcf0] text-[#899762] p-3 rounded-full group-hover:scale-110 transition-transform">
                <Icon size={26} strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}