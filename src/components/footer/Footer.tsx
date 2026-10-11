"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { getClientOrderWindows, type OrderWindowDayConfig } from "@/lib/api";

function InstagramIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function YoutubeIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function formatHour(timeStr: string): string {
  const [hStr, mStr] = timeStr.split(":");
  let h = parseInt(hStr, 10);
  const m = parseInt(mStr || "0", 10);
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return m > 0 ? `${h}:${mStr} ${ampm}` : `${h} ${ampm}`;
}

export function Footer() {
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
        console.warn("[Footer] Could not fetch order windows:", err);
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

  // Compute dynamic Ordering Time rows strictly from server order windows
  const openingHoursRows = useMemo(() => {
    if (!orderWindows || orderWindows.length === 0) {
      return [];
    }

    const dayNameMap: Record<string, { short: string; full: string }> = {
      sunday: { short: "Sun", full: "Sunday" },
      monday: { short: "Mon", full: "Monday" },
      tuesday: { short: "Tue", full: "Tuesday" },
      wednesday: { short: "Wed", full: "Wednesday" },
      thursday: { short: "Thu", full: "Thursday" },
      friday: { short: "Fri", full: "Friday" },
      saturday: { short: "Sat", full: "Saturday" },
    };

    const daysOrder = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];

    const windowMap = new Map(orderWindows.map((w) => [w.day, w]));
    const closedDays: string[] = [];
    const openDaysList: Array<{ day: string; timeText: string }> = [];

    for (const d of daysOrder) {
      const config = windowMap.get(d as any);
      if (!config || !config.enabled || !config.windows || config.windows.length === 0) {
        closedDays.push(d);
      } else {
        const firstWin = config.windows[0];
        const timeText = `${formatHour(firstWin.start)} - ${formatHour(firstWin.end)}`;
        openDaysList.push({ day: d, timeText });
      }
    }

    const rows: Array<{ label: string; value: string; closed: boolean }> = [];

    // Group open days if they share identical timeText
    if (openDaysList.length > 0) {
      let currentGroup: { start: string; end: string; timeText: string } = {
        start: openDaysList[0].day,
        end: openDaysList[0].day,
        timeText: openDaysList[0].timeText,
      };

      for (let i = 1; i < openDaysList.length; i++) {
        const item = openDaysList[i];
        if (item.timeText === currentGroup.timeText) {
          currentGroup.end = item.day;
        } else {
          const label =
            currentGroup.start === currentGroup.end
              ? dayNameMap[currentGroup.start]?.full || currentGroup.start
              : `${dayNameMap[currentGroup.start]?.short || currentGroup.start} - ${
                  dayNameMap[currentGroup.end]?.short || currentGroup.end
                }`;
          rows.push({ label, value: currentGroup.timeText, closed: false });
          currentGroup = { start: item.day, end: item.day, timeText: item.timeText };
        }
      }

      const label =
        currentGroup.start === currentGroup.end
          ? dayNameMap[currentGroup.start]?.full || currentGroup.start
          : `${dayNameMap[currentGroup.start]?.short || currentGroup.start} - ${
              dayNameMap[currentGroup.end]?.short || currentGroup.end
            }`;
      rows.push({ label, value: currentGroup.timeText, closed: false });
    }

    // Add closed days
    if (closedDays.length > 0) {
      if (closedDays.length === 1) {
        rows.push({
          label: dayNameMap[closedDays[0]]?.full || "Monday",
          value: "Closed",
          closed: true,
        });
      } else {
        const closedLabels = closedDays
          .map((d) => dayNameMap[d]?.short || d)
          .join(", ");
        rows.push({
          label: closedLabels,
          value: "Closed",
          closed: true,
        });
      }
    }

    return rows;
  }, [orderWindows]);

  return (
    <footer className="w-full bg-white text-neutral-900 border-t border-neutral-100 font-secondary">
      {/* ─── Upper Footer: Links, Hours, Address & Socials ──────── */}
      <div className="figma-container pt-14 sm:pt-18 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Column 1: Address & Social Media Links */}
          <div className="lg:col-span-4 space-y-4">
            <div>
              <span className="font-primary text-2xl font-black uppercase tracking-[0.04em] text-[#D92121]">
                {siteConfig.name}
              </span>
              <p className="text-xs text-neutral-500 font-secondary mt-1">
                Authentic Nepali Cloud Kitchen • Thane
              </p>
            </div>

            {/* Address */}
            <div className="pt-1 text-sm text-neutral-600 font-secondary leading-relaxed">
              <p>Metropolis Rivera, Shop No 10, Kasarvadavali,</p>
              <p>Opp to Laxmi Narayan Mandir, Thane West, 400615</p>
            </div>

            {/* Social Media Links: Instagram & YouTube (Icons Only) */}
            <div className="pt-1 flex items-center gap-3">
              <a
                href={siteConfig.contact.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Nepali Tales on Instagram"
                className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-700 hover:text-brand-red hover:border-brand-red/40 hover:bg-neutral-50 transition-all cursor-pointer"
              >
                <InstagramIcon className="w-5 h-5 text-brand-red" />
              </a>

              <a
                href={siteConfig.contact.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Subscribe to Nepali Tales on YouTube"
                className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-700 hover:text-brand-red hover:border-brand-red/40 hover:bg-neutral-50 transition-all cursor-pointer"
              >
                <YoutubeIcon className="w-5 h-5 text-brand-red" />
              </a>
            </div>
          </div>

          {/* Column 2: Ordering Time (Dynamic from Server) */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="font-bold text-neutral-950 text-xl tracking-tight">
              Ordering Time
            </h3>

            <div className="space-y-1.5 text-neutral-600 font-secondary text-sm sm:text-base leading-relaxed">
              {loading ? (
                <div className="space-y-2 py-1 animate-pulse">
                  <div className="h-4 bg-neutral-100 rounded w-40" />
                  <div className="h-4 bg-neutral-100 rounded w-28" />
                </div>
              ) : openingHoursRows.length > 0 ? (
                openingHoursRows.map((row, idx) => (
                  <p key={idx} className="flex items-center gap-2">
                    <span className="font-normal text-neutral-700">{row.label}</span>
                    <span className="text-neutral-400 font-light">:</span>
                    <span
                      className={
                        row.closed
                          ? "text-neutral-500 font-normal"
                          : "text-neutral-900 font-semibold"
                      }
                    >
                      {row.value}
                    </span>
                  </p>
                ))
              ) : (
                <p className="text-neutral-500 text-sm">Schedule unavailable</p>
              )}
            </div>
          </div>

          {/* Column 3: Navigation Links */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="font-bold text-neutral-950 text-xl tracking-tight">
              Navigation
            </h3>
            <ul className="space-y-2 text-sm text-neutral-600 font-secondary">
              <li>
                <Link
                  href="/"
                  className="hover:text-brand-red transition-colors inline-block"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/#menu-grid-top"
                  className="hover:text-brand-red transition-colors inline-block"
                >
                  Menu
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-brand-red transition-colors inline-block"
                >
                  About Us
                </Link>
              </li>
              <li>
                <a
                  href={siteConfig.location.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-red transition-colors inline-block"
                >
                  Google Maps
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal & Policy Links */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="font-bold text-neutral-950 text-xl tracking-tight">
              Legal
            </h3>
            <ul className="space-y-2 text-sm text-neutral-600 font-secondary">
              <li>
                <Link
                  href="/terms-and-conditions"
                  className="hover:text-brand-red transition-colors inline-block"
                >
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="hover:text-brand-red transition-colors inline-block"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/cancellation-policy"
                  className="hover:text-brand-red transition-colors inline-block"
                >
                  Cancellation &amp; Refund Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/delivery-policy"
                  className="hover:text-brand-red transition-colors inline-block"
                >
                  Delivery Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/allergen-advisory"
                  className="hover:text-brand-red transition-colors inline-block"
                >
                  Allergen Advisory
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ─── Footer MOMO Graphic & Bottom Bar ──────────────────── */}
      <div className="figma-container pb-6">
        {/* MOMO Graphic */}
        <div className="w-full select-none overflow-hidden mb-3 sm:mb-4">
          <img
            src="/assets/footer/momo-footer.svg"
            alt="MOMO"
            width={1249}
            height={330}
            className="w-full h-auto object-contain block pointer-events-none select-none"
          />
        </div>

        {/* ─── Bottom Bar ────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-neutral-800 tracking-normal pt-1">
          {/* Left: Copyright */}
          <p className="font-normal select-none">
            &copy;NepaliTales. All Rights Reserved.
          </p>

          {/* Right: Credits / Attribution */}
          <p className="font-normal">
            Designed &amp; Developed by{" "}
            <a
              href="https://ankitbhavarthe.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-neutral-950 hover:text-brand-red transition-colors"
            >
              Ankit Bhavarthe
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
