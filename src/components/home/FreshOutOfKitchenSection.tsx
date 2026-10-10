"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getOrderWindowStatus } from "@/lib/api";

export function FreshOutOfKitchenSection() {
  const [windowText, setWindowText] = useState<string>("06:00 AM-08:00 AM");

  useEffect(() => {
    let isMounted = true;
    getOrderWindowStatus()
      .then((status) => {
        if (!isMounted || !status?.activeWindows?.length) return;
        const w = status.activeWindows[0];
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
        setWindowText(`${formatH(w.start)}-${formatH(w.end)}`);
      })
      .catch(() => {
        // Fallback to static design default
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section
      id="fresh-out-of-kitchen"
      className="w-full bg-white py-12 sm:py-16 lg:py-20 overflow-hidden"
    >
      <div className="figma-container">

        {/* ─── Block 2: Headline with Inline Food Images ────────────── */}
        <div className="text-center font-chunko text-[#D92121] tracking-[0.04em] uppercase text-2xl sm:text-4xl md:text-5xl lg:text-[54px] leading-tight sm:leading-tight max-w-4xl mx-auto select-none">
          {/* Line 1: WHERE [momo] GREAT FOOD */}
          <div className="flex items-center justify-center flex-wrap gap-x-2 sm:gap-x-3 gap-y-1">
            <span>WHERE</span>
            <span className="inline-flex items-center justify-center h-8 sm:h-12 lg:h-14">
              <Image
                src="/assets/fresh-out-of-kitchen/momo.png"
                alt="Fresh Steamed Momo"
                width={80}
                height={55}
                priority
                className="h-7 sm:h-11 lg:h-13 w-auto object-contain inline-block align-middle pointer-events-none"
              />
            </span>
            <span>GREAT FOOD</span>
          </div>

          {/* Line 2: BRINGS PEOPLE [shaphaley] TOGETHER */}
          <div className="flex items-center justify-center flex-wrap gap-x-2 sm:gap-x-3 gap-y-1 mt-1 sm:mt-2">
            <span>BRINGS PEOPLE</span>
            <span className="inline-flex items-center justify-center h-8 sm:h-12 lg:h-14">
              <Image
                src="/assets/fresh-out-of-kitchen/shaphaley.png"
                alt="Crispy Shaphaley with Chutneys"
                width={100}
                height={55}
                priority
                className="h-7 sm:h-11 lg:h-13 w-auto object-contain inline-block align-middle pointer-events-none"
              />
            </span>
            <span>TOGETHER</span>
          </div>
        </div>

        {/* ─── Order Window Announcement Bar ────────────────────────── */}
        <div className="mt-8 sm:mt-10 max-w-xl mx-auto border-t border-b border-neutral-200/90 py-3 sm:py-3.5 px-4 text-center select-none">
          <p className="font-secondary font-black text-xs sm:text-sm lg:text-base tracking-wider text-neutral-900 uppercase">
            ORDER WINDOW • {windowText}
          </p>
        </div>

        {/* ─── Explore Menu Capsule Button (Red with Black Border & Pop Shadow) ──── */}
        <div className="flex justify-center mt-7 sm:mt-9">
          <Link
            href="/menu"
            className="bg-[#D92121] hover:bg-[#b81b1b] text-white border-2 border-black rounded-full px-8 sm:px-10 py-3 sm:py-3.5 font-secondary font-bold text-sm sm:text-base tracking-wide transition-all duration-200 shadow-[2px_3px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#000000] inline-flex items-center justify-center cursor-pointer select-none"
          >
            Explore Menu
          </Link>
        </div>
      </div>
    </section>
  );
}
