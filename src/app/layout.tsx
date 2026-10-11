import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter, Geist_Mono, Seaweed_Script } from "next/font/google";
import { siteConfig } from "@/config/site";
import { RestaurantJsonLd } from "@/components/seo/JsonLd";
import { CookieConsent } from "@/components/ui/CookieConsent";
import { AppProviders } from "@/components/providers/AppProviders";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const chunkoBold = localFont({
  src: "../../public/fonts/chunko-bold-demo/Chunko Bold Demo.otf",
  variable: "--font-primary",
  display: "swap",
});

const inter = Inter({
  variable: "--font-secondary",
  subsets: ["latin"],
  display: "swap",
});

const seaweedScript = Seaweed_Script({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-tertiary",
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Nepali Tales - Authentic Nepali Momo",
    template: `%s | ${siteConfig.name}`,
  },
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [
      { url: "/icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/icon.png",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [
    ...siteConfig.founders.map((f) => ({ name: f.name })),
    { name: siteConfig.developer.name, url: siteConfig.developer.url },
  ],
  generator: "Next.js",
  keywords: siteConfig.keywords,
  creator: `${siteConfig.developer.name} (${siteConfig.developer.url})`,
  publisher: siteConfig.name,
  formatDetection: {
    telephone: true,
    address: true,
    email: true,
  },
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    title: `${siteConfig.name} - ${siteConfig.tagline}`,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} - ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    // GEO Metadata for Search Engines and Map Crawlers
    "geo.region": "IN-MH",
    "geo.placename": "Thane, Maharashtra, India",
    "geo.position": `${siteConfig.location.geo.latitude};${siteConfig.location.geo.longitude}`,
    "ICBM": `${siteConfig.location.geo.latitude}, ${siteConfig.location.geo.longitude}`,
    "place:location:latitude": siteConfig.location.geo.latitudeString,
    "place:location:longitude": siteConfig.location.geo.longitudeString,
    // Restaurant Specific Meta
    "restaurant:contact_info:phone_number": siteConfig.contact.phoneClean,
    "restaurant:contact_info:street_address": siteConfig.location.fullAddress,
    "restaurant:contact_info:locality": siteConfig.location.city,
    "restaurant:contact_info:region": siteConfig.location.region,
    "restaurant:contact_info:postal_code": siteConfig.location.postalCode,
    "restaurant:contact_info:country_name": siteConfig.location.countryName,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en-IN"
      suppressHydrationWarning
      className={`${chunkoBold.variable} ${inter.variable} ${seaweedScript.variable} ${geistMono.variable} antialiased`}
    >
      <head>
        <link rel="author" href={`${siteConfig.url}/#about`} />
        {/* Geo Microformats */}
        <meta name="geo.region" content="IN-MH" />
        <meta name="geo.placename" content="Thane, Maharashtra, India" />
        <meta
          name="geo.position"
          content={`${siteConfig.location.geo.latitude};${siteConfig.location.geo.longitude}`}
        />
        <meta
          name="ICBM"
          content={`${siteConfig.location.geo.latitude}, ${siteConfig.location.geo.longitude}`}
        />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-white text-black selection:bg-accent-red selection:text-white"
      >
        <AppProviders>
          <RestaurantJsonLd />
          {children}
          <CookieConsent />
        </AppProviders>
        <Analytics />
      </body>
    </html>
  );
}
