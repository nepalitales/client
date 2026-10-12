"use client";

import React from "react";
import { useCheckout } from "@/context/CheckoutContext";

export function Step1OrderType() {
  const { orderType, setOrderType, orderSettings, deliveryFee, nextStep } = useCheckout();

  const isDeliveryAvailable = orderSettings.deliveryEnabled;
  const isPickupAvailable = orderSettings.pickupEnabled;

  return (
    <div className="flex flex-col min-h-95 justify-between pt-4 pb-2">
      {/* ─── Center Content (No 3D icons or illustrations) ─────── */}
      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
        <div className="space-y-2 max-w-xs mx-auto">
          <h4 className="font-secondary font-bold text-lg sm:text-xl text-neutral-900 leading-snug">
            How would you like to receive your order?
          </h4>
          <p className="text-xs text-neutral-500 font-medium">
            {orderType === "delivery"
              ? "Note : Delivery fee calculated separately."
              : "Note : Collect directly from our Thane cloud kitchen."}
          </p>
        </div>

        {/* ─── Pickup / Delivery Pill Buttons ─────────────────── */}
        <div className="w-full max-w-xs grid grid-cols-2 gap-3 pt-2">
          {/* Pickup Button */}
          <button
            type="button"
            disabled={!isPickupAvailable}
            onClick={() => isPickupAvailable && setOrderType("pickup")}
            className={`py-3 px-4 rounded-full text-sm font-bold tracking-wide transition-all select-none cursor-pointer ${
              orderType === "pickup"
                ? "bg-[#D92121] text-white shadow-sm"
                : "bg-white text-[#D92121] border border-[#D92121] hover:bg-red-50/50"
            } ${!isPickupAvailable ? "opacity-40 cursor-not-allowed" : "active:scale-[0.98]"}`}
          >
            Pickup
          </button>

          {/* Delivery Button */}
          <button
            type="button"
            disabled={!isDeliveryAvailable}
            onClick={() => isDeliveryAvailable && setOrderType("delivery")}
            className={`py-3 px-4 rounded-full text-sm font-bold tracking-wide transition-all select-none cursor-pointer ${
              orderType === "delivery"
                ? "bg-[#D92121] text-white shadow-sm"
                : "bg-white text-[#D92121] border border-[#D92121] hover:bg-red-50/50"
            } ${!isDeliveryAvailable ? "opacity-40 cursor-not-allowed" : "active:scale-[0.98]"}`}
          >
            Delivery
          </button>
        </div>

        {/* ─── Selected Option Detail Summary ───────────────────── */}
        <div className="w-full bg-neutral-50 border border-neutral-200/70 rounded-xl p-4 text-left text-xs space-y-1.5">
          {orderType === "delivery" ? (
            <>
              <div className="flex items-center justify-between font-semibold text-neutral-900">
                <span>Doorstep Delivery (All over Mumbai)</span>
                <span className="text-[#D92121] font-bold">Borzo Porter</span>
              </div>
              <p className="text-neutral-500 leading-relaxed text-[11px]">
                Dispatched fresh all over Mumbai via Borzo porter service. Delivery fee calculated separately as per actual distance.
              </p>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between font-semibold text-neutral-900">
                <span>Self-Pickup / Takeaway</span>
                <span className="text-emerald-600 font-bold uppercase">Free (₹0)</span>
              </div>
              <p className="text-neutral-500 leading-relaxed text-[11px]">
                Collect hot from our cloud kitchen at Metropolis Rivera, Shop No 10, Kasarvadavali, Opp to Laxmi Narayan Mandir, 400615.
              </p>
            </>
          )}
        </div>
      </div>

      {/* ─── Bottom Continue Action Button & Disclaimer ────────── */}
      <div className="pt-4 w-full space-y-2">
        <button
          type="button"
          onClick={nextStep}
          className="w-full bg-[#D92121] hover:bg-[#b81b1b] text-white font-secondary font-bold py-3.5 px-6 rounded-full text-sm sm:text-base tracking-wide transition-all shadow-sm active:scale-[0.98] cursor-pointer"
        >
          Continue
        </button>
        <p className="text-[10px] text-neutral-400 leading-tight text-center px-1">
          * Disclaimer: All items are prepared on 1-day advance pre-order. Food prepared with MSG for authentic flavor. Approved refunds credited within 3–5 working days.
        </p>
      </div>
    </div>
  );
}
