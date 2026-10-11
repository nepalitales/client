"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  getClientOrderWindows,
  subscribeToLiveCatalogUpdates,
} from "@/lib/api";

export function FreshOutOfKitchenSection() {
  const [windowText, setWindowText] = useState<string>("");

  useEffect(() => {
    let isMounted = true;

    const fetchWindows = (force = false) => {
      getClientOrderWindows(force)
        .then((res) => {
          if (!isMounted || !res?.success || !res.orderWindows) return;
          const enabledDay = res.orderWindows.find(
            (d) => d.enabled && d.windows && d.windows.length > 0
          );
          if (enabledDay && enabledDay.windows.length > 0) {
            const w = enabledDay.windows[0];
            const formatH = (t: string) => {
              const [hStr, mStr] = t.split(":");
              let h = parseInt(hStr, 10);
              const m = parseInt(mStr || "0", 10);
              const ampm = h >= 12 ? "PM" : "AM";
              h = h % 12 || 12;
              const padH = h < 10 ? `0${h}` : `${h}`;
              const padM = m < 10 ? `0${m}` : `${m}`;
              return `${padH}:${padM} ${ampm}`;
            };
            setWindowText(`${formatH(w.start)} - ${formatH(w.end)}`);
          }
        })
        .catch((err) => {
          console.warn("[FreshOutOfKitchenSection] Could not fetch order windows:", err);
        });
    };

    fetchWindows(true);

    const unsubscribe = subscribeToLiveCatalogUpdates(() => {
      fetchWindows(true);
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

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
        <div className="mt-8 sm:mt-10 max-w-xl mx-auto border-t border-b border-neutral-200/90 py-3 sm:py-3.5 px-4 text-center select-none">
          <p className="font-secondary font-black text-xs sm:text-sm lg:text-base tracking-wider text-neutral-900 uppercase">
            ORDER WINDOW • {windowText || "02:00 PM - 04:00 PM"}
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
