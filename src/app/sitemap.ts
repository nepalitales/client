import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    {
      path: "",
      priority: 1.0,
      changeFrequency: "daily" as const,
    },
    {
      path: "/menu",
      priority: 0.9,
      changeFrequency: "daily" as const,
    },
    {
      path: "/about",
      priority: 0.8,
      changeFrequency: "weekly" as const,
    },
    {
      path: "/contact",
      priority: 0.8,
      changeFrequency: "weekly" as const,
    },
    {
      path: "/terms-and-conditions",
      priority: 0.5,
      changeFrequency: "monthly" as const,
    },
    {
      path: "/privacy-policy",
      priority: 0.5,
      changeFrequency: "monthly" as const,
    },
    {
      path: "/cancellation-policy",
      priority: 0.6,
      changeFrequency: "monthly" as const,
    },
    {
      path: "/delivery-policy",
      priority: 0.6,
      changeFrequency: "monthly" as const,
    },
    {
      path: "/allergen-advisory",
      priority: 0.6,
      changeFrequency: "monthly" as const,
    },
  ];

  return routes.map((route) => ({
    url: `${siteConfig.url}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
