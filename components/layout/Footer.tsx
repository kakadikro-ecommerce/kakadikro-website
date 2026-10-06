"use client";

import { Facebook, Instagram, Youtube } from 'lucide-react';
import Link from 'next/link';

const fbLink = process.env.NEXT_PUBLIC_FACEBOOK_URL
const instaLink = process.env.NEXT_PUBLIC_INSTAGRAM_URL
const ytLink = process.env.NEXT_PUBLIC_YOUTUBE_URL


const Footer = () => {
  return (
    <footer className="relative mt-16 w-full overflow-hidden bg-white font-[family-name:var(--font-serif-stack)]">
      {/*
        Single stacked footer: illustration + content share one cell.
        Image stays full-width/uncropped; text overlays on top of it.
      */}
      <div className="grid w-full">
        <div className="col-start-1 row-start-1 w-full self-end" aria-hidden="true">
          <img
            src="/assets/footer-illustration.svg"
            alt=""
            className="block h-auto w-full select-none"
          />
        </div>

        <div className="col-start-1 row-start-1 z-10 flex w-full flex-col">
          <div className="container mx-auto flex flex-1 flex-col px-4 pt-8 pb-8 md:px-6 md:pt-10 md:pb-10 xl:px-8">
            <div className="mb-8 flex flex-col items-center justify-between gap-10 text-center md:mb-10 md:flex-row md:items-start md:text-left lg:gap-12">
              <div className="flex flex-col items-center gap-4 md:items-start xl:max-w-sm">
                <Link href="/" className="flex shrink-0 cursor-pointer items-center">
                  <div className="flex h-14 items-center md:h-16">
                    <img
                      src="/assets/logo.png"
                      alt="Logo"
                      className="h-14 w-auto object-contain md:h-16"
                    />
                  </div>
                </Link>
                <p className="max-w-[260px] text-xs font-bold leading-relaxed text-[#003d4d] sm:text-sm md:text-[14px]">
                  Parvat patiya, Surat -395010 Gujarat, India.
                </p>

                <div className="flex flex-col gap-1 text-xs text-[#003d4d] sm:text-sm">
                  <p>
                    <span className="font-semibold">Email -</span>{" "}
                    <a href="mailto:kakadikroproduct@gmail.com" className="underline underline-offset-2">kakadikroproduct@gmail.com</a>
                  </p>
                </div>

                <div className="mt-2 flex justify-center gap-3 sm:justify-start">
                  <a href={fbLink} target="_blank"
                    rel="noopener noreferrer" className="rounded-full bg-[#003d4d] p-2 text-white transition hover:bg-green-800">
                    <Facebook size={14} />
                  </a>
                  <a href={instaLink} target="_blank"
                    rel="noopener noreferrer" className="rounded-full bg-[#003d4d] p-2 text-white transition hover:bg-green-800">
                    <Instagram size={14} />
                  </a>
                  <a href={ytLink} target="_blank"
                    rel="noopener noreferrer" className="rounded-full bg-[#003d4d] p-2 text-white transition hover:bg-green-800">
                    <Youtube size={14} />
                  </a>
                </div>
              </div>

              <div className="w-full max-w-[260px]">
                <h3 className="mb-3 text-sm font-semibold text-[#003d4d] sm:mb-4 sm:text-base">
                  Info
                </h3>
                <ul className="flex flex-col gap-2 text-xs font-bold text-[#003d4d] sm:text-sm">
                  <li><a href="/products" className="inline-block transition hover:translate-x-1">All Products</a></li>
                  <li><a href="/about" className="inline-block transition hover:translate-x-1">About Us</a></li>
                  <li><a href="/contactUs" className="inline-block transition hover:translate-x-1">Contact Us</a></li>
                  <li><a href="/trackOrder" className="inline-block transition hover:translate-x-1">Track Your Order</a></li>
                </ul>
              </div>

              <div className="w-full max-w-[260px]">
                <h3 className="mb-3 text-sm font-semibold text-[#003d4d] sm:mb-4 sm:text-base">
                  Quick Links
                </h3>
                <ul className="flex flex-col gap-2 text-xs font-bold text-[#003d4d] sm:text-sm">
                  <li><a href="#">Search</a></li>
                  <li><a href="#">Privacy Policy</a></li>
                  <li><a href="#">Terms of Service</a></li>
                  <li><a href="#">Shipping Policy</a></li>
                  <li><a href="#">Refund & Cancellations</a></li>
                </ul>
              </div>
            </div>

            <div className="mt-auto border-t border-[#003d4d]/15 py-3 text-center text-[10px] text-[#003d4d]/80 sm:py-4 sm:text-xs">
              &copy; {new Date().getFullYear()} Kaka Dikro. All Rights Reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
