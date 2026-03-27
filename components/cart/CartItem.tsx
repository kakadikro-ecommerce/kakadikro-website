"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";

import type { CartItem as CartItemType } from "@/types/product";

interface CartItemProps {
  item: CartItemType;
  loading?: boolean;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}

export default function CartItem({
  item,
  loading = false,
  onIncrease,
  onDecrease,
  onRemove,
}: CartItemProps) {
  return (
    <article className="rounded-3xl border border-orange-100 bg-white p-4 shadow-sm">
      <div className="flex gap-4">
        <Link
          href={item.slug ? `/products/${item.slug}` : "/products"}
          className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-orange-50"
        >
          <Image
            src={item.image || "/assets/kde-logo.webp"}
            alt={item.name}
            fill
            sizes="80px"
            className="object-cover"
          />
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Link
                href={item.slug ? `/products/${item.slug}` : "/products"}
                className="line-clamp-2 text-sm font-semibold text-slate-900 transition hover:text-orange-600"
              >
                {item.name}
              </Link>
              <p className="mt-1 text-xs text-slate-500">
                {item.category || "Premium spice"}{item.variant.weight ? ` • ${item.variant.weight}` : ""}
              </p>
            </div>

            <button
              type="button"
              onClick={onRemove}
              disabled={loading}
              className="rounded-full p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label={`Remove ${item.name}`}
            >
              <Trash2 size={16} />
            </button>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 p-1">
              <button
                type="button"
                onClick={onDecrease}
                disabled={loading}
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-700 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>
              <span className="min-w-8 text-center text-sm font-semibold text-slate-900">
                {item.quantity}
              </span>
              <button
                type="button"
                onClick={onIncrease}
                disabled={loading}
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-700 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>
            </div>

            <div className="text-right">
              <p className="text-xs text-slate-500">
                &#8377; {item.variant.price} each
              </p>
              <p className="text-base font-semibold text-slate-900">
                &#8377; {item.variant.price * item.quantity}
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
