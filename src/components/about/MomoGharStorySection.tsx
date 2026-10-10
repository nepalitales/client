"use client";

import React from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

export function MomoGharStorySection() {
  return (
    <section className="w-full bg-white py-8 lg:py-14 overflow-hidden">
      <div className="figma-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* ─── Left Column: Story & Narrative ───────────────────── */}
          <div className="lg:col-span-5 flex flex-col items-start justify-center">
            {/* Heading */}
            <div className="space-y-1">
              <span className="font-tertiary text-4xl sm:text-5xl lg:text-[54px] text-neutral-900 block leading-tight tracking-normal">
                Momo ghar to
              </span>
              <h2 className="font-secondary text-3xl sm:text-4xl lg:text-[46px] font-black uppercase tracking-[0.02em] text-neutral-950 leading-tight">
                NEPALI TALES
              </h2>
            </div>

            {/* Paragraph Body */}
            <p className="font-secondary text-sm sm:text-[15px] lg:text-base text-neutral-600 leading-relaxed max-w-md sm:max-w-lg mt-5 sm:mt-6">
              What started in family kitchens in Jaigaon became a dream of
              bringing that same simple, soulful taste to every plate. We tried,
              failed, moved cities, and started again. From Momo Ghar to supper
              clubs and countless early mornings, every setback taught us
              something. Today, Nepali Tales is built on that same belief - fresh
              food, honest flavors, and never giving up on what we love.
            </p>

            {/* Plain Red Rounded Button linking to Indian Express article */}
            <div className="mt-6 sm:mt-8">
              <a
                href="https://indianexpress.com/article/cities/mumbai/nepali-tales-thane-momos-prajakta-koli-masterchef-couple-10864209/lite/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#D92121] hover:bg-[#b81b1b] text-white px-6 py-2.5 rounded-full font-secondary font-medium text-sm transition-colors cursor-pointer select-none"
                aria-label="Read our story on Indian Express (opens in a new tab)"
              >
                <span>Know More</span>
                <ArrowUpRight className="w-4 h-4 stroke-[2.2]" />
              </a>
            </div>
          </div>

          {/* ─── Right Column: Unified Card Group Graphic ─────────── */}
          <div className="lg:col-span-7 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[500px] sm:max-w-[540px] lg:max-w-[580px]">
              <Image
                src="/assets/about/momoghar-img.webp"
                alt="From Momo Ghar to Nepali Tales - Our journey illustrated"
                width={2750}
                height={3121}
                priority
                className="w-full h-auto object-contain pointer-events-none select-none"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
