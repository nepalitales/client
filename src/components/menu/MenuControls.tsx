"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";

export interface MenuFilterState {
  search: string;
  isVegOnly: boolean;
  category: string; // "all" | "momo" | "shaphaley"
}

interface MenuControlsProps {
  filters: MenuFilterState;
  onUpdateFilters: (next: Partial<MenuFilterState>) => void;
  categories: Array<{ id: string; name: string; slug: string; count: number }>;
  totalCount: number;
}

export function MenuControls({
  filters,
  onUpdateFilters,
  categories,
  totalCount,
}: MenuControlsProps) {
  // Local state for debounced search typing
  const [searchInput, setSearchInput] = useState(filters.search);

  // Debounce the search input by 250ms
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        onUpdateFilters({ search: searchInput });
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchInput, filters.search, onUpdateFilters]);

  // Sync external filter changes back to search input
  useEffect(() => {
    setSearchInput(filters.search);
  }, [filters.search]);

  return (
    <div className="w-full space-y-6">
      {/* ─── Breadcrumbs ─────────────────────────────────────────── */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 text-xs sm:text-sm font-secondary"
      >
        <Link
          href="/"
          className="text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          Home
        </Link>
        <span className="text-neutral-300">/</span>
        <span className="text-neutral-900 font-semibold">Menu</span>
      </nav>

      {/* ─── Search Bar & Veg Toggle Switch ─────────────────────── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Left: Search Input & Veg Toggle Switch */}
        <div className="flex items-center gap-4 flex-1 max-w-xl">
          {/* Search Input Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search dishes..."
              aria-label="Search dishes"
              className="w-full bg-white border border-neutral-200/90 rounded-full pl-10 pr-10 py-2.5 text-sm font-secondary text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 transition-colors shadow-sm"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput("");
                  onUpdateFilters({ search: "" });
                }}
                aria-label="Clear search text"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 p-0.5 rounded-full cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Clean Veg Toggle Switch */}
          <div className="flex items-center gap-2.5 select-none shrink-0">
            <span
              onClick={() => onUpdateFilters({ isVegOnly: !filters.isVegOnly })}
              className={`text-sm font-bold font-secondary cursor-pointer transition-colors ${
                filters.isVegOnly ? "text-[#16A34A]" : "text-neutral-700"
              }`}
            >
              Veg
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={filters.isVegOnly}
              aria-label="Toggle Veg Only dishes"
              onClick={() => onUpdateFilters({ isVegOnly: !filters.isVegOnly })}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A] ${
                filters.isVegOnly ? "bg-[#16A34A]" : "bg-neutral-300"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  filters.isVegOnly ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* ─── Category Selection Tabs ────────────────────────────── */}
      <div className="pt-2 border-b border-neutral-100 flex items-center gap-6 sm:gap-8 overflow-x-auto no-scrollbar font-secondary">
        <button
          type="button"
          onClick={() => onUpdateFilters({ category: "all" })}
          className={`pb-3 text-sm font-semibold tracking-wide border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            filters.category === "all"
              ? "border-[#D92121] text-[#D92121]"
              : "border-transparent text-neutral-600 hover:text-neutral-950"
          }`}
        >
          <span>All Items</span>
          <span className="text-xs font-normal opacity-70">({totalCount})</span>
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => onUpdateFilters({ category: cat.slug })}
            className={`pb-3 text-sm font-semibold tracking-wide border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              filters.category === cat.slug
                ? "border-[#D92121] text-[#D92121]"
                : "border-transparent text-neutral-600 hover:text-neutral-950"
            }`}
          >
            <span>{cat.name}</span>
            <span className="text-xs font-normal opacity-70">({cat.count})</span>
          </button>
        ))}
      </div>
    </div>
  );
}
