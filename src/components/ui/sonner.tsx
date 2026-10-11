"use client";

import React from "react";
import {
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Info,
  Loader2,
  X,
  ShoppingBag,
} from "lucide-react";
import { Toaster as Sonner, toast as sonnerToast, type ToasterProps } from "sonner";

export const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      position="top-center"
      className="toaster group font-secondary z-[9999]"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-neutral-900 group-[.toaster]:border group-[.toaster]:border-neutral-200/90 group-[.toaster]:shadow-[0_16px_40px_rgba(0,0,0,0.12)] group-[.toaster]:rounded-2xl group-[.toaster]:p-4 group-[.toaster]:gap-3.5 group-[.toaster]:font-secondary",
          title: "font-secondary font-bold text-sm text-neutral-900 tracking-tight",
          description: "font-secondary text-xs text-neutral-600 font-medium leading-relaxed mt-0.5",
          actionButton:
            "font-secondary bg-[#D92121] text-white hover:bg-[#b81b1b] rounded-xl text-xs font-semibold px-3 py-1.5 transition-all shadow-sm",
          cancelButton:
            "font-secondary bg-neutral-100 text-neutral-700 hover:bg-neutral-200 rounded-xl text-xs font-semibold px-3 py-1.5 transition-all",
          closeButton:
            "text-neutral-400 hover:text-neutral-900 bg-white border border-neutral-200 rounded-full hover:bg-neutral-50 transition-colors",
          error:
            "group-[.toaster]:!border-red-200 group-[.toaster]:!bg-white group-[.toaster]:shadow-red-500/10",
          success:
            "group-[.toaster]:!border-emerald-200 group-[.toaster]:!bg-white group-[.toaster]:shadow-emerald-500/10",
          warning:
            "group-[.toaster]:!border-amber-200 group-[.toaster]:!bg-white group-[.toaster]:shadow-amber-500/10",
          info:
            "group-[.toaster]:!border-neutral-200 group-[.toaster]:!bg-white",
        },
      }}
      icons={{
        success: (
          <div className="w-8 h-8 rounded-full bg-[#2B471F]/10 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4 text-[#2B471F]" />
          </div>
        ),
        info: (
          <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center shrink-0">
            <Info className="w-4 h-4 text-neutral-800" />
          </div>
        ),
        warning: (
          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-4 h-4 text-amber-700" />
          </div>
        ),
        error: (
          <div className="w-8 h-8 rounded-full bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
            <AlertCircle className="w-4 h-4 text-[#D92121]" />
          </div>
        ),
        loading: (
          <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center shrink-0">
            <Loader2 className="w-4 h-4 animate-spin text-[#D92121]" />
          </div>
        ),
      }}
      {...props}
    />
  );
};

// Re-export sonner toast
export const toast = sonnerToast;

/**
 * Custom branded toast for cart dish limits, crafted specifically to match
 * the Nepali Tales brand identity (warm crimson #D92121, rounded cards, clean typography).
 */
export const showDishLimitToast = (max: number = 15) => {
  return sonnerToast.custom(
    (id) => (
      <div className="w-full max-w-[390px] bg-white rounded-2xl border border-red-200 shadow-[0_16px_40px_rgba(217,33,33,0.14)] p-4 flex items-start gap-3.5 transition-all font-secondary pointer-events-auto">
        <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200/80 flex items-center justify-center shrink-0 text-[#D92121]">
          <ShoppingBag className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-sm text-neutral-900 tracking-tight">
              Order Limit Reached
            </h4>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-[#D92121] uppercase tracking-wider">
              {max} Max
            </span>
          </div>
          <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
            You can order at most <strong className="text-neutral-900 font-semibold">{max} dishes</strong> in a single order to ensure fresh handcrafted preparation.
          </p>
        </div>
        <button
          type="button"
          onClick={() => sonnerToast.dismiss(id)}
          aria-label="Dismiss notification"
          className="text-neutral-400 hover:text-neutral-700 p-1 rounded-lg transition-colors cursor-pointer shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    ),
    {
      id: "dish-limit-toast",
      duration: 3500,
    }
  );
};
