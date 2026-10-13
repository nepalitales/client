import React from "react";
import Link from "next/link";
import { ArrowLeft, Home, BookOpen, Utensils, Mail } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function NotFound() {
  return (
    <main className="min-h-[70vh] bg-white flex items-center justify-center py-16 px-4 font-secondary">
      <div className="max-w-lg w-full text-center">
        <span className="font-chunko text-6xl sm:text-7xl text-accent-red tracking-tight block">
          404
        </span>

        <h1 className="mt-3 text-2xl sm:text-3xl font-black text-neutral-950 tracking-tight">
          Page Not Found
        </h1>

        <p className="mt-3 text-sm sm:text-base text-neutral-600 leading-relaxed">
          The dumpling batch or page you are looking for does not exist or may have been moved.
          Explore our authentic momo menu, read our story, or check our site index.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-accent-red text-white text-xs sm:text-sm font-semibold hover:bg-[#b81b1b] transition-colors shadow-xs"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <Link
            href="/menu"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-neutral-100 text-neutral-800 text-xs sm:text-sm font-semibold hover:bg-neutral-200 transition-colors"
          >
            <Utensils className="w-4 h-4" />
            <span>Explore Menu</span>
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-neutral-100 text-xs text-neutral-500 flex flex-wrap justify-center gap-4">
          <Link href="/contact" className="hover:text-accent-red">
            Contact Support
          </Link>
          <span>•</span>
          <a href="/sitemap.xml" className="hover:text-accent-red">
            XML Sitemap
          </a>
          <span>•</span>
          <a href="/llms.txt" className="hover:text-accent-red">
            llms.txt (AI Index)
          </a>
        </div>
      </div>
    </main>
  );
}
