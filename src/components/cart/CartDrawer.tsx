"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  Clock,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useCheckout } from "@/context/CheckoutContext";
import { gsap } from "@/lib/gsap";

export function CartDrawer() {
  const { openCheckout } = useCheckout();
  const {
    items,
    addons,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeItem,
    addAddon,
    updateAddonQuantity,
    removeAddon,
    getAddonQuantity,
    availableAddons,
    totalItems,
    totalDishesCount,
    itemsSubtotal,
    addonsSubtotal,
    deliveryFee,
    totalAmount,
    orderWindowStatus,
  } = useCart();

  const containerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  // Initialize GSAP initial positioning
  useEffect(() => {
    if (containerRef.current && backdropRef.current && panelRef.current) {
      gsap.set(containerRef.current, { autoAlpha: 0, pointerEvents: "none" });
      gsap.set(backdropRef.current, { opacity: 0 });
      gsap.set(panelRef.current, { xPercent: 100 });
    }
  }, []);

  // Animate opening and closing with GSAP
  useEffect(() => {
    const container = containerRef.current;
    const backdrop = backdropRef.current;
    const panel = panelRef.current;
    if (!container || !backdrop || !panel) return;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (!isCartOpen) {
        return;
      }
    }

    // Kill any active tweens on drawer elements
    gsap.killTweensOf([container, backdrop, panel]);

    if (isCartOpen) {
      // 1. Prevent background scrolling & pause Lenis
      document.body.style.overflow = "hidden";
      if (
        typeof window !== "undefined" &&
        (window as unknown as { lenis?: { stop: () => void } }).lenis
      ) {
        (window as unknown as { lenis?: { stop: () => void } }).lenis?.stop();
      }

      // 2. Make container visible immediately
      gsap.set(container, { autoAlpha: 1, pointerEvents: "auto" });

      const tl = gsap.timeline();

      // 3. Smooth backdrop fade in
      tl.fromTo(
        backdrop,
        { opacity: 0 },
        { opacity: 1, duration: 0.35, ease: "power2.out" },
        0
      );

      // 4. Smooth drawer slide in from right with natural deceleration
      tl.fromTo(
        panel,
        { xPercent: 100 },
        { xPercent: 0, duration: 0.45, ease: "power3.out" },
        0
      );

      // 5. Subtle micro-stagger for internal sections
      const innerElements = [
        headerRef.current,
        bannerRef.current,
        bodyRef.current,
        footerRef.current,
      ].filter(Boolean);

      if (innerElements.length > 0) {
        tl.fromTo(
          innerElements,
          { opacity: 0, x: 20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.3,
            stagger: 0.05,
            ease: "power2.out",
          },
          0.12
        );
      }
    } else {
      // Restore background scrolling & resume Lenis
      document.body.style.overflow = "";
      if (
        typeof window !== "undefined" &&
        (window as unknown as { lenis?: { start: () => void } }).lenis
      ) {
        (window as unknown as { lenis?: { start: () => void } }).lenis?.start();
      }

      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(container, { autoAlpha: 0, pointerEvents: "none" });
        },
      });

      // Smooth drawer slide out to right
      tl.to(panel, { xPercent: 100, duration: 0.35, ease: "power3.in" }, 0);

      // Backdrop fade out
      tl.to(backdrop, { opacity: 0, duration: 0.28, ease: "power2.in" }, 0.05);
    }
  }, [isCartOpen]);

  // Keyboard Escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isCartOpen) {
        closeCart();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCartOpen, closeCart]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
      if (
        typeof window !== "undefined" &&
        (window as unknown as { lenis?: { start: () => void } }).lenis
      ) {
        (window as unknown as { lenis?: { start: () => void } }).lenis?.start();
      }
    };
  }, []);

  const isOpenNow = orderWindowStatus?.isOpen ?? false;

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-hidden={!isCartOpen}
      aria-label="Shopping Bag"
      className="fixed inset-0 z-50 overflow-hidden invisible pointer-events-none"
    >
      {/* ─── Backdrop Overlay ────────────────────────────────────── */}
      <div
        ref={backdropRef}
        onClick={closeCart}
        className="fixed inset-0 bg-black/50 backdrop-blur-xs cursor-pointer opacity-0"
      />

      {/* ─── Slide-Over Panel on Right Side ─────────────────────── */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10 pointer-events-none">
        <aside
          ref={panelRef}
          data-lenis-prevent
          onWheel={(e) => e.stopPropagation()}
          className="w-screen max-w-md bg-white shadow-2xl flex flex-col pointer-events-auto h-full"
        >
          {/* ─── Header ────────────────────────────────────────── */}
          <div
            ref={headerRef}
            className="p-4 sm:p-5 border-b border-neutral-100 flex items-center justify-between shrink-0"
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-neutral-900" />
              <h2 className="font-secondary font-bold text-lg sm:text-xl text-neutral-950">
                Your Bag
              </h2>
              {totalItems > 0 && (
                <span className="bg-red-50 text-[#D92121] text-xs font-bold px-2 py-0.5 rounded-full">
                  {totalItems} {totalItems === 1 ? "item" : "items"}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={closeCart}
              aria-label="Close Bag"
              className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* ─── Live Server Order Window Status Banner ──────────── */}
          <div
            ref={bannerRef}
            className={`px-4 py-2.5 text-xs font-secondary flex items-center gap-2 border-b select-none shrink-0 ${
              isOpenNow
                ? "bg-emerald-50/70 border-emerald-100 text-emerald-900"
                : "bg-amber-50/80 border-amber-100 text-amber-900"
            }`}
          >
            <Clock className="w-4 h-4 shrink-0 text-current" />
            <p className="line-clamp-1">
              {isOpenNow ? (
                <span>
                  <strong>Ordering Open</strong> - Preparing for next dispatch slot
                </span>
              ) : (
                <span>
                  <strong>{orderWindowStatus?.message || "Order window closed"}</strong>
                </span>
              )}
            </p>
          </div>

          {/* ─── Items List or Empty State ──────────────────────── */}
          <div
            ref={bodyRef}
            className="flex-1 flex flex-col min-h-0 overflow-hidden"
          >
            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
                  <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-secondary font-bold text-lg text-neutral-900">
                    Your bag is empty
                  </h3>
                  <p className="font-secondary text-sm text-neutral-500 max-w-xs">
                    Looks like you haven&apos;t added any handcrafted momo yet.
                  </p>
                </div>
                <Link
                  href="/menu"
                  onClick={closeCart}
                  className="bg-[#D92121] hover:bg-[#b81b1b] text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-150 shadow-sm cursor-pointer inline-flex items-center justify-center active:scale-95"
                >
                  Explore Menu
                </Link>
              </div>
            ) : (
              <div
                data-lenis-prevent
                onWheel={(e) => e.stopPropagation()}
                className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 custom-scrollbar overscroll-contain touch-pan-y"
              >
                {/* 1. Momo Dishes List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-1 border-b border-neutral-100">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 font-secondary">
                      Momo ({totalDishesCount})
                    </span>
                    {totalDishesCount >= 12 && (
                      <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-medium">
                        {15 - totalDishesCount} slots left (Max 15)
                      </span>
                    )}
                  </div>

                  <div className="space-y-4 divide-y divide-neutral-100">
                    {items.map(({ product, quantity }) => {
                      const isVeg = product.type === "veg";
                      const displayPieces =
                        product.quantity?.replace(/pcs/i, "pieces") || "6 pieces";

                      return (
                        <div
                          key={product.id}
                          className="not-first:pt-4 flex items-center gap-3 sm:gap-4"
                        >
                          {/* Thumbnail */}
                          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200/80 shadow-2xs">
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              sizes="80px"
                              className="object-cover"
                            />
                          </div>

                          {/* Info & Quantity */}
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                                  isVeg
                                    ? "bg-[#EAF8EE] text-[#2E7D32]"
                                    : "bg-[#FDE8E8] text-[#D92121]"
                                }`}
                              >
                                {isVeg ? "VEG" : "NON-VEG"}
                              </span>
                              <span className="text-[11px] text-neutral-500 font-secondary">
                                {displayPieces}
                              </span>
                            </div>

                            <h4 className="font-secondary font-bold text-sm text-neutral-900 truncate">
                              {product.name}
                            </h4>

                            <div className="flex items-center justify-between pt-1">
                              {/* Quantity Stepper */}
                              <div className="flex items-center border border-neutral-200 rounded-full px-1 py-0.5 shadow-2xs">
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateQuantity(product.id, quantity - 1)
                                  }
                                  aria-label="Decrease quantity"
                                  className="w-5 h-5 flex items-center justify-center text-neutral-600 hover:text-[#D92121] rounded-full transition-colors active:scale-90 cursor-pointer"
                                >
                                  <Minus className="w-3 h-3 stroke-[2.5]" />
                                </button>
                                <span className="font-secondary font-bold text-xs text-neutral-900 min-w-5 text-center">
                                  {quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateQuantity(product.id, quantity + 1)
                                  }
                                  aria-label="Increase quantity"
                                  className="w-5 h-5 flex items-center justify-center text-neutral-600 hover:text-[#D92121] rounded-full transition-colors active:scale-90 cursor-pointer"
                                >
                                  <Plus className="w-3 h-3 stroke-[2.5]" />
                                </button>
                              </div>

                              {/* Line Price & Remove */}
                              <div className="flex items-center gap-2.5">
                                <span className="font-secondary font-bold text-sm text-neutral-950">
                                  ₹{(product.price || 0) * quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => removeItem(product.id)}
                                  aria-label={`Remove ${product.name}`}
                                  className="text-neutral-400 hover:text-red-600 transition-colors p-1 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Selected Add-ons (if any selected) */}
                {addons.length > 0 && (
                  <div className="pt-2 border-t border-neutral-100 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 font-secondary">
                        Selected Add-ons ({addons.reduce((sum, a) => sum + a.quantity, 0)})
                      </span>
                    </div>

                    <div className="space-y-2">
                      {addons.map(({ addon, quantity }) => (
                        <div
                          key={addon.id}
                          className="flex items-center gap-3 p-2.5 rounded-xl bg-neutral-50/80 border border-neutral-200/70 hover:bg-neutral-50 transition-colors"
                        >
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white shrink-0 border border-neutral-200/80 shadow-2xs">
                            <Image
                              src={addon.image}
                              alt={addon.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h5 className="font-secondary font-bold text-xs sm:text-sm text-neutral-900 truncate">
                              {addon.name}
                            </h5>
                            <p className="font-secondary text-[11px] text-neutral-500">
                              ₹{addon.price} each
                            </p>
                          </div>

                          <div className="flex items-center gap-2.5">
                            {/* Stepper */}
                            <div className="flex items-center border border-neutral-200 bg-white rounded-full px-1 py-0.5 shadow-2xs">
                              <button
                                type="button"
                                onClick={() => updateAddonQuantity(addon.id, quantity - 1)}
                                aria-label={`Decrease ${addon.name} quantity`}
                                className="w-5 h-5 flex items-center justify-center text-neutral-600 hover:text-[#D92121] rounded-full transition-colors active:scale-90 cursor-pointer"
                              >
                                <Minus className="w-2.5 h-2.5 stroke-[2.5]" />
                              </button>
                              <span className="font-secondary font-bold text-xs text-neutral-900 min-w-4 text-center">
                                {quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateAddonQuantity(addon.id, quantity + 1)}
                                aria-label={`Increase ${addon.name} quantity`}
                                className="w-5 h-5 flex items-center justify-center text-neutral-600 hover:text-[#D92121] rounded-full transition-colors active:scale-90 cursor-pointer"
                              >
                                <Plus className="w-2.5 h-2.5 stroke-[2.5]" />
                              </button>
                            </div>

                            <span className="font-secondary font-bold text-xs sm:text-sm text-neutral-950 min-w-9 text-right">
                              ₹{addon.price * quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() => removeAddon(addon.id)}
                              aria-label={`Remove ${addon.name}`}
                              className="text-neutral-400 hover:text-red-600 transition-colors p-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Must-Have Add-ons Shelf (Live from Server) */}
                {availableAddons.length > 0 && (
                  <div className="pt-2 border-t border-neutral-100 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-secondary font-bold text-xs sm:text-sm text-neutral-900 flex items-center gap-1.5">
                          <span>Must-Have Sauces &amp; Dips</span>
                          <span className="text-[9px] bg-red-50 text-[#D92121] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                            Fresh
                          </span>
                        </h4>
                        <p className="text-[11px] text-neutral-500 font-secondary mt-0.5">
                          Slow-simmered chilli oil &amp; authentic dips
                        </p>
                      </div>
                    </div>

                    {/* Horizontal Scrollable Carousel Cards */}
                    <div className="flex gap-2.5 overflow-x-auto pb-2 pt-0.5 -mx-1 px-1 scrollbar-none snap-x">
                      {availableAddons.map((addon) => {
                        const qty = getAddonQuantity(addon.id);
                        return (
                          <div
                            key={addon.id}
                            className={`w-36 shrink-0 rounded-xl p-2.5 flex flex-col justify-between snap-start transition-all border ${
                              qty > 0
                                ? "bg-red-50/40 border-[#E53935]/40 shadow-2xs"
                                : "bg-neutral-50/70 border-neutral-200/90 hover:border-neutral-300 hover:bg-white hover:shadow-2xs"
                            }`}
                          >
                            {/* Thumbnail */}
                            <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-white mb-2 border border-neutral-200/70 shadow-2xs">
                              <Image
                                src={addon.image}
                                alt={addon.name}
                                fill
                                sizes="120px"
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>

                            {/* Title & Price */}
                            <div className="space-y-0.5 mb-2">
                              <h5
                                className="font-secondary font-bold text-xs text-neutral-900 truncate leading-tight"
                                title={addon.name}
                              >
                                {addon.name}
                              </h5>
                              <p className="font-secondary font-bold text-xs text-neutral-950">
                                ₹{addon.price}
                              </p>
                            </div>

                            {/* Add / Stepper CTA */}
                            <div>
                              {qty === 0 ? (
                                <button
                                  type="button"
                                  onClick={() => addAddon(addon, 1)}
                                  className="w-full bg-white hover:bg-red-50 text-[#D92121] border border-[#E53935] text-[11px] font-bold py-1 px-2 rounded-full shadow-2xs active:scale-95 transition-all flex items-center justify-center gap-1 cursor-pointer"
                                >
                                  <span>ADD</span>
                                  <span className="text-xs leading-none">+</span>
                                </button>
                              ) : (
                                <div className="w-full bg-white border border-[#E53935] rounded-full shadow-2xs flex items-center justify-between px-1 py-0.5 select-none">
                                  <button
                                    type="button"
                                    onClick={() => updateAddonQuantity(addon.id, qty - 1)}
                                    aria-label={`Decrease ${addon.name} quantity`}
                                    className="w-5 h-5 flex items-center justify-center text-[#D92121] hover:bg-red-50 rounded-full transition-colors active:scale-90 cursor-pointer"
                                  >
                                    <Minus className="w-2.5 h-2.5 stroke-[2.5]" />
                                  </button>
                                  <span className="font-secondary font-bold text-xs text-neutral-900 min-w-3.5 text-center">
                                    {qty}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => updateAddonQuantity(addon.id, qty + 1)}
                                    aria-label={`Increase ${addon.name} quantity`}
                                    className="w-5 h-5 flex items-center justify-center text-[#D92121] hover:bg-red-50 rounded-full transition-colors active:scale-90 cursor-pointer"
                                  >
                                    <Plus className="w-2.5 h-2.5 stroke-[2.5]" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ─── Bill Summary & Checkout Section ───────────────── */}
          {items.length > 0 && (
            <div
              ref={footerRef}
              className="border-t border-neutral-200/90 bg-neutral-50/70 p-4 sm:p-5 space-y-3 font-secondary shrink-0"
            >
              <div className="space-y-1.5 text-xs text-neutral-600">
                <div className="flex justify-between">
                  <span>
                    Momo Subtotal ({totalDishesCount} {totalDishesCount === 1 ? "dish" : "dishes"})
                  </span>
                  <span className="font-semibold text-neutral-900">
                    ₹{itemsSubtotal}
                  </span>
                </div>

                {addonsSubtotal > 0 && (
                  <div className="flex justify-between text-neutral-700">
                    <span>Add-ons Subtotal</span>
                    <span className="font-semibold text-neutral-900">
                      ₹{addonsSubtotal}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Delivery (All over Mumbai via Borzo)</span>
                  <span className="font-semibold text-neutral-900">
                    Paid upon delivery
                  </span>
                </div>

                <div className="flex justify-between pt-2 border-t border-neutral-200 text-sm font-bold text-neutral-950">
                  <span>To Pay</span>
                  <span>₹{totalAmount}</span>
                </div>
              </div>

              {/* Assurance badge */}
              <div className="flex items-center gap-2 pt-1 text-[11px] text-neutral-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Handcrafted fresh on the morning of dispatch</span>
              </div>

              {/* Primary Checkout CTA */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    closeCart();
                    setTimeout(() => {
                      openCheckout();
                    }, 180);
                  }}
                  className="w-full bg-[#D92121] hover:bg-[#b81b1b] text-white font-secondary font-bold py-3 px-4 rounded-full text-xs sm:text-sm tracking-wider uppercase transition-all shadow-sm active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
