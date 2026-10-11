import React from "react";
import Image from "next/image";

export function HeroSection() {
  return (
    <section
      id="hero"
      aria-label="Hero Section"
      className="w-full bg-white relative overflow-hidden pt-0 pb-8 sm:pb-12 lg:pb-16"
    >
      <div className="figma-container relative">
        {/* Main Hero Container:
            On mobile (< lg): flex-col with image on top (order-1) sticking to the banner,
            and all text underneath (order-2 and order-3).
            On desktop (lg+): relative container with image absolute top-0 sticking to the banner,
            and text flanking left and bottom-right. */}
        <div className="relative flex flex-col lg:min-h-[580px] xl:min-h-[640px] lg:justify-between">
          
          {/* ─── 1. Momo Visual ───────────────────────────────────────── */}
          {/* Sticks to the black order window tab at pt-0 / top-0 */}
          <div className="order-1 lg:order-none lg:absolute lg:top-0 lg:left-0 lg:right-0 flex justify-center pointer-events-none z-0 mt-0">
            <div className="w-full max-w-[310px] sm:max-w-[420px] md:max-w-[520px] lg:max-w-[680px] xl:max-w-[760px] transition-transform duration-700 ease-out hover:scale-[1.015]">
              <Image
                src="/assets/herosection/hero-img.webp"
                alt="Authentic Nepali Momo held with wooden chopsticks"
                width={3620}
                height={2808}
                priority
                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 70vw, 760px"
                className="w-full h-auto object-contain select-none"
              />
            </div>
          </div>

          {/* ─── 2. Main Heading Content Block ────────────────────────── */}
          {/* Mobile: order-2 (directly below the image)
              Desktop: lg:order-none (positioned on the left) */}
          <div className="order-2 lg:order-none relative z-10 max-w-[340px] sm:max-w-[380px] lg:max-w-[420px] mt-4 sm:mt-6 lg:mt-0 lg:pt-10 xl:pt-14">
            <h1 className="font-secondary font-bold text-3xl sm:text-4xl md:text-5xl lg:text-[52px] xl:text-[58px] text-neutral-950 tracking-tight leading-[1.08]">
              Authentic Momo
            </h1>
            <p className="font-secondary text-neutral-400 font-normal text-sm sm:text-base md:text-lg tracking-wide mt-1.5 sm:mt-2">
              /स्वादिष्ट : मोमो /
            </p>
            <p className="font-secondary text-neutral-600 font-normal text-xs sm:text-sm md:text-base leading-relaxed mt-3 sm:mt-4 max-w-[280px] sm:max-w-[320px]">
              Something that&apos;ll make you say best momo you have ever had
            </p>
          </div>

          {/* ─── 3. Bottom-Right Featured Tag ──────────────────────────── */}
          {/* Mobile: order-3 (at the bottom of the section)
              Desktop: lg:order-none (aligned to bottom-right) */}
          <div className="order-3 lg:order-none relative z-10 flex justify-end self-end text-right mt-6 sm:mt-8 lg:mt-0 lg:pb-2 xl:pb-4">
            <div>
              <p className="font-secondary text-xs sm:text-sm md:text-[15px] text-neutral-700 font-normal leading-tight">
                As featured in
              </p>
              <p className="font-secondary text-sm sm:text-base md:text-lg font-bold text-neutral-950 leading-tight mt-0.5 sm:mt-1 tracking-tight">
                The Indian Express
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
