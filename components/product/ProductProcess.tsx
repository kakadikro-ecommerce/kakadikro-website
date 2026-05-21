"use client";

import { Leaf, Hand, Truck } from "lucide-react";

interface ProcessStep {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export default function ProductProcess() {
  const steps: ProcessStep[] = [
    {
      title: "Sourced from Farms",
      description:
        "We carefully select high-quality spices directly from trusted farms.",
      icon: <Leaf className="h-8 w-8" />,
    },
    {
      title: "Handcrafted Processing",
      description:
        "Each spice is cleaned, blended, and prepared using traditional methods.",
      icon: <Hand className="h-8 w-8" />,
    },
    {
      title: "Delivered to Your Home",
      description:
        "Freshly packed spices are delivered safely to your doorstep.",
      icon: <Truck className="h-8 w-8" />,
    },
  ];

  return (
    <section className="w-full py-14 md:py-20">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        
        <div className="text-center mb-12">
          <span className="inline-flex rounded-full bg-orange-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-orange-700">
            Our Process
          </span>

          <h2 className="mt-4 text-2xl md:text-4xl font-semibold text-slate-900">
            From Farm to Your Kitchen
          </h2>

          <p className="mt-3 text-sm md:text-base text-slate-600 max-w-2xl mx-auto">
            We ensure quality at every step — from sourcing raw spices to delivering fresh products to your home.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center max-w-xs"
            >
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-[#7A330F] text-white shadow-md">
                {step.icon}
              </div>

              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                {step.title}
              </h3>

              <p className="mt-2 text-sm text-slate-600">
                {step.description}
              </p>

              {index !== steps.length - 1 && (
                <div className="hidden md:block absolute translate-x-[140px]">
                  <span className="text-2xl text-orange-400">→</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}