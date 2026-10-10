"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { X, AlertTriangle } from "lucide-react";

const STORAGE_KEY = "nt_health_advisory_dismissed";

export function HealthAdvisoryModal() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only access sessionStorage on the client side
    try {
      const isDismissed = sessionStorage.getItem(STORAGE_KEY);
      if (!isDismissed) {
        setIsVisible(true);
      }
    } catch {
      // If sessionStorage is restricted (e.g., privacy mode), show advisory
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    try {
      sessionStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // Ignore quota or private-mode exceptions
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="health-advisory-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      {/* 
        Modal Container:
        Intentionally does NOT dismiss on backdrop click as per requirements:
        "it will not go until they press the cross on the pop up"
      */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Top Accent Strip */}
        <div className="h-1.5 w-full bg-[#D92121]" />

        {/* Modal Close Cross Button (Primary dismiss action) */}
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-900 transition-colors flex items-center justify-center cursor-pointer select-none active:scale-95"
          aria-label="Close health advisory"
        >
          <X className="w-5 h-5 stroke-[2.2]" />
        </button>

        {/* Modal Content Body */}
        <div className="p-6 sm:p-8">
          {/* Header Icon + Title */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#D92121] flex items-center justify-center shrink-0 border border-red-100">
              <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
            </div>

            <div className="pr-6">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#D92121] bg-red-50 border border-red-100 px-2 py-0.5 rounded inline-block mb-1">
                Mandatory Statutory Notice
              </span>
              <h2
                id="health-advisory-title"
                className="font-secondary font-black text-xl sm:text-2xl text-neutral-950 leading-tight"
              >
                Health & Dietary Advisory
              </h2>
            </div>
          </div>

          {/* Highlighted Warning Box */}
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50/70 p-4">
            <p className="font-secondary font-bold text-sm sm:text-base text-neutral-950 uppercase leading-snug">
              This product contains added Monosodium Glutamate (MSG). NOT
              RECOMMENDED FOR INFANTS BELOW 12 MONTHS AND PREGNANT WOMEN.
            </p>
          </div>

          {/* Regulatory & Safety Context */}
          <p className="mt-4 font-secondary text-xs sm:text-sm text-neutral-600 leading-relaxed">
            In compliance with Food Safety and Standards Authority of India
            (FSSAI) regulations, we transparently declare the presence of MSG in
            our authentic seasoned momos and broths. Individuals with glutamate
            sensitivities, pregnant women, and parents are advised to review this
            prior to consumption.
          </p>

          {/* Action Footer */}
          <div className="mt-6 pt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <Link
              href="/allergen-advisory"
              onClick={handleDismiss}
              className="text-xs sm:text-sm font-secondary font-semibold text-neutral-600 hover:text-[#D92121] underline transition-colors"
            >
              View Full Allergen Advisory
            </Link>

            <button
              type="button"
              onClick={handleDismiss}
              className="w-full sm:w-auto bg-[#D92121] hover:bg-[#b81b1b] text-white font-secondary font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-full transition-all active:scale-95 shadow-sm cursor-pointer select-none"
            >
              I Understand & Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
