"use client";

import Link from "next/link";
import { ChevronRight, Cpu, Leaf, PackageCheck, ShieldCheck, Sparkles, Wrench } from "lucide-react";

import { getProductTypeCatalog } from "@/lib/productTypeCatalog";
import { isCrossLineType, type Product } from "@/types/product";

interface ProductPageIntroProps {
  product: Product;
}

const GROCERY_ICONS = [Leaf, PackageCheck, Sparkles];
const ELECTRONICS_ICONS = [Cpu, ShieldCheck, Wrench];

export default function ProductPageIntro({ product }: ProductPageIntroProps) {
  const catalog = getProductTypeCatalog(product.productType);
  const isElectronics = isCrossLineType(product.productType);
  const icons = isElectronics ? ELECTRONICS_ICONS : GROCERY_ICONS;
  const category = product.category?.trim() || catalog.categoryFallback;
  const blurb =
    product.shortDescription?.trim() ||
    product.description?.trim() ||
    catalog.introDescription;

  return (
    <section className="border-b border-orange-100/80 bg-[#fdfcf0]">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-slate-500 sm:text-sm"
        >
          <Link href="/products" className="transition hover:text-[#7A330F]">
            Products
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-400" />
          <Link
            href={`/products?type=${isElectronics ? "CROSSLINE" : "CROSSLIFE"}`}
            className="transition hover:text-[#7A330F]"
          >
            {catalog.label}
          </Link>
          {category ? (
            <>
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              <span className="text-slate-700">{category}</span>
            </>
          ) : null}
        </nav>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <span className="inline-flex rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-orange-700">
              {catalog.introBadge}
            </span>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              {product.name}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              {blurb}
            </p>
            <p className="mt-2 text-sm font-medium text-[#7A330F]">
              {catalog.introTitle}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {catalog.introSteps.map((step, index) => {
              const Icon = icons[index] || Sparkles;
              return (
                <div
                  key={step.title}
                  className="flex items-start gap-3 rounded-2xl border border-orange-100 bg-white/80 p-3.5 shadow-sm shadow-orange-50"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#7A330F] text-white">
                    <Icon size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      {step.title}
                    </h3>
                    <p className="mt-0.5 text-xs leading-5 text-slate-600 sm:text-sm">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
