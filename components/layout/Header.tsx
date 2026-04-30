"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Search, ShoppingCart, User, X } from "lucide-react";

import CartDrawer from "@/components/cart/CartDrawer";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { clearStoredAuth } from "@/lib/auth";
import { normalizeImageSrc } from "@/lib/image";
import { showAlert } from "@/components/ui/alert";
import { toggleCart } from "@/redux/slice/cartSlice";
import { logoutUser } from "@/redux/slice/userSlice";
import { Product } from "@/types/product";
import { getAllProducts } from "@/redux/api/productApi";
import { logoutApi } from "@/redux/api/userApi";
import Loader from "@/components/ui/Loader";

const navItems = [
  { href: "/products", label: "Our Products" },
  { href: "/about", label: "About Us" },
  { href: "/contactUs", label: "Contact Us" },
  { href: "/trackOrder", label: "Track Your Order" },
];

const Header = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const cartCount = useAppSelector((state) => state.cart.totalItems);
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (!debouncedSearch) {
      setResults([]);
      return;
    }

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await getAllProducts({ search: debouncedSearch, limit: 5 });
        setResults(res.items);
      } catch {
        setResults([]);
        showAlert({
          type: "error",
          message: "Unable to search products right now.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [debouncedSearch]);

  const handleLogout = async () => {
    setLogoutLoading(true);

    try {
      await logoutApi();
    } catch {
      // Frontend state should still be cleared if backend session is already invalid.
    } finally {
      clearStoredAuth();
      dispatch(logoutUser());
      setIsMenuOpen(false);
      setLogoutLoading(false);
      showAlert({
        type: "success",
        message: "You have been logged out successfully.",
      });
      router.push("/login");
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full ${isMenuOpen ? "bg-white" : "bg-white/95 backdrop-blur"
          }`}
      >
        <div className="container mx-auto px-4 md:px-6 xl:px-8">
          <div className="flex items-center justify-between gap-3 py-2 md:gap-6">
            <Link href="/" className="flex shrink-0 items-center">
              <div className="flex h-16 items-center md:h-20">
                <img
                  src="/assets/kde-logo.png"
                  alt="Kaka Dikro"
                  className="h-28 w-auto object-contain md:h-36 sm:h-32"
                />
              </div>
            </Link>

            <nav className="hidden flex-1 items-center justify-center gap-8 whitespace-nowrap font-[family-name:var(--font-serif-stack)] text-[14px] font-bold text-[#003d4d] lg:flex xl:gap-12 xl:text-[15px]">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group relative px-1 py-3 transition-colors hover:text-green-800"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 h-[2px] w-0 rounded-full bg-green-700 transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </nav>

            <div className="flex shrink-0 items-center gap-2 sm:gap-3 xl:gap-5">
              <div className="relative hidden xl:block">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setActiveIndex(-1);
                  }}
                  onKeyDown={(e) => {
                    if (!results.length) return;

                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      setActiveIndex((prev) =>
                        prev < results.length - 1 ? prev + 1 : 0
                      );
                    }

                    if (e.key === "ArrowUp") {
                      e.preventDefault();
                      setActiveIndex((prev) =>
                        prev > 0 ? prev - 1 : results.length - 1
                      );
                    }

                    if (e.key === "Enter") {
                      if (activeIndex >= 0) {
                        const selected = results[activeIndex];
                        window.location.href = `/products/${selected.slug}`;
                      }
                    }
                  }}
                  className="w-[220px] rounded-full border border-gray-200 bg-[#f7f8f6] py-2.5 pl-10 pr-4 text-sm text-[#003d4d] transition focus:border-green-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-100"
                />
                {searchTerm && (
                  <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-md mt-2 z-50">
                    {loading ? (
                      <Loader
                        label="Searching products"
                        size="sm"
                        className="min-h-[112px] px-3 py-4"
                      />
                    ) : results.length === 0 ? (
                      <p className="p-3 text-sm">No products found</p>
                    ) : (
                      results.map((product, index) => (
                        <Link
                          key={product._id}
                          href={`/products/${product.slug}`}
                          onClick={() => {
                            setSearchTerm("");
                            setDebouncedSearch("");
                            setResults([]);
                            setActiveIndex(-1);
                          }}
                          className={`flex items-center gap-3 p-3 cursor-pointer ${index === activeIndex ? "bg-gray-200" : "hover:bg-gray-100"
                            }`}
                        >
                          <img
                            src={normalizeImageSrc(product.images?.[0]?.url)}
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                          <span>{product.name}</span>
                        </Link>
                      ))
                    )}
                  </div>
                )}
              </div>

              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-[#003d4d] transition hover:border-green-200 hover:bg-green-50 hover:text-green-700 xl:hidden"
                onClick={() => setShowMobileSearch((prev) => !prev)}
                aria-label="Toggle search"
              >
                <Search size={19} />
              </button>

              {currentUser ? (
                <div className="relative group hidden lg:block">
                  <button
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-[#003d4d] transition hover:border-green-200 hover:bg-green-50 hover:text-green-700 font-bold uppercase"
                    aria-label={currentUser.name || currentUser.email}
                    title={currentUser.name || currentUser.email}
                  >
                    {currentUser.name ? currentUser.name.charAt(0) : <User size={20} strokeWidth={1.8} />}
                  </button>
                  <div className="absolute right-0 top-full hidden w-48 pt-2 group-hover:flex">
                    <div className="flex w-full flex-col rounded-xl border border-gray-100 bg-white p-2 shadow-lg">
                      <div className="border-b px-3 py-2 pb-3 mb-1 text-sm text-gray-900">
                        <p className="font-semibold text-[#003d4d]">{currentUser.name || "User"}</p>
                        <p className="truncate text-xs font-medium text-gray-500">{currentUser.email}</p>
                      </div>
                      <Link href="/profile" className="px-3 py-2 hover:bg-green-50 rounded-md text-sm text-[#003d4d] transition-colors">Profile</Link>
                      <button onClick={handleLogout} disabled={logoutLoading} className="px-3 py-2 text-left hover:bg-red-50 rounded-md text-sm text-red-600 transition-colors disabled:opacity-60">{logoutLoading ? "Logging out..." : "Logout"}</button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-[#003d4d] transition hover:border-green-200 hover:bg-green-50 hover:text-green-700 lg:inline-flex"
                  aria-label="Login"
                  title="Login"
                >
                  <User size={20} strokeWidth={1.8} />
                </Link>
              )}

              <button
                type="button"
                className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-[#003d4d] transition hover:border-green-200 hover:bg-green-50 hover:text-green-700"
                aria-label="Shopping cart"
                onClick={() => dispatch(toggleCart())}
              >
                <ShoppingCart size={20} strokeWidth={1.8} />
                {cartCount > 0 ? (
                  <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[#003d4d] px-1 text-[10px] font-semibold text-white">
                    {cartCount}
                  </span>
                ) : null}
              </button>

              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-[#003d4d] transition hover:border-green-200 hover:bg-green-50 hover:text-green-700 lg:hidden"
                onClick={() => setIsMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu size={21} />
              </button>
            </div>
          </div>
        </div>

        {showMobileSearch ? (
          <div className="border-t border-orange-50 px-4 pb-4 pt-2 xl:hidden md:px-6">
            <div className="container mx-auto">
              <div className="relative">
                <Search
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-full border border-gray-200 bg-[#f7f8f6] py-3 pl-11 pr-4 text-sm text-[#003d4d] transition focus:border-green-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-100"
                />
                {searchTerm && (
                  <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-md mt-2 z-50">
                    {loading ? (
                      <Loader
                        label="Searching products"
                        size="sm"
                        className="min-h-[112px] px-3 py-4"
                      />
                    ) : results.length === 0 ? (
                      <p className="p-3 text-sm">No products found</p>
                    ) : (
                      results.map((product) => (
                        <Link
                          key={product._id}
                          href={`/products/${product.slug}`}
                          className="flex items-center gap-3 p-3 hover:bg-gray-100"
                        >
                          <img
                            src={normalizeImageSrc(product.images?.[0]?.url)}
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                          <span>{product.name}</span>
                        </Link>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}

        {isMenuOpen ? (
          <>
            <button
              type="button"
              className="fixed inset-0 z-40 bg-black/40"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close menu overlay"
            />

            <div className="fixed right-0 top-0 z-50 flex h-full w-[88%] max-w-sm flex-col bg-white opacity-100 p-5 shadow-2xl sm:p-6">
              <div className="mb-6 flex items-center justify-between">
                <span className="text-lg font-semibold text-slate-900">Menu</span>
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-full border border-slate-200 p-2 text-slate-700 transition hover:bg-slate-50"
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex flex-1 flex-col gap-3">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="border-b border-orange-100 px-1 py-3 text-base font-medium text-[#003d4d] transition hover:text-green-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                {currentUser ? (
                  <>
                    <div className="mt-2 rounded-2xl bg-gray-50 px-4 py-3">
                      <p className="font-semibold text-[#003d4d]">{currentUser.name || "User"}</p>
                      <p className="truncate text-sm text-gray-500">{currentUser.email}</p>
                    </div>
                    <Link
                      href="/profile"
                      className="mt-1 rounded-xl bg-[#003d4d] px-4 py-3 text-center text-base font-semibold text-white transition hover:bg-[#025366]"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="mt-1 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-base font-semibold text-red-600 transition hover:bg-red-100"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="mt-3 rounded-2xl bg-[#003d4d] px-4 py-3 text-center text-base font-semibold text-white transition hover:bg-[#025366]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login / Register
                  </Link>
                )}
              </div>
            </div>
          </>
        ) : null}
      </header>
      <CartDrawer />
    </>
  );
};

export default Header;
