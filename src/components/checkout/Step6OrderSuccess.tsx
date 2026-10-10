"use client";

import React, { useState } from "react";
import { useCheckout } from "@/context/CheckoutContext";
import { CheckCircle2, Copy, Check } from "lucide-react";

export function Step6OrderSuccess() {
  const { confirmedOrder, resetCheckout } = useCheckout();
  const [copied, setCopied] = useState(false);

  const orderId = confirmedOrder?.orderNumber || confirmedOrder?.id || "NT-78291";
  const customerName = confirmedOrder?.customerName || "Customer";
  const orderType = confirmedOrder?.orderType || "delivery";
  const dispatchDate = confirmedOrder?.dispatchDate || "Tomorrow";
  const dispatchSlot = confirmedOrder?.dispatchSlotLabel || "12:30 PM - 02:00 PM";
  const totalAmount = confirmedOrder?.totalAmount || 0;

  const handleCopyOrderId = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(orderId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col min-h-[380px] justify-between pt-2 pb-2 font-secondary text-center">
      <div className="space-y-5 pt-3">
        {/* Success Icon */}
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
          <CheckCircle2 className="w-9 h-9 stroke-[2.2]" />
        </div>

        <div className="space-y-1">
          <h4 className="font-secondary font-bold text-xl sm:text-2xl text-neutral-900">
            Order Confirmed!
          </h4>
          <p className="text-xs text-neutral-500 max-w-xs mx-auto">
            Thank you, {customerName}! Your order has been placed successfully.
          </p>
        </div>

        {/* Order Reference Box */}
        <div
          onClick={handleCopyOrderId}
          className="inline-flex items-center gap-2 bg-neutral-100 hover:bg-neutral-200/80 px-4 py-2 rounded-xl text-xs font-mono font-bold text-neutral-900 transition-colors cursor-pointer select-none"
        >
          <span>Order #{orderId}</span>
          <button type="button" title="Copy Order ID" className="text-neutral-500 hover:text-neutral-900">
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Summary Card */}
        <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200/80 text-left text-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-neutral-500">Order Mode:</span>
            <span className="font-bold text-neutral-900 capitalize">{orderType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Scheduled Date:</span>
            <span className="font-bold text-neutral-900">{dispatchDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Time Window:</span>
            <span className="font-bold text-neutral-900">{dispatchSlot}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-neutral-200 font-bold">
            <span className="text-neutral-900">Paid Amount:</span>
            <span className="text-[#D92121]">₹{totalAmount}</span>
          </div>
        </div>
      </div>

      {/* Done Button */}
      <div className="pt-6 w-full">
        <button
          type="button"
          onClick={resetCheckout}
          className="w-full bg-[#D92121] hover:bg-[#b81b1b] text-white font-secondary font-bold py-3.5 px-6 rounded-full text-sm sm:text-base tracking-wide transition-all shadow-sm active:scale-[0.98] cursor-pointer"
        >
          Done
        </button>
      </div>
    </div>
  );
}
