"use client";

import React, { useEffect, useState } from "react";
import {
  getClientConfig,
  getClientOrderWindows,
  getClientHolidays,
  getClientWeeklyOff,
  formatOrderWindowBannerText,
  subscribeToLiveCatalogUpdates,
  type OrderWindowDayConfig,
  type HolidayItem,
} from "@/lib/api";

export function OrderWindowBanner() {
  const [orderWindows, setOrderWindows] = useState<OrderWindowDayConfig[]>([]);
  const [holidays, setHolidays] = useState<HolidayItem[]>([]);
  const [weeklyOff, setWeeklyOff] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchBannerData = async (force = false) => {
      try {
        const config = await getClientConfig(force);
        if (!isMounted) return;
        if (config?.success) {
          if (config.orderWindows) setOrderWindows(config.orderWindows);
          if (config.holidays) setHolidays(config.holidays);
          if (config.weeklyOff) setWeeklyOff(config.weeklyOff);
          return;
        }

        // Fallback to individual endpoints if config endpoint is unavailable
        const [windowsRes, holidaysRes, weeklyOffRes] = await Promise.all([
          getClientOrderWindows(force),
          getClientHolidays(force),
          getClientWeeklyOff(),
        ]);
        if (!isMounted) return;
        if (windowsRes?.success && windowsRes.orderWindows) {
          setOrderWindows(windowsRes.orderWindows);
        }
        if (holidaysRes?.success && Array.isArray(holidaysRes.holidays)) {
          setHolidays(holidaysRes.holidays);
        }
        if (weeklyOffRes?.success && Array.isArray(weeklyOffRes.weeklyOff)) {
          setWeeklyOff(weeklyOffRes.weeklyOff);
        }
      } catch (err) {
        console.warn("[OrderWindowBanner] Could not fetch banner data:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Initial fetch using cached or consolidated config snapshot
    fetchBannerData(false);

    // Live update when admin adds or deletes holidays or changes schedule
    const unsubscribe = subscribeToLiveCatalogUpdates(() => {
      fetchBannerData(true);
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const bannerText = formatOrderWindowBannerText(orderWindows, holidays, weeklyOff);

  if (!loading && !bannerText) {
    return null;
  }

  return (
    <div
      role="region"
      aria-label="Order Window Announcement"
      data-nosnippet
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
