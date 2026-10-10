"use client";

import React from "react";
import Image from "next/image";

interface StepItem {
  step: number;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}

const STEPS: StepItem[] = [
  {
    step: 1,
    title: "Order in Advance",
    description: "Order 1 day ahead so we can prepare your momo fresh.",
    image: "/assets/before-you-order-section/order-in-advance.png",
    imageAlt: "Calendar with 2-3 hours and steaming basket of fresh momos",
  },
  {
    step: 2,
    title: "Pickup or get delivered",
    description:
      "Pick up from our kitchen or choose Porter. Delivery charges apply.",
    image: "/assets/before-you-order-section/pickup-or-get-delievered.png",
    imageAlt: "Porter delivery scooter and runner carrying fresh takeaway",
  },
  {
    step: 3,
    title: "Need to cancel?",
    description:
      "Cancel at least 3 hours before delivery to receive a refund.",
    image: "/assets/before-you-order-section/need-to-cancel.png",
    imageAlt: "Smartphone order screen and clock showing cancellation window",
  },
];

export function BeforeYouOrderSection() {
  return (
    <section
      id="before-you-order"
      className="w-full bg-white py-12 sm:py-16 lg:py-20 overflow-hidden"
    >
      <div className="figma-container">
        {/* ─── Section Header ───────────────────────────────────────── */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="font-secondary font-bold text-xs sm:text-sm tracking-wider uppercase text-[#D92121] block">
            BEFORE YOU ORDER
          </span>
          <h2 className="font-secondary font-black text-2xl sm:text-3xl lg:text-4xl text-neutral-950 tracking-tight leading-tight mt-1.5 sm:mt-2">
            A few things to keep in mind
          </h2>
        </div>

        {/* ─── 3 Step Cards Grid ────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-6 lg:gap-8 items-stretch pt-2">
          {STEPS.map((item) => (
            <article
              key={item.step}
              className="relative bg-white rounded-2xl sm:rounded-3xl border border-neutral-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-md transition-all duration-300 flex flex-col justify-between group max-w-sm mx-auto md:max-w-none w-full"
            >
              {/* Floating Top Number Badge */}
              <div
                aria-label={`Step ${item.step}`}
                className="absolute -top-3.5 sm:-top-4 left-1/2 -translate-x-1/2 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#D92121] text-white flex items-center justify-center font-secondary font-bold text-xs sm:text-sm shadow-xs select-none"
              >
                {item.step}
              </div>

              {/* Upper Section: Graphic Illustration (Enlarged) */}
              <div className="pt-10 sm:pt-12 pb-6 sm:pb-8 px-4 sm:px-6 flex items-center justify-center flex-1 min-h-[230px] sm:min-h-[270px] lg:min-h-[290px]">
                <div className="relative w-full h-48 sm:h-56 lg:h-64 flex items-center justify-center select-none">
                  <Image
                    src={item.image}
                    alt={item.imageAlt}
                    width={450}
                    height={400}
                    priority
                    className="w-full h-full object-contain pointer-events-none transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              </div>

              {/* Subtle Horizontal Divider */}
              <div className="w-full px-5 sm:px-6">
                <hr className="border-t border-neutral-100" />
              </div>

              {/* Lower Section: Title and Instruction */}
              <div className="p-5 sm:p-6 pt-4 sm:pt-4.5 text-left">
                <h3 className="font-secondary font-bold text-base sm:text-lg text-neutral-950 leading-snug">
                  {item.title}
                </h3>
                <p className="font-secondary text-xs sm:text-sm text-neutral-500 leading-relaxed mt-1.5">
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
