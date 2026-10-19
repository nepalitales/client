"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
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

export function FreshOutOfKitchenSection() {
  const [orderWindows, setOrderWindows] = useState<OrderWindowDayConfig[]>([]);
  const [holidays, setHolidays] = useState<HolidayItem[]>([]);
  const [weeklyOff, setWeeklyOff] = useState<string[]>([]);

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

        const [windowsRes, holidaysRes, weeklyOffRes] = await Promise.all([
          getClientOrderWindows(force),
          getClientHolidays(force),
          getClientWeeklyOff(force),
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
        console.warn("[FreshOutOfKitchenSection] Could not fetch banner data:", err);
      }
    };

    // Initial mount reuses cached config snapshot instead of busting cache
    fetchBannerData(false);

    const unsubscribe = subscribeToLiveCatalogUpdates(() => {
      fetchBannerData(true);
    });

    const handleFocus = () => {
      fetchBannerData(true);
    };
    window.addEventListener("focus", handleFocus);

    return () => {
      isMounted = false;
      unsubscribe();
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const bannerText = formatOrderWindowBannerText(orderWindows, holidays, weeklyOff);

  return (
    <section
      id="fresh-out-of-kitchen"
      className="w-full bg-white py-12 sm:py-16 lg:py-20 overflow-hidden"
    >
      <div className="figma-container">

        {/* ─── Headline: Clean Text Without Inline Food Images ──────── */}
        <h2 className="text-center font-chunko text-[#D92121] tracking-[0.04em] uppercase text-2xl sm:text-4xl md:text-5xl lg:text-[54px] leading-tight sm:leading-tight max-w-4xl mx-auto select-none">
          <div>WHERE GREAT FOOD</div>
          <div className="mt-1 sm:mt-2">BRINGS PEOPLE TOGETHER</div>
        </h2>

        {/* ─── Order Window Announcement Bar (Dynamically from Server) ─ */}
        <div data-nosnippet className="mt-8 sm:mt-10 max-w-3xl mx-auto border-t border-b border-neutral-200/90 py-3 sm:py-3.5 px-4 text-center select-none">
          <p className="font-secondary font-black text-xs sm:text-sm lg:text-base tracking-wider text-neutral-900 uppercase leading-relaxed">
            {bannerText || "ORDER WINDOW · MON–SAT · 2 PM–4 PM · WE CLOSE ON MONDAYS SO THE ORDERING WINDOW IS CLOSED ON SUNDAYS · FOR TUESDAY'S ORDER, BOOK ON MONDAYS (ORDER WINDOW OPEN 2 PM–4 PM) & HOLIDAYS"}
          </p>
        </div>

        {/* ─── Explore Menu Capsule Button (Red Pill matching Order Buttons) ──── */}
        <div className="flex justify-center mt-7 sm:mt-9">
          <Link
            href="/menu"
            className="bg-[#D92121] hover:bg-[#b81b1b] text-white font-secondary font-medium text-sm sm:text-base px-8 sm:px-10 py-2.5 sm:py-3 rounded-full transition-all duration-200 active:scale-95 shadow-xs inline-flex items-center justify-center cursor-pointer select-none"
          >
            Explore Menu
          </Link>
        </div>
      </div>
    </section>
  );
}
