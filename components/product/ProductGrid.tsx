"use client";

import { useEffect } from "react";
import Link from "next/link";

import ProductCard from "@/components/product/ProductCard";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import {
  fetchProducts,
  fetchProductsByCategory,
} from "@/redux/slice/productSlice";
import type { Product } from "@/types/product";

interface ProductGridProps {
  title?: string;
  description?: string;
  badge?: string;
  limit?: number;
  showViewAllButton?: boolean;
  products?: Product[];
  groupByCategory?: boolean;
}

const categoryOrder = ["Whole Spices", "Blended Spices", "Powder Spices"];

function ProductSkeletonCard() {
  return (
    <div className="overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm">
      <div className="aspect-[4/3] animate-pulse bg-orange-100" />
      <div className="space-y-3 p-5">
        <div className="h-5 w-2/3 animate-pulse rounded bg-orange-100" />
        <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
        <div className="h-4 w-4/5 animate-pulse rounded bg-slate-100" />
        <div className="h-12 w-full animate-pulse rounded-2xl bg-orange-50" />
      </div>
    </div>
  );
}

export default function ProductGrid({
  title = "Everyday spices, packed for real kitchens",
  description = "Explore a curated selection of signature products with quick pricing and short descriptions.",
  badge = "Featured Products",
  limit,
  showViewAllButton = false,
  products: customProducts,
  groupByCategory = false,
}: ProductGridProps) {
  const dispatch = useAppDispatch();
  const { items, loading, error, categorizedItems } = useAppSelector((state) => state.products);

  useEffect(() => {
    if (customProducts || groupByCategory) {
      return;
    }

    if (!items.length) {
      void dispatch(fetchProducts());
    }
  }, [customProducts, dispatch, groupByCategory, items.length]);

  useEffect(() => {
    if (customProducts || !groupByCategory) {
      return;
    }

    categoryOrder.forEach((category) => {
      const categoryState = categorizedItems[category];

      if (!categoryState?.items.length && !categoryState?.loading) {
        void dispatch(fetchProductsByCategory(category));
      }
    });
  }, [categorizedItems, customProducts, dispatch, groupByCategory]);

  const sourceProducts = customProducts ?? items;
  const products = typeof limit === "number" ? sourceProducts.slice(0, limit) : sourceProducts;
  const isLoading = !customProducts && !groupByCategory && loading;
  const currentError = !customProducts && !groupByCategory ? error : null;

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div className="max-w-2xl space-y-2">
          <span className="inline-flex rounded-full bg-orange-100 px-4 py-1 text-sm font-medium text-orange-700">
            {badge}
          </span>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            {title}
          </h2>
          <p className="text-base leading-7 text-slate-600">{description}</p>
        </div>

        {showViewAllButton ? (
          <Link
            href="/product"
            className="hidden rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-orange-200 hover:text-orange-600 sm:inline-flex"
          >
            View All Products
          </Link>
        ) : null}
      </div>

      {groupByCategory ? (
        <div className="space-y-14">
          {categoryOrder.map((category) => {
            const categoryState = categorizedItems[category];
            const categoryProducts = categoryState?.items ?? [];

            return (
              <div key={category} className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="h-px flex-1 bg-orange-200" />
                  <h3 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                    {category}
                  </h3>
                  <div className="h-px flex-1 bg-orange-200" />
                </div>

                {categoryState?.loading ? (
                  <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <ProductSkeletonCard key={`${category}-${index}`} />
                    ))}
                  </div>
                ) : categoryState?.error ? (
                  <div className="rounded-3xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-700">
                    {categoryState.error}
                  </div>
                ) : categoryProducts.length ? (
                  <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                    {categoryProducts.map((product) => (
                      <ProductCard key={product.id || product._id || product.slug} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-3xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-600">
                    No products found in {category}.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: limit ?? 4 }).map((_, index) => (
            <ProductSkeletonCard key={index} />
          ))}
        </div>
      ) : currentError ? (
        <div className="rounded-3xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-700">
          {currentError}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id || product._id || product.slug} product={product} />
          ))}
        </div>
      )}

      {!groupByCategory && !isLoading && !currentError && !products.length ? (
        <div className="mt-6 rounded-3xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-600">
          No products available right now.
        </div>
      ) : null}

      {showViewAllButton ? (
        <div className="mt-8 sm:hidden">
          <Link
            href="/product"
            className="inline-flex rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-orange-200 hover:text-orange-600"
          >
            View All Products
          </Link>
        </div>
      ) : null}
    </section>
  );
}
