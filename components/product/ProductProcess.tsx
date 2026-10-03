"use client";

import { Hand, Leaf, ShieldCheck, Truck, Wrench } from "lucide-react";

interface ProcessStep {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface ProcessContent {
  title: string;
  description: string;
  steps: ProcessStep[];
}

const processes: Record<"life" | "line", ProcessContent> = {
  life: {
    title: "From Farm to Your Kitchen",
    description:
      "We ensure quality at every step — from sourcing raw spices to delivering fresh products to your home.",
    steps: [
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
    ],
  },
  line: {
    title: "From Selection to Your Farm",
    description:
      "We check quality at every step, from choosing practical equipment to delivering it ready for work at home and on the farm.",
    steps: [
      {
        title: "Chosen for Farm Work",
        description:
          "We select practical tools such as torches, water pumps, and other agri equipment for daily farm and home use.",
        icon: <Wrench className="h-8 w-8" />,
      },
      {
        title: "Checked for Reliable Use",
        description:
          "Each unit is reviewed for build quality so it is ready for regular work.",
        icon: <ShieldCheck className="h-8 w-8" />,
      },
      {
        title: "Delivered to Your Home",
        description: "Packed equipment is delivered safely to your doorstep.",
        icon: <Truck className="h-8 w-8" />,
      },
    ],
  },
};

export default function ProductProcess({ line = "life" }: { line?: "life" | "line" }) {
  const process = processes[line];

  return (
    <section className="w-full py-14 md:py-20">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <span className="inline-flex rounded-full bg-orange-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-orange-700">
            {line === "life" ? "Our Cross Life Process" : "Our Cross Line Process"}
          </span>

          <h2 className="mt-4 text-2xl md:text-4xl font-semibold text-slate-900">
            {process.title}
          </h2>

          <p className="mt-3 text-sm md:text-base text-slate-600 max-w-2xl mx-auto">
            {process.description}
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {process.steps.map((step, index) => (
            <div
              key={step.title}
              className="flex flex-col items-center text-center max-w-xs"
            >
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-[#7A330F] text-white shadow-md">
                {step.icon}
              </div>

              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                {step.title}
              </h3>

              <p className="mt-2 text-sm text-slate-600">{step.description}</p>

              {index !== process.steps.length - 1 && (
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
