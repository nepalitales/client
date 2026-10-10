"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { useCheckout, type CheckoutStep } from "@/context/CheckoutContext";
import { Step1OrderType } from "./Step1OrderType";
import { Step2DeliverySlot } from "./Step2DeliverySlot";
import { Step3CustomerAuth } from "./Step3CustomerAuth";
import { Step4AddressDetails } from "./Step4AddressDetails";
import { Step5PaymentReview } from "./Step5PaymentReview";
import { Step6OrderSuccess } from "./Step6OrderSuccess";
import { X, ChevronLeft, ShoppingBag } from "lucide-react";

export function CheckoutModal() {
  const {
    isCheckoutOpen,
    closeCheckout,
    currentStep,
    prevStep,
    orderType,
    isAuthStandalone,
  } = useCheckout();

  const containerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  // Initial GSAP setup
  useEffect(() => {
    if (containerRef.current && backdropRef.current && panelRef.current) {
      gsap.set(containerRef.current, { autoAlpha: 0, pointerEvents: "none" });
      gsap.set(backdropRef.current, { opacity: 0 });
      gsap.set(panelRef.current, { scale: 0.95, opacity: 0, y: 20 });
    }
  }, []);

  // GSAP animation for open/close
  useEffect(() => {
    const container = containerRef.current;
    const backdrop = backdropRef.current;
    const panel = panelRef.current;
    if (!container || !backdrop || !panel) return;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (!isCheckoutOpen) return;
    }

    gsap.killTweensOf([container, backdrop, panel]);

    if (isCheckoutOpen) {
      document.body.style.overflow = "hidden";
      if (
        typeof window !== "undefined" &&
        (window as unknown as { lenis?: { stop: () => void } }).lenis
      ) {
        (window as unknown as { lenis?: { stop: () => void } }).lenis?.stop();
      }

      gsap.set(container, { autoAlpha: 1, pointerEvents: "auto" });

      const tl = gsap.timeline();
      tl.fromTo(
        backdrop,
        { opacity: 0 },
        { opacity: 1, duration: 0.25, ease: "power2.out" },
        0
      );
      tl.fromTo(
        panel,
        { scale: 0.95, opacity: 0, y: 16 },
        { scale: 1, opacity: 1, y: 0, duration: 0.32, ease: "back.out(1.1)" },
        0.04
      );
    } else {
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(container, { autoAlpha: 0, pointerEvents: "none" });
          document.body.style.overflow = "";
          if (
            typeof window !== "undefined" &&
            (window as unknown as { lenis?: { start: () => void } }).lenis
          ) {
            (window as unknown as { lenis?: { start: () => void } }).lenis?.start();
          }
        },
      });

      tl.to(panel, { scale: 0.95, opacity: 0, y: 12, duration: 0.22, ease: "power2.in" }, 0);
      tl.to(backdrop, { opacity: 0, duration: 0.22, ease: "power2.in" }, 0.04);
    }
  }, [isCheckoutOpen]);

  // Keyboard Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isCheckoutOpen && currentStep !== "ORDER_SUCCESS") {
        closeCheckout();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCheckoutOpen, currentStep, closeCheckout]);

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

  const getStepTitle = (): string => {
    switch (currentStep) {
      case "ORDER_TYPE":
        return "Location";
      case "DELIVERY_SLOT":
        return "Schedule Window";
      case "AUTH_LOGIN":
        return "Verification";
      case "USER_DETAILS":
        return orderType === "delivery" ? "Address Details" : "Pickup Details";
      case "PAYMENT":
        return "Checkout";
      case "ORDER_SUCCESS":
        return "Order Confirmed";
      default:
        return "Nepali Tales";
    }
  };

  const canGoBack =
    currentStep !== "ORDER_TYPE" &&
    currentStep !== "ORDER_SUCCESS" &&
    (!isAuthStandalone || currentStep !== "AUTH_LOGIN");

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label="Checkout Wizard"
      data-lenis-prevent
      className="fixed inset-0 z-50 overflow-y-auto invisible pointer-events-none flex items-center justify-center p-3 sm:p-5"
    >
      {/* ─── Backdrop Overlay ────────────────────────────────────── */}
      <div
        ref={backdropRef}
        onClick={() => {
          if (currentStep !== "ORDER_SUCCESS") closeCheckout();
        }}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs cursor-pointer opacity-0"
      />

      {/* ─── Modal Dialog Panel (Compact Branded Card) ────────────── */}
      <div
        ref={panelRef}
        data-lenis-prevent
        onWheel={(e) => e.stopPropagation()}
        className="relative w-full max-w-[420px] bg-white rounded-[28px] sm:rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.22)] flex flex-col pointer-events-auto max-h-[92vh] overflow-hidden border border-neutral-100 z-10 my-auto"
      >
        {/* ─── Top Header Bar: Chevron, Centered Title, Close Button ─── */}
        <div className="px-6 pt-5 pb-2 flex items-center justify-between shrink-0 bg-white">
          {canGoBack ? (
            <button
              type="button"
              onClick={prevStep}
              aria-label="Previous step"
              className="w-9 h-9 -ml-2 flex items-center justify-center text-neutral-800 hover:text-neutral-950 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.4]" />
            </button>
          ) : (
            <div className="w-9 h-9 -ml-2" />
          )}

          <h3 className="font-secondary font-bold text-base sm:text-lg text-neutral-900 text-center tracking-tight">
            {getStepTitle()}
          </h3>

          <button
            type="button"
            onClick={closeCheckout}
            aria-label="Close"
            className="w-9 h-9 -mr-2 flex items-center justify-center text-neutral-700 hover:text-neutral-950 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[2.2]" />
          </button>
        </div>

        {/* ─── Scrollable Step Body ─────────────────────────────── */}
        <div
          data-lenis-prevent
          onWheel={(e) => e.stopPropagation()}
          className="px-6 pb-6 pt-2 overflow-y-auto flex-1 font-secondary custom-scrollbar overscroll-contain touch-pan-y"
        >
          {currentStep === "ORDER_TYPE" && <Step1OrderType />}
          {currentStep === "DELIVERY_SLOT" && <Step2DeliverySlot />}
          {currentStep === "AUTH_LOGIN" && <Step3CustomerAuth />}
          {currentStep === "USER_DETAILS" && <Step4AddressDetails />}
          {currentStep === "PAYMENT" && <Step5PaymentReview />}
          {currentStep === "ORDER_SUCCESS" && <Step6OrderSuccess />}
        </div>
      </div>
    </div>
  );
}
