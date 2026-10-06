"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import useEmblaCarousel from "embla-carousel-react";

import ProductCard from "@/components/product/ProductCard";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import {
  getAllProductsCatalog,
  getProductTypeCatalog,
} from "@/lib/productTypeCatalog";
import { PRODUCT_TYPE_OPTIONS } from "@/lib/variantLabel";
import { fetchProducts } from "@/redux/slice/productSlice";
import { getAllProducts } from "@/redux/api/productApi";
import { resolveProductType, type Product, type ProductType } from "@/types/product";
import Loader from "@/components/ui/Loader";

interface ProductGridProps {
  title?: string;
  description?: string;
  badge?: string;
  limit?: number;
  showViewAllButton?: boolean;
  viewAllHref?: string;
  products?: Product[];
  showControls?: boolean;
  fixedProductType?: ProductType;
  initialProductType?: "" | ProductType;
}

function ProductSkeletonCard() {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
      <div className="aspect-[5/4] animate-pulse bg-[#efe8dc]" />
      <div className="space-y-3 p-4">
        <div className="flex justify-between gap-3">
          <div className="h-4 w-2/3 animate-pulse rounded bg-slate-100" />
          <div className="h-4 w-12 animate-pulse rounded bg-slate-100" />
        </div>
        <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-slate-100" />
        <div className="h-10 w-full animate-pulse rounded-md bg-slate-100" />
        <div className="h-11 w-full animate-pulse rounded-md bg-[#003d4d]/20" />
      </div>
    </div>
  );
}

function MobileProductSlider({ products }: { products: Product[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: false,
    skipSnaps: false,
  });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    emblaApi?.reInit();
  }, [emblaApi, products]);

  return (
    <div className="relative sm:hidden">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y gap-4">
          {products.map((product) => (
            <div
              key={product.id || product._id || product.slug}
              className="min-w-0 shrink-0 grow-0 basis-[82%]"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      {products.length > 1 ? (
        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => emblaApi?.scrollPrev()}
            disabled={!canPrev}
            aria-label="Previous product"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#003d4d]/20 bg-white text-[#003d4d] shadow-sm transition hover:bg-[#003d4d] hover:text-white disabled:pointer-events-none disabled:opacity-40"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={() => emblaApi?.scrollNext()}
            disabled={!canNext}
            aria-label="Next product"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#003d4d]/20 bg-white text-[#003d4d] shadow-sm transition hover:bg-[#003d4d] hover:text-white disabled:pointer-events-none disabled:opacity-40"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      ) : null}
    </div>
  );
}

const normalizeProductType = (value?: string | null): "" | ProductType =>
  resolveProductType(value);

export default function ProductGrid({
  title,
  description,
  badge = "Products",
  limit = 3,
  showViewAllButton = false,
  viewAllHref,
  products: customProducts,
  showControls = false,
  fixedProductType,
  initialProductType,
}: ProductGridProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { items, loading, error, pagination } = useAppSelector(
    (state) => state.products
  );

  const urlType = showControls
    ? normalizeProductType(searchParams.get("type"))
    : "";

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("");
  const [productType, setProductType] = useState<"" | ProductType>(
    fixedProductType || initialProductType || urlType || "",
  );
  const [page, setPage] = useState(1);
  const [localProducts, setLocalProducts] = useState<Product[]>([]);
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const useLocalFetch = Boolean(fixedProductType && !customProducts);

  const activeType = fixedProductType || productType;
  const typeCatalog = activeType
    ? getProductTypeCatalog(activeType)
    : getAllProductsCatalog();
  const resolvedTitle = title || typeCatalog.listingTitle;
  const resolvedDescription = description || typeCatalog.listingDescription;
  const resolvedViewAllHref =
    viewAllHref ||
    (activeType ? `/products?type=${activeType}` : "/products");

  useEffect(() => {
    if (fixedProductType) {
      setProductType(fixedProductType);
      return;
    }

    if (showControls) {
      setProductType(urlType);
      setPage(1);
    }
  }, [fixedProductType, showControls, urlType]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (customProducts) return;

    if (useLocalFetch) {
      let cancelled = false;

      const loadProducts = async () => {
        try {
          setLocalLoading(true);
          setLocalError(null);
          const response = await getAllProducts({
            productType: fixedProductType,
            limit,
          });
          if (!cancelled) {
            setLocalProducts(response.items);
          }
        } catch {
          if (!cancelled) {
            setLocalError("Failed to load products.");
            setLocalProducts([]);
          }
        } finally {
          if (!cancelled) {
            setLocalLoading(false);
          }
        }
      };

      void loadProducts();

      return () => {
        cancelled = true;
      };
    }

    dispatch(
      fetchProducts({
        search: debouncedSearch || undefined,
        category: category || undefined,
        productType: activeType || undefined,
        page,
        limit,
      })
    );
  }, [
    debouncedSearch,
    category,
    activeType,
    page,
    limit,
    dispatch,
    customProducts,
    useLocalFetch,
    fixedProductType,
  ]);

  const products = customProducts ?? (useLocalFetch ? localProducts : items);
  const gridLoading = useLocalFetch ? localLoading : loading;
  const gridError = useLocalFetch ? localError : error;
  const visibleProducts = customProducts ? products.slice(0, limit) : products;

  const categories = useMemo(() => {
    const map: Record<string, number> = {};
    items.forEach((p) => {
      if (p.category) {
        map[p.category] = (map[p.category] || 0) + 1;
      }
    });
    return Object.entries(map).map(([name, count]) => ({
      name,
      count,
    }));
  }, [items]);

  const showSidebar = showControls && !customProducts;
  const showTypeFilters = showControls && !customProducts && !fixedProductType;
  const showPagination = showControls && !customProducts && Boolean(pagination);
  const isEmpty = !gridLoading && !gridError && visibleProducts.length === 0;

  const updateProductType = (nextType: "" | ProductType) => {
    setProductType(nextType);
    setCategory("");
    setPage(1);

    if (!showControls || fixedProductType) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    if (nextType) {
      params.set("type", nextType);
    } else {
      params.delete("type");
    }

    const query = params.toString();
    router.replace(query ? `/products?${query}` : "/products", { scroll: false });
  };

  const renderProductGrid = (gridProducts: Product[]) => (
    <>
      <MobileProductSlider products={gridProducts} />
      <div className="hidden gap-5 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-6">
        {gridProducts.map((product) => (
          <ProductCard
            key={product.id || product._id || product.slug}
            product={product}
          />
        ))}
      </div>
    </>
  );

  if (
    !gridLoading &&
    !gridError &&
    (customProducts || useLocalFetch) &&
    visibleProducts.length === 0
  ) {
    return null;
  }

  return (
    <section className="w-full bg-[#faf7f0] py-12 sm:py-14">
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-8 text-center sm:mb-10">
        {badge ? (
          <span className="inline-flex rounded-full bg-[#003d4d]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#003d4d]">
            {badge}
          </span>
        ) : null}
        <div className="mt-3 flex flex-col items-center gap-3">
          <h2 className="text-2xl font-bold uppercase tracking-wide text-[#003d4d] sm:text-3xl">
            {resolvedTitle}
          </h2>

          {showViewAllButton && (
            <Link
              href={resolvedViewAllHref}
              className="whitespace-nowrap rounded-md bg-[#003d4d] px-5 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-[#025366]"
            >
              View All Products
            </Link>
          )}
        </div>
        <p className="mx-auto mt-2 max-w-3xl text-sm text-slate-600 sm:text-base">
          {resolvedDescription}
        </p>
      </div>

      {showTypeFilters ? (
        <div className="mb-6 flex flex-wrap gap-2">
          {PRODUCT_TYPE_OPTIONS.map((option) => {
            const isActive = productType === option.value;
            return (
              <button
                key={option.label}
                type="button"
                onClick={() => updateProductType(option.value)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-[#003d4d] text-white shadow-sm"
                    : "border border-[#003d4d]/15 bg-white text-slate-700 hover:border-[#003d4d]/40 hover:text-[#003d4d]"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      ) : null}

      <div className={`flex flex-col gap-8 ${showSidebar ? "lg:flex-row" : ""}`}>
        {showSidebar ? (
          <aside className="w-full shrink-0 space-y-6 lg:w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full rounded-xl border border-slate-200 py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                value={search}
                onChange={(e) => {
                  setPage(1);
                  setSearch(e.target.value);
                }}
              />
            </div>

            <div className="rounded-2xl border border-orange-100 bg-white p-4 shadow-sm">
              <h3 className="mb-3 font-semibold text-slate-900">Categories</h3>

              <button
                type="button"
                className={`block text-left text-sm ${category === "" ? "font-bold text-orange-600" : "text-slate-600"}`}
                onClick={() => {
                  setCategory("");
                  setPage(1);
                }}
              >
                All
              </button>

              <div className="mt-3 space-y-2">
                {categories.map((cat) => (
                  <button
                    type="button"
                    key={cat.name}
                    className={`block text-left text-sm ${category === cat.name ? "font-bold text-orange-600" : "text-slate-600"}`}
                    onClick={() => {
                      setCategory(cat.name);
                      setPage(1);
                    }}
                  >
                    {cat.name} ({cat.count})
                  </button>
                ))}
              </div>
            </div>
          </aside>
        ) : null}

        <div className="flex-1">
          {gridLoading && visibleProducts.length === 0 ? (
            showControls ? (
              <Loader
                label="Loading products"
                fullScreen={false}
                overlay={false}
                className="rounded-3xl border border-orange-100 bg-white"
                size="lg"
              />
            ) : (
              <>
                <div className="flex gap-4 overflow-hidden sm:hidden">
                  {Array.from({ length: Math.min(limit, 2) }).map((_, index) => (
                    <div key={index} className="w-[82%] shrink-0">
                      <ProductSkeletonCard />
                    </div>
                  ))}
                </div>
                <div className="hidden gap-5 sm:grid sm:grid-cols-2 xl:grid-cols-4">
                  {Array.from({ length: limit }).map((_, index) => (
                    <ProductSkeletonCard key={index} />
                  ))}
                </div>
              </>
            )
          ) : gridError ? (
            <div className="text-red-500">{gridError}</div>
          ) : isEmpty ? (
            <div className="rounded-3xl border border-dashed border-orange-200 bg-orange-50/50 px-6 py-16 text-center">
              <p className="text-base font-semibold text-slate-800">No products found</p>
              <p className="mt-2 text-sm text-slate-600">
                Try another product type, category, or search term.
              </p>
            </div>
          ) : (
            <>
              {renderProductGrid(visibleProducts)}

              {showPagination ? (
                <div className="mt-12 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((prev) => prev - 1)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 hover:text-orange-600 disabled:pointer-events-none disabled:opacity-50 sm:h-12 sm:w-12"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold transition-colors sm:h-12 sm:w-12 ${page === p
                        ? "border-orange-600 bg-orange-600 text-white shadow-md shadow-orange-600/20"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-orange-600"
                        }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    disabled={page === pagination.totalPages}
                    onClick={() => setPage((prev) => prev + 1)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 hover:text-orange-600 disabled:pointer-events-none disabled:opacity-50 sm:h-12 sm:w-12"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
    </section>
  );
}
