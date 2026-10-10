import type { Metadata } from "next";
import { MenuPageView } from "@/components/menu/MenuPageView";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Menu | Authentic Himalayan Momos & Shaphaley",
  description:
    "Explore authentic Himalayan momos and crispy shaphaley crafted fresh daily in Thane. Browse Veg and Non-Veg steamed, pan-fried kothey, deep-fried, and soup jhol momos.",
  openGraph: {
    title: `Menu — ${siteConfig.name}`,
    description:
      "Handcrafted momos, artisanal chilli oil, and traditional Himalayan recipes from the Indo-Bhutan border.",
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
