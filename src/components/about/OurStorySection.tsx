"use client";

import React from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/config/site";

export function OurStorySection() {
  return (
    <section className="w-full bg-white py-8 lg:py-14 overflow-hidden">
      <div className="figma-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
          {/* ─── Left Column (Desktop) / Main Stack (Mobile) ───────── */}
          <div className="lg:col-span-5 flex flex-col items-start justify-center">
            {/* 1. Heading */}
            <div className="space-y-1">
              <span className="font-tertiary text-4xl sm:text-5xl lg:text-[54px] text-neutral-900 block leading-tight tracking-normal">
                Our Story
              </span>
              <h1 className="font-secondary text-3xl sm:text-4xl lg:text-[46px] font-black uppercase tracking-[0.02em] text-neutral-950 leading-[1.0]">
                OF NEPALI
                <br />
                TALES
              </h1>
            </div>

            {/* 2. Mobile Image (Placed right under heading on mobile, hidden on lg+) */}
            <div className="block lg:hidden my-6 w-full max-w-[440px] mx-auto">
              <Image
                src="/assets/about/our-story-img.webp"
                alt="Our Story of Nepali Tales - Ashika and Dipesh journey"
                width={2620}
                height={2226}
                priority
                className="w-full h-auto object-contain pointer-events-none select-none"
              />
            </div>

            {/* 3. Paragraph Body */}
            <p className="font-secondary text-sm sm:text-[15px] lg:text-base text-neutral-600 leading-relaxed max-w-md sm:max-w-lg mt-0 lg:mt-6">
              Two people, one shared love for momo, and a dream that refused to
              stay down. From family kitchens in Jaigaon to countless fresh
              starts across cities, our journey has been anything but easy.
              Nepali Tales is our story, served one plate at a time.
            </p>

            {/* 4. Action Button */}
            <div className="mt-6 sm:mt-8">
              <a
                href={siteConfig.contact.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#D92121] hover:bg-[#b81b1b] text-white px-6 py-2.5 rounded-full font-secondary font-medium text-sm transition-colors cursor-pointer select-none"
              >
                <span>Visit Our Instagram</span>
                <ArrowUpRight className="w-4 h-4 stroke-[2.2]" />
              </a>
            </div>
          </div>

          {/* ─── Desktop Image (Hidden on mobile, displayed on lg+) ── */}
          <div className="hidden lg:flex lg:col-span-7 justify-end">
            <div className="relative w-full max-w-[500px] sm:max-w-[540px] lg:max-w-[580px]">
              <Image
                src="/assets/about/our-story-img.webp"
                alt="Our Story of Nepali Tales - Ashika and Dipesh journey"
                width={2620}
                height={2226}
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
