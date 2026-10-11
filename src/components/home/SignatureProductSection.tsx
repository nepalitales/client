"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/lib/api";

interface SignatureItem {
  id: string;
  name: string;
  type: "veg" | "non-veg";
  quantity: string;
  price: number;
  image: string;
  shortDescription: string;
  fullDescription: string;
}

const SIGNATURE_PRODUCTS: SignatureItem[] = [
  {
    id: "prod_mv2moq3567e80597",
    name: "Veg Kothey Momo",
    type: "veg",
    quantity: "6 pcs",
    price: 219,
    image: "/assets/signature-product-section/veg-kothey-momo.png",
    shortDescription:
      "Bite-sized dumplings filled with fresh and finely chopped cabbage, onion, soya chunks.....",
    fullDescription:
      "Bite-sized dumplings filled with fresh and finely chopped cabbage, onion, soya chunks and wrapped in a thin, soft flour dough. Steamed and only bottom part of momo is pan fried. Served with peanut chutney, red spicy chutney, and chilli oil.",
  },
  {
    id: "prod_mv2moq555c58a398",
    name: "Chicken Jhol Momo",
    type: "non-veg",
    quantity: "6 pcs",
    price: 249,
    image: "/assets/signature-product-section/chicken-jhol-momo.png",
    shortDescription:
      "Steamed momo is served with the soup which is rich and creamy, and nutty flavour.....",
    fullDescription:
      "Steamed momo is served with the soup which is rich and creamy, and nutty flavour from roasted sesame seeds and peanut, soyabean. Momo and jhol is packed separately and chilli oil.",
  },
  {
    id: "prod_mv2moq5v1872319f",
    name: "Chicken Shaphaley",
    type: "non-veg",
    quantity: "2 pcs",
    price: 239,
    image: "/assets/signature-product-section/chicken-shaphaley.png",
    shortDescription:
      "Made of crispy fried bread stuffed with seasoned minced chicken, onions, and spices.....",
    fullDescription:
      "Made of crispy fried bread stuffed with seasoned minced chicken, onions, and spices. Served with peanut chutney, red spicy chutney, and chilli oil.",
  },
];

function SignatureCard({
  item,
  liveProduct,
}: {
  item: SignatureItem;
  liveProduct?: Product;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { addItem, openCart } = useCart();

  const activeId = liveProduct?.id || item.id;
  const activePrice = liveProduct?.price ?? item.price;
  const activeName = liveProduct?.name || item.name;

  const handleOrderNow = () => {
    const productPayload: Product = {
      id: activeId,
      name: activeName,
      description: item.fullDescription,
      price: activePrice,
      image: item.image,
      categoryId: liveProduct?.categoryId || "momo",
      categorySlug: liveProduct?.categorySlug || "momo",
      type: item.type,
      quantity: item.quantity,
    };
    addItem(productPayload, 1);
    openCart();
  };

  return (
    <article className="flex flex-col group w-full max-w-md mx-auto lg:max-w-none">
      {/* ─── Stamp Graphic Header ───────────────────────────────── */}
      <div className="relative w-full aspect-419/344 select-none flex items-center justify-center">
        <Image
          src={item.image}
          alt={item.name}
          width={419}
          height={344}
          priority
          className="w-full h-auto object-contain pointer-events-none select-none transition-transform duration-300 group-hover:scale-[1.02]"
        />
      </div>

      {/* ─── White Product Info Card ────────────────────────────── */}
      <div className="mt-3 sm:mt-4 bg-white rounded-2xl border border-neutral-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow duration-300 p-4 sm:p-5 flex flex-col justify-between flex-1">
        <div>
          {/* Top Badges (Food type & Pieces) */}
          <div className="flex items-center justify-between">
            {item.type === "veg" ? (
              <span className="bg-[#EAF8EE] text-[#2E7D32] text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-2xs">
                VEG
              </span>
            ) : (
              <span className="bg-[#FDE8E8] text-[#D92121] text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-2xs">
                NON-VEG
              </span>
            )}

            <span className="bg-[#ECEEFA] text-[#3B4E7A] text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded">
              {item.quantity}
            </span>
          </div>

          {/* Product Title */}
          <h3 className="font-secondary font-bold text-base sm:text-lg text-neutral-900 mt-2.5 sm:mt-3 leading-snug">
            {item.name}
          </h3>

          {/* Product Description with Read More Toggle */}
          <div className="mt-1.5 text-xs sm:text-[13px] text-neutral-500 leading-relaxed font-secondary">
            <p>
              {isExpanded ? (
                <>
                  {item.fullDescription}{" "}
                  <button
                    type="button"
                    onClick={() => setIsExpanded(false)}
                    className="font-bold text-neutral-900 hover:text-[#D92121] transition-colors underline cursor-pointer inline ml-1"
                  >
                    Read less
                  </button>
                </>
              ) : (
                <>
                  {item.shortDescription}{" "}
                  <button
                    type="button"
                    onClick={() => setIsExpanded(true)}
                    className="font-bold text-neutral-900 hover:text-[#D92121] transition-colors cursor-pointer inline ml-0.5"
                  >
                    Read more
                  </button>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Price & Order Now Button */}
        <div className="flex items-center justify-between mt-4 pt-2">
          <span className="font-secondary font-bold text-xl sm:text-2xl text-[#D92121]">
            ₹{activePrice}
          </span>

          <button
            type="button"
            onClick={handleOrderNow}
            className="bg-[#D92121] hover:bg-[#b81b1b] text-white font-secondary font-medium text-xs sm:text-sm px-5 sm:px-6 py-2 sm:py-2.5 rounded-full transition-all duration-200 active:scale-95 shadow-xs cursor-pointer select-none"
            aria-label={`Order ${activeName} for ₹${activePrice}`}
          >
            Order Now
          </button>
        </div>
      </div>
    </article>
  );
}

export function SignatureProductSection() {
  return (
    <section
      id="signature-products"
      className="w-full bg-white py-10 sm:py-14 lg:py-18 overflow-hidden"
    >
      <div className="figma-container">
        {/* ─── Section Header ─────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10 lg:mb-12">
          <div>
            <span className="font-tertiary text-3xl sm:text-4xl lg:text-[42px] text-neutral-900 block leading-tight">
              Signature Momo
            </span>
            <h2 className="font-secondary text-2xl sm:text-3xl lg:text-[38px] font-black text-neutral-950 tracking-tight leading-tight mt-1">
              What we are known for
            </h2>
          </div>

          <div className="sm:self-end">
            <Link
              href="/menu"
              className="font-secondary text-sm sm:text-base font-semibold text-[#D92121] underline hover:text-[#b81b1b] transition-colors inline-flex items-center gap-1 group"
            >
              <span>See full menu</span>
            </Link>
          </div>
        </div>

        {/* ─── 3 Column Signature Cards Grid ──────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8 items-stretch">
          {SIGNATURE_PRODUCTS.map((item) => (
            <SignatureCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
