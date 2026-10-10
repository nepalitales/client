"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Plus, Minus } from "lucide-react";
import type { Product } from "@/lib/api";
import { useCart } from "@/context/CartContext";

interface MenuCardProps {
  product: Product;
  quantity?: number;
  onUpdateQuantity?: (productId: string, quantity: number) => void;
}

export function MenuCard({
  product,
  quantity,
  onUpdateQuantity,
}: MenuCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { addItem, updateQuantity, getItemQuantity, openCart } = useCart();

  // Live cart quantity ensures drawer and card are always in 100% sync
  const cartQty = getItemQuantity(product.id);
  const localQty = quantity !== undefined ? quantity : cartQty;

  const isVeg = product.type === "veg";

  // Normalize display name to match Figma design
  const displayName = React.useMemo(() => {
    let name = product.name;
    // Replace Steamed -> Steam if needed
    name = name.replace(/Steamed/i, "Steam");
    // If not ending with Momo and not already containing Momo, append Momo
    if (!/momo/i.test(name)) {
      name = `${name} Momo`;
    }
    return name;
  }, [product.name]);

  // Normalize quantity display (e.g., "6 pcs" -> "6 pieces")
  const displayPieces = React.useMemo(() => {
    if (!product.quantity) return "6 pieces";
    return product.quantity.replace(/pcs/i, "pieces").trim();
  }, [product.quantity]);

  const handleAdd = () => {
    addItem(product, 1);
    onUpdateQuantity?.(product.id, localQty + 1);
    openCart();
  };

  const handleMinus = () => {
    if (localQty <= 0) return;
    const next = localQty - 1;
    updateQuantity(product.id, next);
    onUpdateQuantity?.(product.id, next);
  };

  const handlePlus = () => {
    const next = localQty + 1;
    updateQuantity(product.id, next);
    onUpdateQuantity?.(product.id, next);
  };

  const handleOrderNow = () => {
    if (localQty === 0) {
      addItem(product, 1);
      onUpdateQuantity?.(product.id, 1);
    }
    openCart();
  };

  return (
    <article className="bg-white rounded-2xl border border-neutral-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden group">
      {/* ─── Image Container with Overlays (Flush to Edges) ───── */}
      <div className="relative w-full aspect-[4/3] bg-neutral-100 select-none overflow-hidden">
        <Image
          src={product.image}
          alt={displayName}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none"
        />

        {/* Top-Left: Food Type Tag (VEG / NON-VEG) */}
        <div className="absolute top-2.5 left-2.5 z-10">
          {isVeg ? (
            <span className="bg-[#EAF8EE] text-[#2E7D32] text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm inline-flex items-center">
              VEG
            </span>
          ) : (
            <span className="bg-[#FDE8E8] text-[#D92121] text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm inline-flex items-center">
              NON-VEG
            </span>
          )}
        </div>

        {/* Bottom-Right: Floating ADD+ Button or Quantity Counter */}
        <div className="absolute bottom-2.5 right-2.5 z-10">
          {localQty === 0 ? (
            <button
              type="button"
              onClick={handleAdd}
              aria-label={`Add ${displayName} to order`}
              className="bg-white text-[#D92121] border border-[#E53935] hover:bg-red-50 text-xs sm:text-[13px] font-bold px-3 py-1 rounded-full shadow-sm active:scale-95 transition-all inline-flex items-center gap-1 cursor-pointer select-none"
            >
              <span>ADD</span>
              <span className="text-sm leading-none">+</span>
            </button>
          ) : (
            <div className="bg-white border border-[#E53935] rounded-full shadow-md flex items-center px-1.5 py-0.5 gap-2 select-none">
              <button
                type="button"
                onClick={handleMinus}
                aria-label="Decrease quantity"
                className="w-6 h-6 flex items-center justify-center text-[#D92121] hover:bg-red-50 rounded-full transition-colors active:scale-90"
              >
                <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
              <span className="font-secondary font-bold text-xs sm:text-sm text-neutral-900 min-w-[16px] text-center">
                {localQty}
              </span>
              <button
                type="button"
                onClick={handlePlus}
                aria-label="Increase quantity"
                className="w-6 h-6 flex items-center justify-center text-[#D92121] hover:bg-red-50 rounded-full transition-colors active:scale-90"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ─── Card Body (Padded content below image) ────────────── */}
      <div className="flex-1 flex flex-col p-3.5 sm:p-4">
        {/* Pieces Tag */}
        <div>
          <span className="bg-[#ECEEFA] text-[#3B4E7A] text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded inline-block">
            {displayPieces}
          </span>
        </div>

        {/* Title and Price */}
        <div className="flex items-start justify-between gap-2 mt-2">
          <h3 className="font-secondary font-bold text-sm sm:text-base text-neutral-900 leading-snug">
            {displayName}
          </h3>
          <span className="font-secondary font-bold text-base sm:text-lg text-neutral-950 whitespace-nowrap">
            ₹{product.price}
          </span>
        </div>

        {/* Description with Read more toggle */}
        <div className="mt-1.5 text-xs sm:text-[13px] text-neutral-500 leading-relaxed font-secondary">
          <p>
            {isExpanded ? (
              <>
                {product.description}{" "}
                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  className="font-semibold text-neutral-900 hover:text-[#D92121] transition-colors underline cursor-pointer inline ml-1"
                >
                  Read less
                </button>
              </>
            ) : (
              <>
                {product.description.length > 70
                  ? `${product.description.slice(0, 68)}...`
                  : product.description}{" "}
                {product.description.length > 70 && (
                  <button
                    type="button"
                    onClick={() => setIsExpanded(true)}
                    className="font-semibold text-neutral-900 hover:text-[#D92121] transition-colors cursor-pointer inline ml-0.5"
                  >
                    Read more
                  </button>
                )}
              </>
            )}
          </p>
        </div>

        {/* ─── Bottom ORDER NOW Button ──────────────────────────── */}
        <div className="mt-4 pt-1">
          <button
            type="button"
            onClick={handleOrderNow}
            className="w-full bg-[#D92121] hover:bg-[#b81b1b] text-white font-secondary font-bold py-2.5 px-4 rounded-full text-xs sm:text-sm tracking-wider uppercase transition-colors shadow-sm active:scale-[0.98] cursor-pointer"
          >
            ORDER NOW
          </button>
        </div>
      </div>
    </article>
  );
}

export function MenuCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-neutral-200/80 animate-pulse flex flex-col overflow-hidden">
      <div className="w-full aspect-[4/3] bg-neutral-200" />
      <div className="p-3.5 sm:p-4 flex flex-col space-y-3 flex-1">
        <div className="w-16 h-4 bg-neutral-100 rounded" />
        <div className="flex justify-between items-center">
          <div className="w-32 h-5 bg-neutral-200 rounded" />
          <div className="w-12 h-5 bg-neutral-200 rounded" />
        </div>
        <div className="w-full h-8 bg-neutral-100 rounded" />
        <div className="w-full h-10 bg-neutral-200 rounded-full mt-2" />
      </div>
    </div>
  );
}
