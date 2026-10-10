import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Cancellation and Refund Policy | ${siteConfig.name}`,
  description:
    "Understand Nepali Tales order cancellation window rules, 100% refund eligibility, post-window kitchen review guidelines, and refund processing timelines.",
  alternates: {
    canonical: `${siteConfig.url}/cancellation-policy`,
  },
};

export default function CancellationPolicyPage() {
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
              Order Management &amp; Refunds
            </span>
            <span className="text-xs text-neutral-300">•</span>
            <span className="text-xs font-medium text-neutral-500">
              {siteConfig.legalName}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-950 font-secondary">
            Cancellation &amp; Refund Policy
          </h1>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs sm:text-sm text-neutral-500 font-secondary">
            <span>Effective Date: October 2026</span>
            <span>•</span>
            <span>Last Updated: October 2026</span>
            <span>•</span>
            <span>Transparent Culinary Protocol</span>
          </div>

          <p className="mt-5 text-base sm:text-lg text-neutral-600 leading-relaxed font-secondary max-w-4xl">
            At {siteConfig.name}, our food is handcrafted fresh from scratch
            every morning and steamed to order. Because our culinary artisans
            commit fresh ingredients and custom preparations immediately upon
            order confirmation, we enforce a transparent, fair cancellation
            window and refund protocol.
          </p>
        </header>

        {/* Main Content Sections (Displayed directly without sidebar) */}
        <div className="pt-10 lg:pt-14 space-y-12 text-neutral-700 leading-relaxed text-base font-secondary">
          {/* Rule 1: 100% Refund in Window */}
          <section
            id="order-window"
            className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6 sm:p-8 space-y-4"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide bg-emerald-100 text-emerald-800">
                Full Refund Guarantee
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-emerald-950">
              Rule 1: Cancellation Within the Order Window (100% Refund)
            </h2>

            <p className="text-emerald-950/90 leading-relaxed">
              Customers may cancel their order freely within the designated{" "}
              <strong>Order Window</strong> immediately following order
              placement, prior to our kitchen staff initiating dough rolling,
              filling assembly, or steaming.
            </p>

            <div className="rounded-xl border border-emerald-200/80 bg-white p-4 text-emerald-950 text-sm font-medium">
              If an order is cancelled within the valid order window, the customer
              will receive an immediate, full 100% refund of the food amount paid.
            </div>
          </section>

          {/* Rule 2: Post-Window Cancellation */}
          <section
            id="post-window"
            className="rounded-2xl border border-neutral-200/90 bg-neutral-50/70 p-6 sm:p-8 space-y-4"
          >
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950">
              Rule 2: Cancellation After the Order Window Has Closed
            </h2>

            <p>
              Once the order window has closed, the order enters active
              preparation in the kitchen. At this stage, self-serve automated
              cancellation on the website is locked and unavailable.
            </p>

            <div className="rounded-xl border border-neutral-200 bg-white p-5 space-y-2 text-sm shadow-sm">
              <p className="font-bold text-neutral-950">
                How to Request Cancellation After the Window Closes:
              </p>
              <p className="text-neutral-600">
                You must immediately contact the kitchen directly via phone call
                or WhatsApp at{" "}
                <a
                  href={`tel:${siteConfig.contact.kitchenPhoneClean}`}
                  className="font-bold text-brand-red underline hover:text-[#b81b1b]"
                >
                  {siteConfig.contact.kitchenPhone}
                </a>
                .
              </p>
              <p className="text-neutral-600">
                WhatsApp Direct Link:{" "}
                <a
                  href={siteConfig.contact.kitchenWhatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-brand-red underline hover:text-[#b81b1b]"
                >
                  Chat with Nepali Tales Kitchen (+91 9309348875)
                </a>
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                Kitchen Discretionary Refund Decision:
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                The kitchen management will evaluate the request and determine
                the refund percentage (if any). Because handcrafted artisanal
                momos, traditional jhol broths, and specialty chilli oil incur
                immediate raw material costs and manual preparation for that
                specific selective order, refunds for post-window cancellations
                are assessed based on the stage of preparation:
              </p>
              <ul className="list-disc pl-5 text-sm space-y-1.5 text-neutral-600">
                <li>
                  If raw materials are already shaped, wrapped, or cooked for
                  your order, the cost of raw materials and handling will be
                  deducted.
                </li>
                <li>
                  If the order is already packed or ready for courier pickup, no
                  refund will be granted.
                </li>
                <li>
                  The final decision on discretionary refund value rests solely
                  with the kitchen manager.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section id="non-cancellable" className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950">
              3. Non-Cancellable Scenarios
            </h2>
            <p>
              Under the following conditions, an order is strictly ineligible
              for cancellation or refund:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-neutral-600">
              <li>
                <strong className="text-neutral-900">Dispatched Orders:</strong> Once a third-party delivery
                courier (Borzo / Porter rider) has picked up the order from our
                premises, the order cannot be cancelled or recalled.
              </li>
              <li>
                <strong className="text-neutral-900">Customer Unavailability:</strong> If the courier rider
                reaches the delivery location and is unable to reach the customer
                via phone or doorbell after multiple attempts.
              </li>
              <li>
                <strong className="text-neutral-900">Incorrect Delivery Address:</strong> If an incorrect,
                incomplete, or unreachable address was provided during order
                placement.
              </li>
              <li>
                <strong className="text-neutral-900">Change of Mind Post-Delivery:</strong> Freshly prepared
                food items cannot be returned or refunded once received.
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section id="damaged-items" className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950">
              4. Damaged, Incorrect, or Missing Items
            </h2>
            <p>
              In the rare event that you receive an incorrect item, missing
              dishes, or packaging damaged during courier transit:
            </p>
            <ol className="list-decimal pl-5 space-y-2 text-neutral-600">
              <li>
                Please notify our kitchen desk within <strong className="text-neutral-900">30 minutes</strong>{" "}
                of package receipt.
              </li>
              <li>
                Send clear photographs of the delivered package, food items,
                and receipt to our kitchen WhatsApp at{" "}
                <strong className="text-neutral-900">{siteConfig.contact.kitchenPhone}</strong>.
              </li>
              <li>
                Upon prompt review, our kitchen team will offer either an
                immediate replacement preparation or an appropriate refund for
                the affected item.
              </li>
            </ol>
          </section>

          {/* Section 5 */}
          <section id="disbursement-timelines" className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950">
              5. Refund Disbursement Timelines
            </h2>
            <p>
              All approved refunds are initiated through our payment gateway to
              the original payment method (UPI, Net Banking, Credit/Debit Card)
              used at checkout:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-neutral-600">
              <li>
                <strong className="text-neutral-900">UPI Refunds:</strong> Typically reflected within 24 to 48
                hours.
              </li>
              <li>
                <strong className="text-neutral-900">Cards &amp; Net Banking:</strong> Typically credited
                within 3 to 7 business days, subject to your issuing bank&apos;s
                clearing cycles.
              </li>
            </ul>
            <p className="text-sm text-neutral-500 pt-1">
              Note: As stated in our Delivery Policy, delivery charges paid
              directly to third-party courier riders in cash are strictly
              non-refundable by {siteConfig.name}.
            </p>
          </section>

          {/* Section 6 */}
          <section
            id="assistance-desk"
            className="pt-8 border-t border-neutral-200/80 space-y-4"
          >
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950">
              6. Need Assistance with Your Order?
            </h2>
            <p>
              To report urgent issues or request order cancellation, reach our
              kitchen directly:
            </p>

            <div className="rounded-2xl border border-neutral-200/90 bg-neutral-50/70 p-6 sm:p-8 space-y-3 text-sm">
              <p>
                <strong className="text-neutral-900">Dedicated Kitchen Helpline:</strong>{" "}
                <a
                  href={`tel:${siteConfig.contact.kitchenPhoneClean}`}
                  className="font-bold text-brand-red underline hover:text-[#b81b1b]"
                >
                  {siteConfig.contact.kitchenPhone}
                </a>{" "}
                (Call &amp; WhatsApp)
              </p>
              <p>
                <strong className="text-neutral-900">Customer Support:</strong>{" "}
                <a
                  href={`tel:${siteConfig.contact.phoneClean}`}
                  className="text-neutral-700 underline hover:text-brand-red"
                >
                  {siteConfig.contact.phone}
                </a>
              </p>
              <p>
                <strong className="text-neutral-900">Kitchen Operating Hours:</strong> 11:00 AM &ndash; 11:00
                PM (All 7 Days)
              </p>
              <p>
                <strong className="text-neutral-900">Kitchen Address:</strong> {siteConfig.location.fullAddress}
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
