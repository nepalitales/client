import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  MessageCircle,
  Mail,
  Clock,
  ExternalLink,
  Navigation,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Contact Us | ${siteConfig.name}`,
  description:
    "Get in touch with Nepali Tales. Visit our kitchen in Kasarvadavali, Thane West, reach us via WhatsApp or phone at +91 76780 97659, or find pickup directions.",
  alternates: {
    canonical: `${siteConfig.url}/contact`,
  },
  openGraph: {
    title: `Contact Us - ${siteConfig.name}`,
    description:
      "Locate Nepali Tales in Thane West, Maharashtra. Order handcrafted authentic momo, schedule Porter pickups, or reach customer care.",
    url: `${siteConfig.url}/contact`,
  },
};

export default function ContactPage() {
  const contactPageSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: `Contact Us - ${siteConfig.name}`,
    description: `Official contact information, kitchen location, and support desk for ${siteConfig.name}.`,
    url: `${siteConfig.url}/contact`,
    mainEntity: {
      "@type": "Restaurant",
      name: siteConfig.name,
      telephone: siteConfig.contact.phoneClean,
      email: siteConfig.contact.email,
      address: {
        "@type": "PostalAddress",
        streetAddress: `${siteConfig.location.building}, ${siteConfig.location.shopName}, ${siteConfig.location.area}, ${siteConfig.location.street}`,
        addressLocality: siteConfig.location.city,
        addressRegion: siteConfig.location.region,
        postalCode: siteConfig.location.postalCode,
        addressCountry: siteConfig.location.country,
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: siteConfig.location.geo.latitude,
        longitude: siteConfig.location.geo.longitude,
      },
      hasMap: siteConfig.location.googleMapsUrl,
      contactPoint: {
        "@type": "ContactPoint",
        telephone: siteConfig.contact.phoneClean,
        email: siteConfig.contact.email,
        contactType: "customer service",
        areaServed: "IN",
        availableLanguage: ["English", "Hindi", "Nepali"],
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
      />

      <main className="min-h-screen bg-white text-neutral-900 py-12 lg:py-16 font-secondary">
        <div className="figma-container">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-neutral-500 hover:text-brand-red transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
              <span>Back to Home</span>
            </Link>
          </nav>

          {/* Header */}
          <header className="pb-8 sm:pb-12 border-b border-neutral-200/80">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-accent-red border border-red-200">
                Official Kitchen &amp; Support Hub
              </span>
              <span className="text-xs text-neutral-300">•</span>
              <span className="text-xs font-medium text-neutral-500">
                Thane West, Maharashtra
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-950 font-secondary">
              Contact Us
            </h1>

            <p className="mt-4 text-base sm:text-lg text-neutral-600 leading-relaxed font-secondary max-w-3xl">
              Have questions about our authentic Nepali momo, daily order windows, or dietary allergens?
              Reach out directly to our founders Ashika &amp; Dipesh and the kitchen team.
            </p>
          </header>

          {/* Main 4 Contact Cards Grid */}
          <section
            aria-label="Contact Channels"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-10"
          >
            {/* 1. Physical Location */}
            <div className="bg-neutral-50/70 rounded-2xl border border-neutral-200/80 p-6 flex flex-col justify-between hover:border-neutral-300 transition-colors">
              <div>
                <div className="w-10 h-10 rounded-xl bg-red-100/80 text-accent-red flex items-center justify-center mb-4">
                  <MapPin className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-neutral-950">Kitchen Location</h2>
                <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
                  {siteConfig.location.fullAddress}
                </p>
                <p className="mt-2 text-xs text-neutral-500 font-medium">
                  Landmark: {siteConfig.location.landmark}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-200">
                <a
                  href={siteConfig.location.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-accent-red hover:underline"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* 2. Phone & WhatsApp */}
            <div className="bg-neutral-50/70 rounded-2xl border border-neutral-200/80 p-6 flex flex-col justify-between hover:border-neutral-300 transition-colors">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center mb-4">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-neutral-950">Phone &amp; WhatsApp</h2>
                <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
                  For quick order inquiries, delivery updates, or batch pre-ordering assistance.
                </p>
                <div className="mt-3">
                  <a
                    href={`tel:${siteConfig.contact.phoneClean}`}
                    className="block text-base font-bold text-neutral-900 hover:text-accent-red transition-colors"
                  >
                    {siteConfig.contact.phone}
                  </a>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-200">
                <a
                  href={siteConfig.contact.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-700 hover:underline"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Chat on WhatsApp</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* 3. Official Email */}
            <div className="bg-neutral-50/70 rounded-2xl border border-neutral-200/80 p-6 flex flex-col justify-between hover:border-neutral-300 transition-colors">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-100/80 text-blue-700 flex items-center justify-center mb-4">
                  <Mail className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-neutral-950">Email Inquiries</h2>
                <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
                  For formal inquiries, catering bookings, press features, and business partnerships.
                </p>
                <div className="mt-3">
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="block text-sm font-bold text-neutral-900 hover:text-accent-red transition-colors break-all"
                  >
                    {siteConfig.contact.email}
                  </a>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-200">
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-700 hover:underline"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Send an Email</span>
                </a>
              </div>
            </div>

            {/* 4. Kitchen & Order Windows */}
            <div data-nosnippet className="bg-neutral-50/70 rounded-2xl border border-neutral-200/80 p-6 flex flex-col justify-between hover:border-neutral-300 transition-colors">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-100/80 text-amber-800 flex items-center justify-center mb-4">
                  <Clock className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-neutral-950">Operating Hours</h2>
                <ul className="mt-2 text-xs sm:text-sm text-neutral-600 space-y-1.5 leading-relaxed">
                  <li>
                    <span className="font-semibold text-neutral-900">Order Windows:</span> Daily 2:00 PM – 4:00 PM
                  </li>
                  <li>
                    <span className="font-semibold text-neutral-900">Ordering Closed:</span> Sundays
                  </li>
                  <li>
                    <span className="font-semibold text-neutral-900">Kitchen Closed:</span> Mondays &amp; Holidays
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-200">
                <Link
                  href="/delivery-policy"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-neutral-900 hover:text-accent-red"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>View Delivery Schedule</span>
                </Link>
              </div>
            </div>
          </section>

          {/* Deep Informational Details Section for Customers and AI Agents */}
          <section aria-label="Pickup and Logistics Guide" className="mt-12 space-y-8">
            <div className="bg-neutral-50 rounded-2xl border border-neutral-200/80 p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-950 flex items-center gap-2">
                <Truck className="w-5 h-5 text-accent-red" />
                <span>Pickup &amp; Courier Logistics</span>
              </h2>
              <div className="mt-4 text-sm sm:text-base text-neutral-600 space-y-3 leading-relaxed">
                <p>
                  Nepali Tales operates as a specialized culinary kitchen crafting limited-batch authentic Nepali dumplings and artisanal chilli oil. Because our dough is hand-rolled and freshly prepared every morning, pre-ordering 1 day ahead is strongly encouraged to ensure batch availability.
                </p>
                <p>
                  <strong className="text-neutral-900">Self Pickup:</strong> You may pick up orders directly from Metropolis Rivera, Shop No 10, Kasarvadavali, Thane West during your confirmed dispatch slot.
                </p>
                <p>
                  <strong className="text-neutral-900">Delivery Partners:</strong> We facilitate reliable doorstep dispatch across Thane and Mumbai using on-demand delivery logistics such as Porter and Borzo. Applicable courier delivery fees are transparently calculated at checkout based on distance.
                </p>
              </div>
            </div>

            <div className="bg-neutral-50 rounded-2xl border border-neutral-200/80 p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-950 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                <span>Customer Care &amp; Order Policies</span>
              </h2>
              <div className="mt-4 text-sm sm:text-base text-neutral-600 space-y-3 leading-relaxed">
                <p>
                  Our goal is to ensure every batch of momo reaches you steaming hot with the crisp crunch and soulful broths we perfected at Momo Ghar. If you need to make changes to your delivery address, timing, or items, please reach out via WhatsApp at least 3 hours prior to your dispatch window.
                </p>
                <p>
                  For complete details on order modifications, cancellations, and food safety standards, please review our official policies:
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Link
                    href="/terms-and-conditions"
                    className="inline-flex items-center px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white border border-neutral-200 text-neutral-800 hover:border-accent-red hover:text-accent-red transition-colors"
                  >
                    Terms &amp; Conditions
                  </Link>
                  <Link
                    href="/privacy-policy"
                    className="inline-flex items-center px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white border border-neutral-200 text-neutral-800 hover:border-accent-red hover:text-accent-red transition-colors"
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    href="/cancellation-policy"
                    className="inline-flex items-center px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white border border-neutral-200 text-neutral-800 hover:border-accent-red hover:text-accent-red transition-colors"
                  >
                    Cancellation &amp; Refund Policy
                  </Link>
                  <Link
                    href="/allergen-advisory"
                    className="inline-flex items-center px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white border border-neutral-200 text-neutral-800 hover:border-accent-red hover:text-accent-red transition-colors"
                  >
                    Allergen Advisory
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
