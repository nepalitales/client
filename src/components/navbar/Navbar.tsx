"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X, ChevronDown, LogOut } from "lucide-react";
import { siteConfig } from "@/config/site";
import { OrderWindowBanner } from "./OrderWindowBanner";
import { useCart } from "@/context/CartContext";
import { useCheckout } from "@/context/CheckoutContext";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { openCart, totalItems } = useCart();
  const { openAuthModal, user, isLoggedIn, signOut } = useCheckout();

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
  }

  // Track scroll state for subtle elevated shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full bg-white transition-shadow duration-200 border-b border-neutral-100 ${
          isScrolled ? "shadow-[0_2px_12px_rgba(0,0,0,0.06)]" : ""
        }`}
      >
      <div className="figma-container">
        {/* ─── Desktop 3-Column Navigation Grid ─────────────────── */}
        <div className="hidden lg:grid grid-cols-3 items-center h-20">
          {/* Left Column: Menu, About */}
          <nav
            aria-label="Primary Left Navigation"
            className="flex items-center justify-start gap-8 font-secondary"
          >
            <Link
              href="/menu"
              className="text-sm font-semibold tracking-wide text-neutral-800 hover:text-accent-red transition-colors"
            >
              Menu
            </Link>
            <Link
              href="/about"
              className="text-sm font-semibold tracking-wide text-neutral-800 hover:text-accent-red transition-colors"
            >
              About
            </Link>
          </nav>

          {/* Center Column: Wordmark with 4% letter spacing & accent red */}
          <div className="flex items-center justify-center">
            <Link
              href="/"
              className="font-primary text-2xl xl:text-3xl font-black uppercase tracking-[0.04em] text-accent-red hover:opacity-90 transition-opacity select-none text-center"
              aria-label={`${siteConfig.name} Home`}
            >
              {siteConfig.name}
            </Link>
          </div>

          {/* Right Column: Cart, Login, Sign In */}
          <nav
            aria-label="Primary Right Navigation"
            className="flex items-center justify-end gap-6 font-secondary"
          >
            {/* Cart Button with Shopping Bag Icon & Badge */}
            <button
              type="button"
              onClick={openCart}
              className="flex items-center gap-2 text-sm font-semibold tracking-wide text-neutral-800 hover:text-accent-red transition-colors group cursor-pointer"
              aria-label="View Shopping Cart"
            >
              <div className="relative flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-neutral-800 group-hover:text-accent-red transition-colors" />
                <span className="absolute -top-1.5 -right-2 bg-accent-red text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                  {totalItems}
                </span>
              </div>
              <span>Cart</span>
            </button>

            {/* Sign In CTA Button or User Name Button (Identical Branded Style) */}
            {isLoggedIn ? (
              <div ref={userMenuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((prev) => !prev)}
                  className="inline-flex items-center justify-center gap-1.5 px-5 py-2 text-xs xl:text-sm font-bold uppercase tracking-wider text-white bg-accent-red hover:bg-[#b81b1b] rounded-full shadow-sm hover:shadow transition-all active:scale-[0.98] cursor-pointer max-w-[200px]"
                  aria-label="User account menu"
                  aria-expanded={userMenuOpen}
                >
                  <span className="truncate">
                    {user?.username || user?.email?.split("@")[0] || "Account"}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 stroke-[2.5] transition-transform duration-200 shrink-0 ${
                      userMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-neutral-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-neutral-100 text-left">
                      <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                        Signed In As
                      </p>
                      <p className="text-xs font-bold text-neutral-900 truncate">
                        {user?.username || user?.email?.split("@")[0]}
                      </p>
                      <p className="text-[11px] text-neutral-500 truncate">
                        {user?.email}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setUserMenuOpen(false);
                        signOut();
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-neutral-700 hover:text-accent-red hover:bg-red-50/50 transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <span>Sign Out</span>
                      <LogOut className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={openAuthModal}
                className="inline-flex items-center justify-center px-5 py-2 text-xs xl:text-sm font-bold uppercase tracking-wider text-white bg-accent-red hover:bg-[#b81b1b] rounded-full shadow-sm hover:shadow transition-all active:scale-[0.98] cursor-pointer"
              >
                Sign In
              </button>
            )}
          </nav>
        </div>

        {/* ─── Mobile / Tablet Header (< 1024px) ─────────────────── */}
        <div className="flex lg:hidden items-center justify-between h-16 sm:h-18">
          {/* Mobile Menu Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            className="p-2 -ml-2 text-neutral-900 hover:text-accent-red transition-colors rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-red cursor-pointer"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 stroke-[2.2]" />
            ) : (
              <Menu className="w-6 h-6 stroke-[2.2]" />
            )}
          </button>

          {/* Centered Wordmark on Mobile */}
          <Link
            href="/"
            className="font-primary text-xl sm:text-2xl font-black uppercase tracking-[0.04em] text-accent-red hover:opacity-90 transition-opacity select-none text-center"
            aria-label={`${siteConfig.name} Home`}
          >
            {siteConfig.name}
          </Link>

          {/* Mobile Cart Action */}
          <button
            type="button"
            onClick={openCart}
            className="p-2 -mr-2 text-neutral-900 hover:text-accent-red transition-colors relative flex items-center justify-center cursor-pointer"
            aria-label="View Shopping Cart"
          >
            <ShoppingBag className="w-6 h-6 stroke-[2]" />
            <span className="absolute top-1 right-1 bg-accent-red text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
              {totalItems}
            </span>
          </button>
        </div>
      </div>

      {/* ─── Mobile Navigation Drawer ─────────────────────────── */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-neutral-100 bg-white shadow-xl animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="figma-container py-6 space-y-6">
            <nav
              aria-label="Mobile Navigation"
              className="flex flex-col space-y-4 font-secondary text-base font-semibold text-neutral-900"
            >
              <Link
                href="/menu"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 hover:text-accent-red transition-colors border-b border-neutral-50"
              >
                Menu
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 hover:text-accent-red transition-colors border-b border-neutral-50"
              >
                About
              </Link>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openCart();
                }}
                className="w-full py-2 hover:text-accent-red transition-colors border-b border-neutral-50 flex items-center justify-between text-left cursor-pointer"
              >
                <span>Cart</span>
                <span className="bg-accent-red/10 text-accent-red text-xs font-bold px-2.5 py-0.5 rounded-full">
                  {totalItems} {totalItems === 1 ? "item" : "items"}
                </span>
              </button>
            </nav>

            {/* Mobile Sign In or User Name Button (Identical Branded Style) */}
            <div className="pt-2">
              {isLoggedIn ? (
                <div className="space-y-2.5">
                  <div className="flex w-full items-center justify-center py-3 px-6 text-sm font-bold uppercase tracking-wider text-white bg-accent-red rounded-full shadow-sm">
                    <span className="truncate">
                      {user?.username || user?.email?.split("@")[0] || "Account"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      signOut();
                    }}
                    className="flex w-full items-center justify-center py-2 text-xs font-semibold text-neutral-500 hover:text-accent-red transition-colors cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuthModal();
                  }}
                  className="flex w-full items-center justify-center py-3 px-6 text-sm font-bold uppercase tracking-wider text-white bg-accent-red hover:bg-[#b81b1b] rounded-full shadow-sm active:scale-[0.98] transition-all cursor-pointer"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
    <OrderWindowBanner />
  </>
  );
}
