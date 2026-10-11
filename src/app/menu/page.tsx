import type { Metadata } from "next";
import { MenuPageView } from "@/components/menu/MenuPageView";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Menu | Authentic Nepali Momo & Shaphaley",
  description:
    "Explore authentic Nepali momo and crispy shaphaley crafted fresh daily in Thane. Browse Veg and Non-Veg steamed, pan-fried kothey, deep-fried, and soup jhol momo.",
  openGraph: {
    title: `Menu - ${siteConfig.name}`,
    description:
      "Handcrafted momo, artisanal chilli oil, and traditional Nepali recipes from the Indo-Bhutan border.",
    url: `${siteConfig.url}/menu`,
    siteName: siteConfig.name,
    locale: "en_IN",
    type: "website",
  },
  alternates: {
    canonical: `${siteConfig.url}/menu`,
  },
};

export default function MenuPage() {
  return <MenuPageView />;
}
