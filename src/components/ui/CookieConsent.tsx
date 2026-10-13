"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

const STORAGE_KEY = "nepali_tales_cookie_consent";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem(STORAGE_KEY);
      if (!consent) {
        // Small delay to ensure smooth initial page render
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, 600);
        return () => clearTimeout(timer);
      }
    } catch {
      // Fallback for private browsing environments
      setIsVisible(true);
    }
  }, []);

  const handleConsent = (choice: "accepted" | "declined") => {
    try {
      localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      // Ignore localStorage write error
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:right-auto sm:left-6 sm:bottom-6 z-50 sm:max-w-md md:max-w-lg">
      <aside
        aria-label="Cookie consent banner"
        className="w-full"
      >
          <div className="rounded-2xl border border-neutral-200/90 bg-white/95 backdrop-blur-md p-5 sm:p-6 shadow-xl transition-all">
            <div className="flex flex-col gap-4">
              <div className="space-y-1.5">
                <h2 className="font-secondary text-base sm:text-lg font-bold text-neutral-900">
                  Cookie Notice &amp; Privacy Preferences
                </h2>
                <p className="font-secondary text-sm leading-relaxed text-neutral-600">
                  We use cookies to ensure core website functionality, remember your
                  cart and ordering preferences, and analyze site performance. By
                  continuing, you can choose to accept or decline non-essential
                  cookies. Read our{" "}
                  <Link
                    href="/privacy-policy"
                    className="font-semibold text-[#D92121] underline hover:text-[#b81b1b]"
                  >
                    Privacy Policy
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/terms-and-conditions"
                    className="font-semibold text-[#D92121] underline hover:text-[#b81b1b]"
                  >
                    Terms & Conditions
                  </Link>{" "}
                  for complete details.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-3 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  font="secondary"
                  onClick={() => handleConsent("declined")}
                >
                  Decline
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  font="secondary"
                  onClick={() => handleConsent("accepted")}
                >
                  Accept Cookies
                </Button>
              </div>
            </div>
          </div>
        </aside>
    </div>
  );
}
