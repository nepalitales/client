"use client";

import React, { useEffect, useState } from "react";
import {
  getClientOrderWindows,
  getClientHolidays,
  formatOrderWindowBannerText,
  type OrderWindowDayConfig,
  type HolidayItem,
} from "@/lib/api";

export function OrderWindowBanner() {
  const [orderWindows, setOrderWindows] = useState<OrderWindowDayConfig[]>([]);
  const [holidays, setHolidays] = useState<HolidayItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    Promise.all([getClientOrderWindows(), getClientHolidays()])
      .then(([windowsRes, holidaysRes]) => {
        if (!isMounted) return;
        if (windowsRes?.success && windowsRes.orderWindows) {
          setOrderWindows(windowsRes.orderWindows);
        }
        if (holidaysRes?.success && holidaysRes.holidays) {
          setHolidays(holidaysRes.holidays);
        }
      })
      .catch((err) => {
        console.warn("[OrderWindowBanner] Could not fetch banner data:", err);
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

  const bannerText = formatOrderWindowBannerText(orderWindows, holidays);

  if (!loading && !bannerText) {
    return null;
  }

  return (
    <div
      role="region"
      aria-label="Order Window Announcement"
      className="relative z-30 w-full bg-[#202124] text-white py-2 sm:py-2.5 px-3 sm:px-6 flex items-center justify-center text-center select-none shadow-sm transition-all duration-300"
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
