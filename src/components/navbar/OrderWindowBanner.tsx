"use client";

import React, { useEffect, useState } from "react";
import {
  getClientOrderWindows,
  formatOrderWindowBannerText,
  type OrderWindowDayConfig,
} from "@/lib/api";

export function OrderWindowBanner() {
  const [orderWindows, setOrderWindows] = useState<OrderWindowDayConfig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getClientOrderWindows()
      .then((res) => {
        if (isMounted && res?.success && res.orderWindows) {
          setOrderWindows(res.orderWindows);
        }
      })
      .catch((err) => {
        console.warn("[OrderWindowBanner] Could not fetch order windows:", err);
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const bannerText = formatOrderWindowBannerText(orderWindows);

  if (!loading && !bannerText) {
    return null;
  }

  return (
    <div
      role="region"
      aria-label="Order Window Announcement"
      className="relative z-30 w-full bg-[#202124] text-white py-2.5 sm:py-3 px-3 sm:px-6 flex items-center justify-center text-center select-none shadow-sm"
    >
      {loading && !bannerText ? (
        <div className="h-3.5 sm:h-4 w-72 sm:w-96 bg-neutral-700/60 rounded animate-pulse" />
      ) : (
        <p className="font-secondary text-[10px] sm:text-xs md:text-sm font-semibold tracking-wider uppercase text-neutral-100 leading-tight">
          {bannerText}
        </p>
      )}
    </div>
  );
}
