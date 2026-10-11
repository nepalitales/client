import React from "react";
import Image from "next/image";

export function HeroSection() {
  return (
    <section
      id="hero"
      aria-label="Hero Section"
      className="w-full bg-white relative overflow-hidden pt-6 pb-10 sm:pt-8 sm:pb-14 lg:pt-10 lg:pb-16"
    >
      <div className="figma-container relative">
        {/* Main Hero Container */}
        <div className="relative min-h-[460px] sm:min-h-[520px] md:min-h-[580px] lg:min-h-[620px] xl:min-h-[680px] flex flex-col justify-between">
          
          {/* ─── Top-Left Content Block ─────────────────────────────────── */}
          <div className="relative z-10 max-w-[340px] sm:max-w-[380px] lg:max-w-[420px] pt-2 sm:pt-4">
            <h1 className="font-secondary font-bold text-3xl sm:text-4xl md:text-5xl lg:text-[54px] xl:text-[60px] text-neutral-950 tracking-tight leading-[1.08]">
              Authentic Momo
            </h1>
            <p className="font-secondary text-neutral-400 font-normal text-sm sm:text-base md:text-lg tracking-wide mt-2">
              /स्वादिष्ट : मोमो /
            </p>
            <p className="font-secondary text-neutral-600 font-normal text-xs sm:text-sm md:text-base leading-relaxed mt-4 sm:mt-5 max-w-[260px] sm:max-w-[300px]">
              Something that&apos;ll make you say best momo you have ever had
            </p>
          </div>

          {/* ─── Center Visual (Momo with Chopsticks) ─────────────────── */}
          <div className="my-6 lg:my-0 lg:absolute lg:inset-0 flex items-center justify-center pointer-events-none z-0">
            <div className="w-full max-w-[320px] sm:max-w-[440px] md:max-w-[560px] lg:max-w-[680px] xl:max-w-[780px] transition-transform duration-700 ease-out hover:scale-[1.015]">
              <Image
                src="/assets/herosection/hero-img.webp"
                alt="Authentic Nepali Momo held with wooden chopsticks"
                width={3620}
                height={2808}
                priority
                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 70vw, 780px"
                className="w-full h-auto object-contain select-none"
              />
            </div>
          </div>

          {/* ─── Bottom-Right Featured Tag ─────────────────────────────── */}
          <div className="relative z-10 flex justify-end self-end text-right pb-2 sm:pb-4">
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
