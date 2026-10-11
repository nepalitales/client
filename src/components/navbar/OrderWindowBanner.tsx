"use client";

import React, { useEffect, useState } from "react";
import {
  getClientOrderWindows,
  getClientHolidays,
  getOrderWindowBannerParts,
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

  const bannerParts = getOrderWindowBannerParts(orderWindows, holidays);
  const { scheduleText, closedText, holidayInfo, fullText } = bannerParts;

  if (!loading && !fullText) {
    return null;
  }

  return (
    <div
      role="region"
      aria-label="Order Window Announcement"
      className="relative z-30 w-full bg-[#202124] text-white py-2 sm:py-2.5 px-3 sm:px-6 flex items-center justify-center text-center select-none shadow-sm transition-all duration-300"
    >
      {loading && !fullText ? (
        <div className="h-3.5 sm:h-4 w-72 sm:w-96 bg-neutral-700/60 rounded animate-pulse" />
      ) : (
        <p className="font-secondary text-[10px] sm:text-xs md:text-sm font-semibold tracking-wider uppercase text-neutral-100 leading-tight flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
          {holidayInfo ? (
            <>
              <span>{scheduleText}</span>
              {closedText && (
                <>
                  <span className="text-neutral-500">·</span>
                  <span>{closedText}</span>
                </>
              )}
              <span className="text-neutral-500 hidden sm:inline">·</span>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] sm:text-xs font-bold tracking-wide transition-all ${
                  holidayInfo.isToday
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.25)]"
                    : "bg-white/10 text-neutral-200 border border-white/20"
                }`}
              >
                <span>{holidayInfo.isToday ? "⚠️" : "🗓️"}</span>
                <span>{holidayInfo.text}</span>
              </span>
            </>
          ) : (
            <span>{fullText}</span>
          )}
        </p>
      )}
    </div>
  );
}
