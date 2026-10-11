import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Terms and Conditions | ${siteConfig.name}`,
  description:
    "Read the terms and conditions governing the use of the Nepali Tales website, online ordering, cookie usage, payments, and service policies.",
  alternates: {
    canonical: `${siteConfig.url}/terms-and-conditions`,
  },
};

export default function TermsAndConditionsPage() {
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
              Legal Agreement
            </span>
            <span className="text-xs text-neutral-300">•</span>
            <span className="text-xs font-medium text-neutral-500">
              {siteConfig.legalName}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-950 font-secondary">
            Terms and Conditions
          </h1>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs sm:text-sm text-neutral-500 font-secondary">
            <span>Effective Date: October 2026</span>
            <span>•</span>
            <span>Last Updated: October 2026</span>
            <span>•</span>
            <span>Registered Cloud Kitchen</span>
          </div>

          <p className="mt-5 text-base sm:text-lg text-neutral-600 leading-relaxed font-secondary max-w-4xl">
            Welcome to {siteConfig.name}. Please review these Terms and
            Conditions carefully before using our website or placing food
            orders with us. By accessing our platform, you agree to comply with
            and be bound by the following terms.
          </p>
        </header>

        {/* Main Content Sections (Displayed directly without sidebar) */}
        <div className="pt-10 lg:pt-14 space-y-12 text-neutral-700 leading-relaxed text-base font-secondary">
          {/* Section 1 */}
          <section id="acceptance" className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950">
              1. Acceptance of Terms
            </h2>
            <p>
              These Terms and Conditions constitute a legally binding agreement
              between you (the &quot;Customer&quot;, &quot;User&quot;, or
              &quot;You&quot;) and {siteConfig.legalName} (&quot;We&quot;,
              &quot;Us&quot;, or &quot;Our&quot;), operating from{" "}
              {siteConfig.location.fullAddress}. By visiting our website,
              browsing our menu, or submitting an order through web interfaces
              or direct messaging channels, you confirm that you are at least 18
              years of age or have legal guardian consent to transact.
            </p>
          </section>

          {/* Section 2 */}
          <section id="website-usage" className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950">
              2. How to Use the Website
            </h2>
            <p>
              Our website serves as a digital storefront and informational
              platform for authentic Nepali momo, signature jhol broths, and
              artisanal chilli oil prepared fresh daily at our kitchen in
              Thane. You may use this website to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-neutral-600">
              <li>Browse our live culinary menu, prices, and dish descriptions.</li>
              <li>Initiate food orders and direct kitchen inquiries.</li>
              <li>
                Access store locations, operating hours, and founder stories.
              </li>
              <li>Review our privacy, cancellation, and delivery policies.</li>
            </ul>
            <p>
              You agree not to misuse our website by introducing viruses,
              attempting unauthorized server access, scraping menu assets, or
              submitting fictitious orders. Any unauthorized or fraudulent use
              will lead to immediate termination of service and potential legal
              recourse.
            </p>
          </section>

          {/* Section 3 - Cookies Notice */}
          <section
            id="cookies"
            className="rounded-2xl border border-neutral-200/90 bg-neutral-50/70 p-6 sm:p-8 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950">
                3. Cookies and Tracking Technologies
              </h2>
              <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-neutral-200/80 text-neutral-700">
                Transparency Notice
              </span>
            </div>
            <p className="text-neutral-700">
              This website uses cookies and similar client-side storage
              technologies to deliver an efficient, secure, and customized
              browsing experience.
            </p>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wide">
                What are Cookies?
              </h3>
              <p className="text-sm text-neutral-600">
                Cookies are small text files placed on your browser or device
                when you visit web pages. They help remember your preferences,
                maintain ordering selections, and provide aggregated analytics
                on how users interact with our website.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wide">
                How We Use Cookies:
              </h3>
              <ul className="list-disc pl-5 text-sm space-y-1 text-neutral-600">
                <li>
                  <strong className="text-neutral-900">Essential Cookies:</strong> Required for fundamental site
                  features, such as navigation, security tokens, and preserving order
                  details.
                </li>
                <li>
                  <strong className="text-neutral-900">Preference Cookies:</strong> Remember your cookie
                  consent decision and interface preferences across sessions.
                </li>
                <li>
                  <strong className="text-neutral-900">Analytical Cookies:</strong> Help us measure traffic,
                  identify broken links, and optimize page load speed without
                  storing sensitive personal information.
                </li>
              </ul>
            </div>

            <div className="space-y-2 pt-2 border-t border-neutral-200/70">
              <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wide">
                Managing Cookie Choices &amp; Consent Pop-Up:
              </h3>
              <p className="text-sm text-neutral-600">
                When you first visit {siteConfig.name}, a cookie consent banner
                is displayed allowing you to Accept or Decline cookies. You can
                also modify your browser settings at any time to block or delete
                cookies. Note that declining essential cookies may impact certain
                interactive features of the website. For further details, please
                consult our{" "}
                <Link
                  href="/privacy-policy"
                  className="font-semibold text-brand-red underline hover:text-[#b81b1b]"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section id="ordering-accuracy" className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950">
              4. Accuracy of Ordering Information
            </h2>
            <p>
              When placing an order, you agree to provide complete, truthful,
              and accurate details including your full name, active telephone
              number, and specific delivery address with recognizable landmarks.
              We are not responsible for delivery delays, non-delivery, or
              misdirected parcels arising from inaccurate or incomplete customer
              details.
            </p>
          </section>

          {/* Section 5 */}
          <section id="pricing-billing" className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950">
              5. Pricing, Menu Availability &amp; Billing
            </h2>
            <p>
              All prices listed on the website are displayed in Indian Rupees
              (INR) and represent the food item cost. Due to our fresh, batch-made
              preparation model, menu items are subject to daily availability and
              may sell out without prior notification.
            </p>

            <div className="rounded-2xl border border-amber-200/80 bg-amber-50/50 p-6 space-y-2 text-amber-950">
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-900">
                Important Delivery Charge Notice
              </h3>
              <p className="text-sm leading-relaxed text-amber-900/90">
                As detailed in our{" "}
                <Link
                  href="/delivery-policy"
                  className="font-bold underline text-amber-950 hover:text-brand-red"
                >
                  Delivery Policy
                </Link>
                , courier delivery charges via third-party services (Borzo / Porter)
                are strictly excluded from the food bill and must be settled by
                the customer directly with the courier rider upon delivery on a
                Cash on Delivery (COD) basis.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section id="cancellations" className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950">
              6. Cancellations and Refunds
            </h2>
            <p>
              Order cancellations and refunds are subject strictly to our dedicated{" "}
              <Link
                href="/cancellation-policy"
                className="font-semibold text-brand-red underline hover:text-[#b81b1b]"
              >
                Cancellation &amp; Refund Policy
              </Link>
              . Orders cancelled within the designated order window qualify for
              a 100% refund. Once the order window has elapsed, automated
              cancellations are locked and any discretionary refund consideration
              requires contacting our kitchen directly at{" "}
              <strong>{siteConfig.contact.kitchenPhone}</strong>.
            </p>
          </section>

          {/* Section 7 */}
          <section id="allergens-msg" className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950">
              7. Food Allergens, Statutory MSG &amp; Consumption Advisory
            </h2>
            <p>
              Our dishes are handcrafted using authentic Nepali recipes.
              In accordance with FSSAI statutory labelling requirements, select
              seasoned dishes contain added Monosodium Glutamate (MSG).{" "}
              <strong className="text-neutral-950">
                Not recommended for infants below 12 months and pregnant women.
              </strong>
            </p>
            <p>
              Our kitchen processes and handles major allergens including{" "}
              <strong>peanuts, soybeans, sesame, and wheat (gluten)</strong>.
              For our comprehensive allergen chart and dietary guidance, please
              review our dedicated{" "}
              <Link
                href="/allergen-advisory"
                className="font-semibold text-brand-red underline hover:text-[#b81b1b]"
              >
                Allergen &amp; Food Advisory
              </Link>
              . If you have known food sensitivities, please notify our kitchen
              desk at <strong>{siteConfig.contact.kitchenPhone}</strong> prior
              to ordering.
            </p>
          </section>

          {/* Section 8 */}
          <section id="intellectual-property" className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950">
              8. Intellectual Property
            </h2>
            <p>
              All content on this website, including but not limited to brand
              names, logos, menu copy, culinary photographs, artwork, recipes,
              and design elements, is the exclusive intellectual property of{" "}
              {siteConfig.legalName}. Any reproduction, distribution, or
              commercial exploitation without prior written consent is strictly
              prohibited.
            </p>
          </section>

          {/* Section 9 */}
          <section id="governing-law" className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950">
              9. Governing Law and Jurisdiction
            </h2>
            <p>
              These Terms and Conditions shall be governed by and construed in
              accordance with the laws of India. Any disputes arising out of or
              in connection with these terms or your transactions with{" "}
              {siteConfig.name} shall be subject to the exclusive jurisdiction
              of the competent courts located in Thane / Mumbai, Maharashtra,
              India.
            </p>
          </section>

          {/* Section 10 */}
          <section
            id="contact-desk"
            className="pt-8 border-t border-neutral-200/80 space-y-4"
          >
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950">
              10. Contact Information &amp; Kitchen Desk
            </h2>
            <p>
              If you have questions, feedback, or need clarification regarding
              these Terms and Conditions, please contact us:
            </p>

            <div className="rounded-2xl border border-neutral-200/90 bg-neutral-50/70 p-6 sm:p-8 space-y-3 text-sm">
              <p>
                <strong className="text-neutral-900">Kitchen &amp; Operations Desk:</strong>{" "}
                <a
                  href={`tel:${siteConfig.contact.kitchenPhoneClean}`}
                  className="text-brand-red font-medium underline hover:text-[#b81b1b]"
                >
                  {siteConfig.contact.kitchenPhone}
                </a>{" "}
                (Call &amp; WhatsApp)
              </p>
              <p>
                <strong className="text-neutral-900">Customer Support Phone:</strong>{" "}
                <a
                  href={`tel:${siteConfig.contact.phoneClean}`}
                  className="text-brand-red font-medium underline hover:text-[#b81b1b]"
                >
                  {siteConfig.contact.phone}
                </a>
              </p>
              <p>
                <strong className="text-neutral-900">Email:</strong>{" "}
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="text-brand-red font-medium underline hover:text-[#b81b1b]"
                >
                  {siteConfig.contact.email}
                </a>
              </p>
              <p>
                <strong className="text-neutral-900">Physical Address:</strong>{" "}
                {siteConfig.location.fullAddress}
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
