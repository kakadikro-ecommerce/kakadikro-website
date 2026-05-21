"use client";

interface CartSummaryProps {
  subtotal: number;
  totalItems: number;
  loading?: boolean;
  onClear: () => void;
  onCheckout: () => void;
}

export default function CartSummary({
  subtotal,
  totalItems,
  loading = false,
  onClear,
  onCheckout,
}: CartSummaryProps) {
  const shippingText = totalItems > 0 ? "Shipping calculated at checkout" : "Add products to continue";

  return (
    <div className="rounded-[28px] border border-orange-100 bg-white p-5 shadow-sm">
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>Items</span>
          <span>{totalItems}</span>
        </div>
        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>Subtotal</span>
          <span>&#8377; {subtotal}</span>
        </div>
        <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-base font-semibold text-slate-900">
          <span>Total</span>
          <span>&#8377; {subtotal}</span>
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-500">{shippingText}</p>

      <button
        type="button"
        onClick={onCheckout}
        disabled={loading || totalItems === 0}
        className="mt-5 w-full rounded-full bg-[#7A330F] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#5f2609] disabled:cursor-not-allowed disabled:opacity-50"
      >
        Checkout
      </button>

      <button
        type="button"
        onClick={onClear}
        disabled={loading || totalItems === 0}
        className="mt-3 w-full rounded-full border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Clear Cart
      </button>
    </div>
  );
}
