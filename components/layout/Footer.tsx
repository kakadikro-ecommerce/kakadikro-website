"use client";

import { Facebook, Instagram, Youtube } from 'lucide-react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="w-full font-[family-name:var(--font-serif-stack)] pt-8 sm:pt-10">

      <div className="container mx-auto px-4 sm:px-6">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-10">

          <div className="flex flex-col gap-3 sm:gap-4">
            <Link href="/" className="flex items-center shrink-0 cursor-pointer">
              <div className="h-16 md:h-20 flex items-center">
                <img
                  src="/kde-logo-1.png"
                  alt="Logo"
                  className="h-40 md:h-36 w-auto object-contain"
                />
              </div>
            </Link>
            <p className="text-xs sm:text-sm md:text-[14px] text-[#003d4d] leading-relaxed max-w-[260px]">
              132, Poonam Farm, Navi Pardi, Kamrej, Surat - 394150 Gujarat, India.
            </p>

            <div className="flex flex-col gap-1 text-xs sm:text-sm text-[#003d4d]">
              <p>
                <span className="font-semibold">Email -</span>{" "}
                <a href="#" className="underline underline-offset-2">info@girorganic.com</a>
              </p>
              <p>
                <span className="font-semibold">Phone -</span>{" "}
                <a href="#">+91-9099909453</a>
              </p>
            </div>

            <div className="flex gap-2 sm:gap-3 mt-2">
              <a href="#" className="bg-[#003d4d] text-white p-2 rounded-full hover:bg-green-800 transition">
                <Facebook size={14} />
              </a>
              <a href="#" className="bg-[#003d4d] text-white p-2 rounded-full hover:bg-green-800 transition">
                <Instagram size={14} />
              </a>
              <a href="#" className="bg-[#003d4d] text-white p-2 rounded-full hover:bg-green-800 transition">
                <Youtube size={14} />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-[#003d4d] mb-3 sm:mb-4">
              Info
            </h3>
            <ul className="flex flex-col gap-2 text-xs sm:text-sm text-[#003d4d]">
              <li><a href="/product" className="hover:translate-x-1 transition inline-block">All Products</a></li>
              <li><a href="/about" className="hover:translate-x-1 transition inline-block">About Us</a></li>
              <li><a href="/contactUs" className="hover:translate-x-1 transition inline-block">Contact Us</a></li>
              <li><a href="/trackOrder" className="hover:translate-x-1 transition inline-block">Track Your Order</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm sm:text-base font-semibold text-[#003d4d] mb-3 sm:mb-4">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-2 text-xs sm:text-sm text-[#003d4d]">
              <li><a href="#">Search</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Shipping Policy</a></li>
              <li><a href="#">Refund & Cancellations</a></li>
            </ul>
          </div>

        </div>

        <div className="text-center py-3 sm:py-4 text-[10px] sm:text-xs text-gray-500 border-t border-gray-100">
          &copy; {new Date().getFullYear()} Kaka Dikro. All Rights Reserved.
        </div>

      </div>

    </footer>
  );
};

export default Footer;
