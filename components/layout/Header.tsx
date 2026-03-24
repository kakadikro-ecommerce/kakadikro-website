"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Menu, Search, ShoppingCart, User, X } from "lucide-react";

import { useAppSelector } from "@/hooks/useAppSelector";

const navItems = [
  { href: "/product", label: "Our Products" },
  { href: "/about", label: "About" },
  { href: "/contactUs", label: "Contact Us" },
  { href: "/trackOrder", label: "Track Your Order" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cartItems = useAppSelector((state) => state.cart.items);
  const currentUser = useAppSelector((state) => state.user.currentUser);

  const cartCount = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems]
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-orange-100 bg-white/95 backdrop-blur">
      <div className="container mx-auto flex items-center justify-between px-4 py-2 md:px-6 xl:px-8">
        <Link href="/" className="flex shrink-0 items-center">
          <div className="flex h-16 items-center md:h-20">
            <img
              src="/kde-logo-1.png"
              alt="Kaka Dikro"
              className="h-40 w-auto object-contain md:h-36"
            />
          </div>
        </Link>

        <nav className="hidden items-center justify-center gap-5 whitespace-nowrap font-[family-name:var(--font-serif-stack)] text-[14px] font-medium text-[#003d4d] lg:flex xl:gap-8 xl:text-[15px]">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-green-800"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-3 xl:gap-6">
          <div className="relative hidden xl:block">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="w-[200px] rounded-[12px] border border-gray-200 bg-[#f8f9fa] py-2.5 pl-11 pr-4 text-sm font-sans transition-all focus:bg-white focus:outline-none focus:ring-1 focus:ring-green-600 lg:w-[280px]"
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              className="text-gray-800 lg:hidden"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>

            <Link
              href={currentUser ? "/" : "/login"}
              className="text-gray-800 transition-colors hover:text-green-700"
              aria-label={currentUser ? currentUser.email : "Login"}
              title={currentUser ? currentUser.email : "Login"}
            >
              <User size={24} strokeWidth={1.2} />
            </Link>

            <button
              type="button"
              className="relative text-gray-800 transition-colors hover:text-green-700"
              aria-label="Shopping cart"
            >
              <ShoppingCart size={24} strokeWidth={1.2} />
              {cartCount > 0 ? (
                <span className="absolute -right-2 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              ) : null}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/40"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close menu overlay"
          />

          <div className="fixed right-0 top-0 z-50 flex h-full w-[82%] max-w-sm flex-col bg-white p-6 shadow-2xl">
            <div className="mb-8 flex items-center justify-between">
              <span className="text-lg font-semibold text-slate-900">Menu</span>
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-full border border-slate-200 p-2 text-slate-700"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-2xl border border-orange-100 px-4 py-3 text-base font-medium text-slate-700 transition hover:border-orange-300 hover:text-orange-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href={currentUser ? "/" : "/login"}
                className="rounded-2xl bg-[#7A330F] px-4 py-3 text-base font-semibold text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                {currentUser ? "My Account" : "Login / Register"}
              </Link>
            </div>
          </div>
        </>
      ) : null}
    </header>
  );
};

export default Header;
