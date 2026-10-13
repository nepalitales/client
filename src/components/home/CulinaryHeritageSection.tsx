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
            The Journey
          </span>
          <h2 className="font-secondary font-black text-2xl sm:text-3xl lg:text-4xl text-neutral-950 tracking-tight leading-tight mt-1.5 sm:mt-2">
            Our Story &amp; Heritage
          </h2>
          <p className="mt-4 text-sm sm:text-base text-neutral-600 leading-relaxed">
            Today, Nepali Tales is built on that same belief &mdash; fresh food, honest flavors,
            and never giving up on what we love. From family kitchens in Jaigaon to Mumbai and Thane.
          </p>
        </div>

        {/* 3 Heritage Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* 1. Our Story (Direct text from OurStorySection) */}
          <article className="bg-white rounded-2xl border border-neutral-200/90 p-6 sm:p-7 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-red-100/80 text-accent-red flex items-center justify-center mb-4">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg sm:text-xl text-neutral-950 tracking-tight">
                Our Story
              </h3>
              <p className="mt-3 text-sm text-neutral-600 leading-relaxed">
                Two people, one shared love for momo, and a dream that refused to stay down.
                From family kitchens in Jaigaon to countless fresh starts across cities, our journey
                has been anything but easy. Nepali Tales is our story, served one plate at a time.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-neutral-100">
              <Link
                href="/about"
                className="text-xs font-semibold text-accent-red hover:underline inline-flex items-center gap-1"
              >
                <span>Read Full Story</span>
                <span>&rarr;</span>
              </Link>
            </div>
          </article>

          {/* 2. Momo Ghar to Nepali Tales (Direct text from MomoGharStorySection) */}
          <article className="bg-white rounded-2xl border border-neutral-200/90 p-6 sm:p-7 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-100/80 text-amber-800 flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg sm:text-xl text-neutral-950 tracking-tight">
                Momo Ghar to Nepali Tales
              </h3>
              <p className="mt-3 text-sm text-neutral-600 leading-relaxed">
                What started in family kitchens in Jaigaon became a dream of bringing that same simple,
                soulful taste to every plate. We tried, failed, moved cities, and started again.
                From Momo Ghar to supper clubs and countless early mornings, every setback taught us something.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-neutral-100">
              <a
                href="https://indianexpress.com/article/cities/mumbai/nepali-tales-thane-momos-prajakta-koli-masterchef-couple-10864209/lite/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-accent-red hover:underline inline-flex items-center gap-1"
              >
                <span>As Featured in The Indian Express</span>
                <span>&rarr;</span>
              </a>
            </div>
          </article>

          {/* 3. Authentic Momo & Broths (Direct text from Hero and Signature Sections) */}
          <article className="bg-white rounded-2xl border border-neutral-200/90 p-6 sm:p-7 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center mb-4">
                <Utensils className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg sm:text-xl text-neutral-950 tracking-tight">
                Authentic Momo &amp; Broths
              </h3>
              <p className="mt-3 text-sm text-neutral-600 leading-relaxed">
                Something that&apos;ll make you say best MOMO you have ever had. Steamed momo is served
                with soup which is rich, creamy, and nutty from roasted sesame seeds, peanuts, and soybeans,
                along with our signature slow-cooked artisanal chilli oil.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-neutral-100">
              <Link
                href="/menu"
                className="text-xs font-semibold text-accent-red hover:underline inline-flex items-center gap-1"
              >
                <span>Explore Menu &amp; Jars</span>
                <span>&rarr;</span>
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
