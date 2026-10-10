"use client";

import React, { useState, useEffect, useMemo } from "react";
import { ChevronRight, ChevronDown, Loader2 } from "lucide-react";
import { getClientFaqs, type ClientFaq } from "@/lib/api";

export function FAQSection() {
  const [faqs, setFaqs] = useState<ClientFaq[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 1. Initial fetch of all FAQs to populate categories and default state
  useEffect(() => {
    let isMounted = true;
    async function loadInitial() {
      setIsLoading(true);
      try {
        const data = await getClientFaqs();
        if (isMounted) {
          setFaqs(data);
          // Set first FAQ as open by default, matching design mockup
          if (data && data.length > 0) {
            setOpenFaqId(data[0].id);
          }
        }
      } catch (err) {
        console.warn("[FAQSection] Failed to load FAQs:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadInitial();
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Dynamic Categories list extracted from FAQs
  const categories = useMemo(() => {
    const list = ["All"];
    const found = new Set<string>();
    faqs.forEach((item) => {
      if (item.category && !found.has(item.category)) {
        found.add(item.category);
        list.push(item.category);
      }
    });
    return list;
  }, [faqs]);

  // 3. Filter FAQs based on active category
  const filteredFaqs = useMemo(() => {
    if (activeCategory === "All") return faqs;
    return faqs.filter(
      (item) => item.category?.toLowerCase() === activeCategory.toLowerCase()
    );
  }, [faqs, activeCategory]);

  const handleToggle = (id: string) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  const handleCategorySelect = async (category: string) => {
    setActiveCategory(category);
    // Ensure the first FAQ in the newly selected category is expanded if available
    const firstInCat = (category === "All"
      ? faqs
      : faqs.filter(
          (f) => f.category?.toLowerCase() === category.toLowerCase()
        ))[0];
    if (firstInCat) {
      setOpenFaqId(firstInCat.id);
    }
  };

  return (
    <section
      id="faqs"
      className="w-full bg-white py-12 sm:py-16 lg:py-24 overflow-hidden"
    >
      <div className="figma-container">
        {/* ─── Section Header (Chunko Bold with 4% letter spacing) ─── */}
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="font-chunko text-[#D92121] text-4xl sm:text-5xl lg:text-6xl tracking-[0.04em] uppercase leading-none drop-shadow-xs">
              FAQ&apos;s
            </h2>
          </div>

          {/* ─── Category Filter Pills ─────────────────────────────── */}
          {categories.length > 1 && (
            <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-3 mb-8 sm:mb-12">
              {categories.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleCategorySelect(cat)}
                    className={`font-secondary text-xs sm:text-sm font-semibold px-4 sm:px-5 py-2 rounded-full transition-all duration-200 cursor-pointer select-none active:scale-95 ${
                      isActive
                        ? "bg-[#D92121] text-white shadow-sm"
                        : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          )}

          {/* ─── FAQ Accordion List ─────────────────────────────────── */}
          <div className="border-t border-neutral-200/90 divide-y divide-neutral-200/90">
            {isLoading ? (
              <div className="py-16 flex flex-col items-center justify-center text-neutral-400 gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-[#D92121]" />
                <span className="font-secondary text-sm">Loading FAQs...</span>
              </div>
            ) : filteredFaqs.length === 0 ? (
              <div className="py-12 text-center text-neutral-500 font-secondary text-sm">
                No questions found in this category.
              </div>
            ) : (
              filteredFaqs.map((faq) => {
                const isOpen = openFaqId === faq.id;
                return (
                  <div key={faq.id} className="py-5 sm:py-6 transition-colors">
                    {/* Question Row Header */}
                    <button
                      type="button"
                      onClick={() => handleToggle(faq.id)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${faq.id}`}
                      className="w-full flex items-center justify-between gap-4 text-left group cursor-pointer select-none"
                    >
                      <span className="font-secondary font-bold text-base sm:text-lg text-neutral-950 group-hover:text-[#D92121] transition-colors leading-snug">
                        {faq.question}
                      </span>

                      {/* Right Chevron Indicator (Red) */}
                      <span className="shrink-0 text-[#D92121] transition-transform duration-200 flex items-center justify-center">
                        {isOpen ? (
                          <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.4]" />
                        ) : (
                          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.4]" />
                        )}
                      </span>
                    </button>

                    {/* Answer Collapsible Body */}
                    {isOpen && (
                      <div
                        id={`faq-answer-${faq.id}`}
                        className="mt-3 sm:mt-4 pr-6 sm:pr-10 animate-in fade-in slide-in-from-top-1 duration-200"
                      >
                        <p className="font-secondary text-sm sm:text-base text-neutral-600 leading-relaxed whitespace-pre-line">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
      </div>
    </section>
  );
}
