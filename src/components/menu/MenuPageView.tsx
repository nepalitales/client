"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  getCategoriesWithProducts,
  subscribeToLiveCatalogUpdates,
  type Product,
} from "@/lib/api";
import { MenuCard, MenuCardSkeleton } from "./MenuCard";
import { MenuControls, type MenuFilterState } from "./MenuControls";
import { UtensilsCrossed, ChevronLeft, ChevronRight } from "lucide-react";

const ITEMS_PER_PAGE = 6;

export function MenuPageView() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<
    Array<{ id: string; name: string; slug: string; count: number }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const gridTopRef = useRef<HTMLDivElement>(null);

  const [filters, setFilters] = useState<MenuFilterState>({
    search: "",
    isVegOnly: false,
    isNonVegOnly: false,
    category: "all",
  });

  // Fetch categories and products (with silent refresh support)
  const loadMenu = React.useCallback(async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);
      const catList = await getCategoriesWithProducts();
      const allProds: Product[] = [];
      const catCounts: Array<{
        id: string;
        name: string;
        slug: string;
        count: number;
      }> = [];

      for (const cat of catList) {
        const catProducts = cat.products || [];
        allProds.push(...catProducts);
        catCounts.push({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          count: catProducts.length,
        });
      }

      setProducts(allProds);
      setCategories(catCounts);
    } catch (err) {
      console.warn("[Menu] Failed to load menu products:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadMenu(false);
  }, [loadMenu]);

  // Real-time synchronization via Server-Sent Events & tab focus
  useEffect(() => {
    const unsubscribe = subscribeToLiveCatalogUpdates(() => {
      // Live reload when admin updates products, categories, or addons
      loadMenu(true);
    });

    const handleFocus = () => {
      loadMenu(true);
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      unsubscribe();
      window.removeEventListener("focus", handleFocus);
    };
  }, [loadMenu]);

  const handleUpdateFilters = (next: Partial<MenuFilterState>) => {
    setFilters((prev) => ({ ...prev, ...next }));
    setCurrentPage(1); // Reset to page 1 on filter change
  };

  // Filter products based on search, veg toggle, and category
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // 1. Food Type filter (Veg / Non-Veg)
    if (filters.isVegOnly) {
      result = result.filter((p) => p.type === "veg");
    } else if (filters.isNonVegOnly) {
      result = result.filter((p) => p.type === "non-veg");
    }

    // 2. Category filter
    if (filters.category !== "all") {
      result = result.filter(
        (p) => p.categorySlug?.toLowerCase() === filters.category.toLowerCase()
      );
    }

    // 3. Search query filter (matches name, description, category, type)
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter((p) => {
        const nameMatch = p.name.toLowerCase().includes(q);
        const descMatch = p.description.toLowerCase().includes(q);
        const typeMatch = p.type.toLowerCase().includes(q);
        const catMatch = p.categorySlug?.toLowerCase().includes(q);

        // Also match variations like "steam" for "steamed"
        const cleanName = p.name.toLowerCase().replace(/steamed/g, "steam");
        const cleanQuery = q.replace(/steamed/g, "steam");
        const fuzzyNameMatch = cleanName.includes(cleanQuery);

        return nameMatch || descMatch || typeMatch || catMatch || fuzzyNameMatch;
      });
    }

    return result;
  }, [products, filters]);

  // Pagination calculation (6 items per page)
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage) return;
    setCurrentPage(newPage);
    if (gridTopRef.current) {
      gridTopRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const startItem = filteredProducts.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length);

  return (
    <section className="w-full bg-[#FAF9F5]/40 min-h-screen py-8 sm:py-12">
      <div className="figma-container space-y-8">
        {/* Controls Bar */}
        <MenuControls
          filters={filters}
          onUpdateFilters={handleUpdateFilters}
          categories={categories}
          totalCount={products.length}
        />

        {/* ─── Top Pagination Controls ────────────────────────── */}
        {!loading && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-1 font-secondary">
            <span className="text-xs sm:text-sm text-neutral-500">
              Showing <span className="font-semibold text-neutral-800">{startItem}–{endItem}</span> of{" "}
              <span className="font-semibold text-neutral-800">{filteredProducts.length}</span> dishes
            </span>

            <div className="flex items-center gap-2 select-none">
              {/* Previous Button */}
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous page"
                className="inline-flex items-center justify-center px-3.5 py-1.5 rounded-full border border-neutral-200 bg-white text-xs sm:text-sm font-semibold text-neutral-700 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-xs"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                <span>Previous</span>
              </button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => handlePageChange(pageNum)}
                    aria-label={`Go to page ${pageNum}`}
                    aria-current={currentPage === pageNum ? "page" : undefined}
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full text-xs sm:text-sm font-bold flex items-center justify-center transition-all cursor-pointer ${
                      currentPage === pageNum
                        ? "bg-[#D92121] text-white shadow-sm"
                        : "bg-white text-neutral-700 border border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              {/* Next Button */}
              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Next page"
                className="inline-flex items-center justify-center px-3.5 py-1.5 rounded-full border border-neutral-200 bg-white text-xs sm:text-sm font-semibold text-neutral-700 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-xs"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        )}

        {/* Scroll Anchor */}
        <div ref={gridTopRef} className="-mt-4 pt-4" />

        {/* ─── 3 Cards Per Row Product Grid ─────────────────────── */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {Array.from({ length: 6 }).map((_, idx) => (
              <MenuCardSkeleton key={idx} />
            ))}
          </div>
        ) : paginatedProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {paginatedProducts.map((product) => (
              <MenuCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          /* ─── Empty Results State ─────────────────────────────── */
          <div className="bg-white rounded-2xl border border-neutral-200/80 p-12 text-center flex flex-col items-center justify-center space-y-4 max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center text-[#D92121]">
              <UtensilsCrossed className="w-7 h-7 stroke-[1.8]" />
            </div>
            <div className="space-y-1">
              <h3 className="font-secondary font-bold text-lg text-neutral-900">
                No matching dishes found
              </h3>
              <p className="font-secondary text-sm text-neutral-500">
                We couldn&apos;t find anything matching your filters.
                Try clearing active filters to see all dishes.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                handleUpdateFilters({
                  search: "",
                  isVegOnly: false,
                  isNonVegOnly: false,
                  category: "all",
                })
              }
              className="bg-[#D92121] hover:bg-[#b81b1b] text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
