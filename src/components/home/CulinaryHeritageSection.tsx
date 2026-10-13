import React from "react";
import Link from "next/link";
import { Sparkles, Utensils, HeartHandshake } from "lucide-react";
import { siteConfig } from "@/config/site";

export function CulinaryHeritageSection() {
  return (
    <section
      id="culinary-heritage"
      aria-label="Culinary Craft and Heritage"
      className="w-full bg-neutral-50/70 border-t border-b border-neutral-200/80 py-12 sm:py-16 lg:py-20 font-secondary"
    >
      <div className="figma-container">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="font-secondary font-bold text-xs sm:text-sm tracking-wider uppercase text-accent-red block">
            Himalayan Dumpling Craftsmanship
          </span>
          <h2 className="font-secondary font-black text-2xl sm:text-3xl lg:text-4xl text-neutral-950 tracking-tight leading-tight mt-1.5 sm:mt-2">
            The Craft &amp; Heritage of Nepali Tales
          </h2>
          <p className="mt-4 text-sm sm:text-base text-neutral-600 leading-relaxed">
            Nepali Tales is a specialized culinary kitchen born from family recipes along the Indo-Bhutan border,
            shaped by Momo Ghar and MasterChef India couple Ashika &amp; Dipesh. We believe authentic momo should never
            come from a frozen factory line, but should be hand-rolled fresh every morning and served with soulful broths.
          </p>
        </div>

        {/* 3 Heritage Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* 1. Daily Rolling & Clean Ingredients */}
          <article className="bg-white rounded-2xl border border-neutral-200/90 p-6 sm:p-7 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-red-100/80 text-accent-red flex items-center justify-center mb-4">
                <Utensils className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg sm:text-xl text-neutral-950 tracking-tight">
                Hand-Rolled Fresh Every Morning
              </h3>
              <p className="mt-3 text-sm text-neutral-600 leading-relaxed">
                Every momo starts with soft, thin flour dough hand-kneaded each morning in Kasarvadavali, Thane West.
                Our fillings feature farm-fresh cabbage, sweet onions, and seasoned chicken or soya, seasoned with traditional
                Himalayan herbs and steam-cooked in small, dedicated batches.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-neutral-100">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                100% Preservative Free
              </span>
            </div>
          </article>

          {/* 2. MasterChef Heritage */}
          <article className="bg-white rounded-2xl border border-neutral-200/90 p-6 sm:p-7 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-100/80 text-amber-800 flex items-center justify-center mb-4">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg sm:text-xl text-neutral-950 tracking-tight">
                MasterChef India Founders &amp; Roots
              </h3>
              <p className="mt-3 text-sm text-neutral-600 leading-relaxed">
                Founders Ashika &amp; Dipesh grew up steeped in the culinary cultures of Jaigaon along the Indo-Bhutan frontier.
                After gaining widespread acclaim on MasterChef India and introducing Mumbai to authentic Himalayan dumplings at Momo Ghar
                in 2022, they created Nepali Tales to deliver restaurant-grade craftsmanship straight to your home.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-neutral-100">
              <Link
                href="/about"
                className="text-xs font-semibold text-accent-red hover:underline"
              >
                Read Ashika &amp; Dipesh&apos;s Full Story &rarr;
              </Link>
            </div>
          </article>

          {/* 3. Artisanal Chilli Oil & Jhol Broths */}
          <article className="bg-white rounded-2xl border border-neutral-200/90 p-6 sm:p-7 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg sm:text-xl text-neutral-950 tracking-tight">
                Slow-Cooked Chilli Oil &amp; Jhol Broth
              </h3>
              <p className="mt-3 text-sm text-neutral-600 leading-relaxed">
                Our momos are never served alone. They are paired with our viral slow-cooked artisanal chilli oil,
                steeped over slow heat with aromatic spices, along with a velvety, nutty Jhol broth simmered with roasted
                sesame seeds, golden soybeans, and crushed peanuts.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-neutral-100">
              <Link
                href="/menu"
                className="text-xs font-semibold text-accent-red hover:underline"
              >
                Explore Signature Jars &amp; Momos &rarr;
              </Link>
            </div>
          </article>
        </div>

        {/* Location & Operating Summary Strip */}
        <div className="mt-12 bg-white rounded-2xl border border-neutral-200/90 p-6 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h4 className="font-bold text-base text-neutral-950">
              Visit or Pick Up From Our Thane West Kitchen
            </h4>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1">
              {siteConfig.location.fullAddress} · Landmark: {siteConfig.location.landmark}
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/contact"
              className="px-5 py-2.5 rounded-full bg-neutral-900 text-white font-secondary text-xs sm:text-sm font-semibold hover:bg-neutral-800 transition-colors"
            >
              Contact &amp; Directions
            </Link>
            <Link
              href="/menu"
              className="px-5 py-2.5 rounded-full bg-accent-red text-white font-secondary text-xs sm:text-sm font-semibold hover:bg-[#b81b1b] transition-colors"
            >
              Order Online
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
