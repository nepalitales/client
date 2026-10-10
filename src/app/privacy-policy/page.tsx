import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Privacy Policy | ${siteConfig.name}`,
  description:
    "Learn how Nepali Tales collects, uses, protects, and handles your personal information, order data, and website cookies.",
  alternates: {
    canonical: `${siteConfig.url}/privacy-policy`,
  },
};

export default function PrivacyPolicyPage() {
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
              Data Protection
            </span>
            <span className="text-xs text-neutral-300">•</span>
            <span className="text-xs font-medium text-neutral-500">
              {siteConfig.legalName}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-950 font-secondary">
            Privacy Policy
          </h1>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs sm:text-sm text-neutral-500 font-secondary">
            <span>Effective Date: October 2026</span>
            <span>•</span>
            <span>Last Updated: October 2026</span>
            <span>•</span>
            <span>Indian Data Protection Standards</span>
          </div>

          <p className="mt-5 text-base sm:text-lg text-neutral-600 leading-relaxed font-secondary max-w-4xl">
            At {siteConfig.name}, we value your trust and are committed to
            protecting your personal information. This Privacy Policy details
            how we collect, use, store, and disclose your data when you visit our
            website, place food orders, or communicate with our kitchen team.
          </p>
        </header>

        {/* Main Content Sections (Displayed directly without sidebar) */}
        <div className="pt-10 lg:pt-14 space-y-12 text-neutral-700 leading-relaxed text-base font-secondary">
          {/* Section 1 */}
          <section id="information-collected" className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950">
              1. Information We Collect
            </h2>
            <p>
              We collect information that you directly provide when browsing our
              menu or interacting with our ordering channels, as well as
              automated technical data:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-neutral-600">
              <li>
                <strong className="text-neutral-900">Personal Identifiers:</strong> Name, delivery address,
                landmark, active telephone or WhatsApp number, and email
                address.
              </li>
              <li>
                <strong className="text-neutral-900">Order &amp; Transaction Details:</strong> Dishes
                ordered, portion selections, spice customization notes, date and
                timestamp of orders, and payment confirmation IDs.
              </li>
              <li>
                <strong className="text-neutral-900">Logistics &amp; Delivery Information:</strong> Drop-off
                coordinates, recipient availability notes, and delivery partner
                dispatch records.
              </li>
              <li>
                <strong className="text-neutral-900">Technical &amp; Device Information:</strong> IP address,
                browser type, operating system, and session timestamps collected
                via standard server logs and cookies.
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section id="how-we-use" className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950">
              2. How We Use Your Information
            </h2>
            <p>
              Your personal information is utilized strictly to provide our
              culinary services efficiently:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-neutral-600">
              <li>Processing, handcrafting, and fulfilling your food orders.</li>
              <li>
                Coordinating dispatch with third-party courier services (Borzo /
                Porter).
              </li>
              <li>
                Communicating real-time updates regarding order status, kitchen
                delays, or delivery arrival via phone or WhatsApp.
              </li>
              <li>
                Addressing cancellation requests, refund evaluations, or kitchen
                support queries.
              </li>
              <li>
                Maintaining website integrity, debugging technical issues, and
                preventing fraudulent transactions.
              </li>
            </ul>
          </section>

          {/* Section 3 - Cookies Policy */}
          <section
            id="cookies-storage"
            className="rounded-2xl border border-neutral-200/90 bg-neutral-50/70 p-6 sm:p-8 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950">
                3. Cookies and Local Storage Policy
              </h2>
              <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-neutral-200/80 text-neutral-700">
                Storage &amp; Analytics
              </span>
            </div>
            <p className="text-neutral-700">
              Cookies are small files placed on your browser by websites you
              visit. {siteConfig.name} uses cookies and browser local storage to
              recognize your browser, retain cart items between page refreshes,
              and remember your consent preferences.
            </p>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wide">
                Categories of Cookies We Use:
              </h3>
              <ul className="list-disc pl-5 text-sm space-y-1.5 text-neutral-600">
                <li>
                  <strong className="text-neutral-900">Strictly Necessary Cookies:</strong> Essential for
                  core navigation, security tokens, and ensuring that page
                  sessions function smoothly.
                </li>
                <li>
                  <strong className="text-neutral-900">Functional Cookies:</strong> Store preferences such
                  as your acknowledgement of our Cookie Consent banner so you
                  are not prompted repeatedly.
                </li>
                <li>
                  <strong className="text-neutral-900">Performance &amp; Analytics:</strong> Help us
                  understand aggregated website traffic patterns, average load
                  times, and popular menu pages to improve user experience.
                </li>
              </ul>
            </div>

            <div className="space-y-2 pt-2 border-t border-neutral-200/70">
              <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wide">
                Your Cookie Choices:
              </h3>
              <p className="text-sm text-neutral-600">
                You can accept or decline non-essential cookies using the Cookie
                Consent banner presented on your first visit. You can also
                configure your browser to reject all cookies or alert you when a
                cookie is placed. If you disable cookies, please note that
                certain aspects of the interactive ordering interface may not
                function as intended.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section id="data-sharing" className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950">
              4. Data Sharing and Third-Party Disclosures
            </h2>
            <p>
              We do not sell, rent, trade, or monetize your personal
              information to any third-party advertisers or marketing agencies.
              Data sharing is limited strictly to operational necessity:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-neutral-600">
              <li>
                <strong className="text-neutral-900">Third-Party Delivery Logistics:</strong> We share your
                name, delivery address, and phone number with third-party courier
                riders (Borzo, Porter) solely to facilitate physical pickup and
                delivery of your food order.
              </li>
              <li>
                <strong className="text-neutral-900">Payment Gateways:</strong> Online transactions are
                processed through secure, RBI-compliant payment gateways. We do
                not store or have direct access to your credit card numbers,
                debit card PINs, or net banking passwords.
              </li>
              <li>
                <strong className="text-neutral-900">Legal Requirements:</strong> We may disclose information
                if mandated by applicable Indian law, government regulatory
                inquiries, or court orders to protect our rights, safety, or
                property.
              </li>
            </ul>
          </section>

          {/* Section 5 */}
          <section id="data-security" className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950">
              5. Data Security and Retention
            </h2>
            <p>
              We employ reasonable technical and organizational safeguards to
              protect personal data against unauthorized access, loss, misuse, or
              alteration. Communications via our digital storefront use
              industry-standard SSL encryption.
            </p>
            <p>
              We retain transaction and contact records for as long as necessary
              to comply with statutory tax, accounting, and consumer protection
              regulations under Indian law.
            </p>
          </section>

          {/* Section 6 */}
          <section id="privacy-rights" className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950">
              6. Your Privacy Rights
            </h2>
            <p>
              Under applicable Indian data protection principles, you hold the
              right to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-neutral-600">
              <li>
                Request verification or copies of personal data stored with us.
              </li>
              <li>Request correction of outdated or inaccurate information.</li>
              <li>
                Request deletion of your non-statutory contact details from our
                messaging systems.
              </li>
              <li>
                Opt out of receiving non-order promotional communications at any
                time.
              </li>
            </ul>
          </section>

          {/* Section 7 */}
          <section
            id="grievance-desk"
            className="pt-8 border-t border-neutral-200/80 space-y-4"
          >
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950">
              7. Grievance Officer and Privacy Inquiries
            </h2>
            <p>
              For questions, privacy grievances, or data correction requests,
              please reach out to our designated contact desk:
            </p>

            <div className="rounded-2xl border border-neutral-200/90 bg-neutral-50/70 p-6 sm:p-8 space-y-3 text-sm">
              <p>
                <strong className="text-neutral-900">Grievance &amp; Operations Desk:</strong>{" "}
                {siteConfig.legalName}
              </p>
              <p>
                <strong className="text-neutral-900">Kitchen Contact / WhatsApp:</strong>{" "}
                <a
                  href={`tel:${siteConfig.contact.kitchenPhoneClean}`}
                  className="text-brand-red font-medium underline hover:text-[#b81b1b]"
                >
                  {siteConfig.contact.kitchenPhone}
                </a>
              </p>
              <p>
                <strong className="text-neutral-900">Email Address:</strong>{" "}
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="text-brand-red font-medium underline hover:text-[#b81b1b]"
                >
                  {siteConfig.contact.email}
                </a>
              </p>
              <p>
                <strong className="text-neutral-900">Kitchen Location:</strong>{" "}
                {siteConfig.location.fullAddress}
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
