import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Delivery Policy | ${siteConfig.name}`,
  description:
    "Learn about Nepali Tales delivery terms, third-party Borzo and Porter courier dispatch, cash-on-delivery rider payment terms, and delivery coverage across Thane.",
  alternates: {
    canonical: `${siteConfig.url}/delivery-policy`,
  },
};

export default function DeliveryPolicyPage() {
  return (
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
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-700 border border-neutral-200">
              Logistics &amp; Shipping
            </span>
            <span className="text-xs text-neutral-300">•</span>
            <span className="text-xs font-medium text-neutral-500">
              {siteConfig.legalName}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-950 font-secondary">
            Delivery Policy
          </h1>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs sm:text-sm text-neutral-500 font-secondary">
            <span>Effective Date: October 2026</span>
            <span>•</span>
            <span>Last Updated: October 2026</span>
            <span>•</span>
            <span>Direct Point-to-Point Logistics</span>
          </div>

          <p className="mt-5 text-base sm:text-lg text-neutral-600 leading-relaxed font-secondary max-w-4xl">
            To bring hot, freshly steamed Nepali momo, soulful jhol broths,
            and artisanal chilli oil directly to your doorstep, {siteConfig.name}{" "}
            partners with dedicated on-demand third-party courier services.
            Please read this policy carefully regarding delivery payments,
            logistics partners, and dispatch protocols.
          </p>
        </header>

        {/* Main Content Sections (Displayed directly without sidebar) */}
        <div className="pt-10 lg:pt-14 space-y-12 text-neutral-700 leading-relaxed text-base font-secondary">
          {/* Key Notice: Delivery Payment Terms */}
          <section
            id="payment-terms"
            className="rounded-2xl border border-amber-200/90 bg-amber-50/50 p-6 sm:p-8 space-y-4 text-amber-950"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide bg-amber-200/80 text-amber-900">
                Statutory Payment Term
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-amber-950">
              Important: Delivery Payment Terms &amp; Conditions
            </h2>

            <div className="space-y-3 text-sm sm:text-base leading-relaxed text-amber-900/90">
              <p>
                <strong className="text-amber-950">1. Customer Responsibility for Delivery:</strong> The
                customer is strictly responsible for paying both the food order
                amount AND the delivery charges.
              </p>
              <p>
                <strong className="text-amber-950">2. Brand Will Not Pay Delivery Charges:</strong>{" "}
                {siteConfig.name} does not pay or absorb the courier delivery
                charges.
              </p>
              <p>
                <strong className="text-amber-950">3. Cash on Delivery (COD) for Delivery Fee:</strong> All
                delivery charges must be paid directly to the courier rider upon
                arrival at your doorstep via Cash on Delivery (COD) or rider UPI.
              </p>
              <p>
                <strong className="text-amber-950">4. Excluded from Brand Food Bill:</strong> The delivery
                fee is completely separate and excluded from the main brand food
                invoice issued by {siteConfig.name}. Your restaurant receipt
                reflects only the food and packaging items.
              </p>
            </div>
          </section>

          {/* Section 1 */}
          <section id="courier-partners" className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950">
              1. Third-Party Courier Partners (Borzo &amp; Porter)
            </h2>
            <p>
              All deliveries from our kitchen at Metropolis Riveria, Kasarvadavali,
              Ghodbunder Road, Thane, are dispatched using reputable third-party
              on-demand point-to-point courier networks, primarily:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-neutral-600">
              <li>
                <strong className="text-neutral-900">Borzo (WeFast):</strong> Two-wheeler direct courier
                dispatch for swift residential orders across Thane and Mumbai
                suburbs.
              </li>
              <li>
                <strong className="text-neutral-900">Porter Courier Service:</strong> On-demand bike and
                commercial logistics for local deliveries and bulk catering
                orders.
              </li>
            </ul>
            <p>
              Once your food is freshly cooked and packed, our kitchen staff
              books a dedicated courier rider who collects the parcel directly
              from our counter and navigates straight to your delivery location.
            </p>
          </section>

          {/* Section 2 */}
          <section id="fee-calculation" className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950">
              2. How Delivery Charges are Determined
            </h2>
            <p>
              Because delivery is performed by independent platforms (Borzo /
              Porter), the exact delivery fee is calculated in real time based
              on:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-neutral-600">
              <li>Distance in kilometers from our kitchen in Kasarvadavali to your destination.</li>
              <li>Time of day and peak traffic congestion on Ghodbunder Road.</li>
              <li>Weather conditions (such as monsoon surges or heavy rains).</li>
              <li>Base pricing tariffs published by the chosen courier partner.</li>
            </ul>
            <p className="text-sm text-neutral-500 pt-1">
              Before or upon dispatch, our kitchen team can share the courier
              booking screenshot or estimated rider fee so you know the exact
              cash amount to pay the rider upon arrival.
            </p>
          </section>

          {/* Section 3 */}
          <section id="service-areas" className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950">
              3. Service Areas and Coverage
            </h2>
            <p>
              We service delivery destinations across Thane and surrounding
              Mumbai Suburban areas within reasonable courier transit radius:
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {siteConfig.serviceAreas.map((area) => (
                <span
                  key={area}
                  className="rounded-full border border-neutral-200/90 bg-neutral-100/80 px-3 py-1 text-xs font-medium text-neutral-700"
                >
                  {area}
                </span>
              ))}
            </div>

            <p className="text-xs text-neutral-500 pt-1">
              Deliveries to locations beyond our standard transit radius can be
              arranged on special request via Porter, subject to prevailing
              courier availability and transit times.
            </p>
          </section>

          {/* Section 4 */}
          <section id="dispatch-timelines" className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950">
              4. Preparation Timelines &amp; Dispatch Protocol
            </h2>
            <p>
              Our food is never pre-microwaved or kept under heat lamps. Every
              order follows a strict culinary workflow:
            </p>
            <ol className="list-decimal pl-5 space-y-2 text-neutral-600">
              <li>
                <strong className="text-neutral-900">Kitchen Preparation:</strong> 20 to 35 minutes depending
                on order size, dish variety, and whether momo are steamed or
                crispy kothey pan-fried.
              </li>
              <li>
                <strong className="text-neutral-900">Courier Assignment:</strong> A rider is assigned
                simultaneously as food enters its final steaming stage.
              </li>
              <li>
                <strong className="text-neutral-900">Transit:</strong> Transit duration depends on distance
                and Ghodbunder Road traffic flow. Average transit time is 15 to
                40 minutes.
              </li>
            </ol>
          </section>

          {/* Section 5 */}
          <section id="customer-availability" className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950">
              5. Customer Availability and Address Accuracy
            </h2>
            <p>
              To ensure seamless receipt of hot food and prevent transit
              spoilage:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-neutral-600">
              <li>
                Please ensure your contact telephone number is reachable at all
                times during the delivery window.
              </li>
              <li>
                Provide precise building names, wing/flat numbers, entry gates,
                and recognizable landmarks.
              </li>
              <li>
                Courier riders will wait up to a maximum of 10 minutes at the
                delivery address. If the recipient remains unreachable, the
                rider may return or dispose of the parcel per courier policy.
                The brand is not liable for non-delivery or refunds due to
                customer unreachability.
              </li>
            </ul>
          </section>

          {/* Section 6 */}
          <section id="packaging-safety" className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950">
              6. Packaging Integrity and Food Safety
            </h2>
            <p>
              All momo plates, signature broths (jhol), and artisanal chilli oil
              jars are packed in high-grade, food-safe, tamper-evident containers
              designed to minimize heat loss and prevent leakage during
              two-wheeler transit.
            </p>
            <p>
              For traditional Jhol Momo, broth and dumplings are packaged
              separately to ensure dumplings retain their tender wrapper texture
              until you pour the piping hot broth at home.
            </p>
          </section>

          {/* Section 7 - Self Pickup */}
          <section
            id="self-pickup"
            className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6 sm:p-8 space-y-2 text-emerald-950"
          >
            <h3 className="text-base sm:text-lg font-bold text-emerald-950">
              Prefer to Pick Up Yourself? Zero Delivery Charges
            </h3>
            <p className="text-sm leading-relaxed text-emerald-900/90">
              If you prefer not to pay third-party courier fees, you are warmly
              welcome to place your order in advance and self pick-up directly
              from our kitchen counter:
            </p>
            <p className="text-sm font-bold text-emerald-950 pt-1">
              Kitchen Counter Address: {siteConfig.location.fullAddress}
            </p>
          </section>

          {/* Section 8 */}
          <section
            id="tracking-desk"
            className="pt-8 border-t border-neutral-200/80 space-y-4"
          >
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950">
              7. Delivery Assistance &amp; Rider Tracking Desk
            </h2>
            <p>
              For real-time delivery status, rider tracking links, or delivery
              coordination, please contact our kitchen desk:
            </p>

            <div className="rounded-2xl border border-neutral-200/90 bg-neutral-50/70 p-6 sm:p-8 space-y-3 text-sm">
              <p>
                <strong className="text-neutral-900">Kitchen Direct Line / WhatsApp:</strong>{" "}
                <a
                  href={`tel:${siteConfig.contact.kitchenPhoneClean}`}
                  className="font-bold text-brand-red underline hover:text-[#b81b1b]"
                >
                  {siteConfig.contact.kitchenPhone}
                </a>
              </p>
              <p>
                <strong className="text-neutral-900">WhatsApp Chat Link:</strong>{" "}
                <a
                  href={siteConfig.contact.kitchenWhatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-brand-red underline hover:text-[#b81b1b]"
                >
                  Message Nepali Tales Kitchen on WhatsApp
                </a>
              </p>
              <p>
                <strong className="text-neutral-900">Kitchen Operations Hours:</strong> 11:00 AM &ndash; 11:00
                PM Daily
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
