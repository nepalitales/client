import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
        <div className="relative flex flex-col lg:min-h-135 xl:min-h-150 2xl:min-h-165 lg:justify-between">
          
          {/* ─── 1. Momo Visual ───────────────────────────────────────── */}
          {/* Sticks to the black order window tab at pt-0 / top-0 */}
          <div className="order-1 lg:order-0 lg:absolute lg:top-0 lg:left-0 lg:right-0 flex justify-center pointer-events-none z-0 mt-0">
            <div className="w-full max-w-77.5 sm:max-w-105 md:max-w-130 lg:max-w-164 xl:max-w-188 2xl:max-w-204 transition-transform duration-700 ease-out hover:scale-[1.015]">
              <Image
                src="/assets/herosection/hero-img.webp"
                alt="Authentic Nepali Momo held with wooden chopsticks"
                width={3620}
                height={2808}
                priority
                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 70vw, (max-width: 1280px) 656px, (max-width: 1536px) 752px, 816px"
                className="w-full h-auto object-contain select-none"
              />
            </div>
          </div>

          {/* ─── 2. Main Heading Content Block ────────────────────────── */}
          {/* Mobile: order-2 (directly below the image)
              Desktop: lg:order-0 (positioned on the left) */}
          <div className="order-2 lg:order-0 relative z-10 max-w-85 sm:max-w-95 lg:max-w-105 mt-4 sm:mt-6 lg:mt-0 lg:pt-10 xl:pt-14">
            <h1 className="font-secondary font-bold text-3xl sm:text-4xl md:text-5xl lg:text-[52px] xl:text-[58px] text-neutral-950 tracking-tight leading-[1.08]">
              Authentic Momo
            </h1>
            <p className="font-secondary text-neutral-400 font-normal text-sm sm:text-base md:text-lg tracking-wide mt-1.5 sm:mt-2">
              /स्वादिष्ट : मोमो /
            </p>
            <p className="font-secondary text-neutral-600 font-normal text-xs sm:text-sm md:text-base leading-relaxed mt-3 sm:mt-4 max-w-70 sm:max-w-80">
              Something that&apos;ll make you say best MOMO you have ever had
            </p>
            <div className="mt-5 sm:mt-6">
              <Link
                href="/menu"
                className="bg-[#D92121] hover:bg-[#b81b1b] text-white font-secondary font-bold text-xs sm:text-sm uppercase tracking-wider px-6 sm:px-7 py-3 rounded-full transition-all duration-200 active:scale-95 shadow-sm inline-flex items-center gap-2 cursor-pointer select-none group"
              >
                <span>Explore Menu</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

          {/* ─── 3. Bottom Featured Tag ────────────────────────────────── */}
          {/* Mobile: order-3 (left-aligned under heading text)
              Desktop: lg:order-0 (aligned to bottom-right) */}
          <div className="order-3 lg:order-0 relative z-10 flex justify-start self-start text-left lg:justify-end lg:self-end lg:text-right mt-6 sm:mt-8 lg:mt-0 lg:pb-2 xl:pb-4">
            <a
              href="https://indianexpress.com/article/cities/mumbai/nepali-tales-thane-momos-prajakta-koli-masterchef-couple-10864209/lite/"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-block cursor-pointer hover:opacity-85 transition-opacity"
              aria-label="Read feature in The Indian Express (opens in a new tab)"
            >
              <p className="font-secondary text-xs sm:text-sm md:text-[15px] text-neutral-700 font-normal leading-tight">
                As featured in
              </p>
              <p className="font-secondary text-sm sm:text-base md:text-lg font-bold text-neutral-950 group-hover:text-accent-red leading-tight mt-0.5 sm:mt-1 tracking-tight transition-colors">
                The Indian Express
              </p>
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
