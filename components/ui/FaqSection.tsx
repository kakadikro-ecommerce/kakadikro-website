"use client";

import { useState } from "react";

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  title?: string;
  description?: string;
  badge?: string;
  faqs: FAQItem[];
}

export default function FAQSection({
  title = "Frequently Asked Questions",
  description = "Everything you need to know.",
  badge = "FAQs",
  faqs,
}: FAQSectionProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="w-full py-14 md:py-20">
      <div className="max-w-4xl mx-auto px-4 md:px-6">

        <div className="text-center mb-10">
          {badge && (
            <span className="inline-flex rounded-full bg-orange-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-orange-700">
              {badge}
            </span>
          )}
          <h2 className="mt-4 text-2xl md:text-4xl font-semibold text-slate-900">
            {title}
          </h2>
          <p className="mt-2 text-sm md:text-base text-slate-600">
            {description}
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = activeIndex === index;

            return (
              <div
                key={index}
                className="rounded-2xl border border-orange-100 bg-white shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="text-sm md:text-base font-medium text-slate-800">
                    {faq.question}
                  </span>

                  <span
                    className={`relative flex h-3 w-3 items-center justify-center transition-transform duration-300 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    <span className="absolute h-[1.5px] w-3 bg-[#7A330F]" />
                    <span className="absolute h-3 w-[1.5px] bg-[#7A330F]" />
                  </span>
                </button>

                <div
                  className={`grid transition-all duration-300 ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-4 text-sm md:text-base text-slate-600">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}