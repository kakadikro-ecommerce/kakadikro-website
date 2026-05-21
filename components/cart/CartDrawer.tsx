"use client";

import { useRouter } from "next/navigation";
import { X } from "lucide-react";

import { showAlert } from "@/components/ui/alert";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import {
  clearCartItems,
  closeCart,
  removeCartItem,
  updateCartItem,
} from "@/redux/slice/cartSlice";

import CartItem from "./CartItem";
import CartSummary from "./CartSummary";

export default function CartDrawer() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items, subtotal, totalItems, isOpen, loading, actionLoading, error } = useAppSelector(
    (state) => state.cart
  );

  const handleQuantityChange = (itemId: string, quantity: number) => {
    if (quantity < 1) {
      return;
    }

    void dispatch(updateCartItem({ itemId, quantity }))
      .unwrap()
      .catch((message: string) => {
        showAlert({
          type: "error",
          message: message || "Failed to update cart item.",
        });
      });
  };

  const handleRemove = (itemId: string) => {
    void dispatch(removeCartItem(itemId))
      .unwrap()
      .then(() => {
        showAlert({
          type: "success",
          message: "Item removed from cart.",
        });
      })
      .catch((message: string) => {
        showAlert({
          type: "error",
          message: message || "Failed to remove cart item.",
        });
      });
  };

  const handleClear = () => {
    void dispatch(clearCartItems())
      .unwrap()
      .then(() => {
        showAlert({
          type: "success",
          message: "Cart cleared successfully.",
        });
      })
      .catch((message: string) => {
        showAlert({
          type: "error",
          message: message || "Failed to clear cart.",
        });
      });
  };

  const handleCheckout = () => {
    dispatch(closeCart());
    router.push("/checkout");
  };

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-[60] bg-slate-950/45"
        onClick={() => dispatch(closeCart())}
        aria-label="Close cart overlay"
      />

      <aside className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-xl flex-col bg-[#fffaf6] shadow-2xl">
        <div className="flex items-center justify-between border-b border-orange-100 px-5 py-4 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">
              Your Cart
            </p>
            <h2 className="mt-1 text-xl font-semibold text-slate-900">
              {totalItems} item{totalItems === 1 ? "" : "s"} selected
            </h2>
          </div>

          <button
            type="button"
            onClick={() => dispatch(closeCart())}
            className="rounded-full border border-slate-200 p-2 text-slate-700 transition hover:bg-white"
            aria-label="Close cart"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          {loading ? (
            <div className="rounded-3xl border border-orange-100 bg-white p-6 text-sm text-slate-500 shadow-sm">
              Loading your cart...
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-orange-200 bg-white px-6 py-10 text-center shadow-sm">
              <p className="text-lg font-semibold text-slate-900">Your cart is empty</p>
              <p className="mt-2 text-sm text-slate-500">
                Add your favourite products and they will show up here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <CartItem
                  key={item.cartItemId}
                  item={item}
                  loading={actionLoading}
                  onIncrease={() => handleQuantityChange(item.cartItemId, item.quantity + 1)}
                  onDecrease={() => handleQuantityChange(item.cartItemId, item.quantity - 1)}
                  onRemove={() => handleRemove(item.cartItemId)}
                />
              ))}
            </div>
          )}

          {error ? (
            <p className="mt-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          ) : null}
        </div>

        <div className="border-t border-orange-100 px-5 py-5 sm:px-6">
          <CartSummary
            subtotal={subtotal}
            totalItems={totalItems}
            loading={actionLoading}
            onClear={handleClear}
            onCheckout={handleCheckout}
          />
        </div>
      </aside>
    </>
  );
}
