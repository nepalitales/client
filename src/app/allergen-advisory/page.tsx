import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Allergen & Food Advisory | ${siteConfig.name}`,
  description:
    "Important statutory allergen and dietary advisory regarding Monosodium Glutamate (MSG), peanuts, soybeans, sesame, and wheat in Nepali Tales dishes.",
  alternates: {
    canonical: `${siteConfig.url}/allergen-advisory`,
  },
};

export default function AllergenAdvisoryPage() {
  const declaredAllergens = [
    {
      name: "Peanut",
      presence: "Present in select dipping sauces, chutneys, and spice blends.",
      riskLevel: "Direct Ingredient",
    },
    {
      name: "Soybeans / Soy",
      presence: "Used in savoury stuffing seasonings, marinades, and dipping accompaniments.",
      riskLevel: "Direct Ingredient",
    },
    {
      name: "Sesame",
      presence: "Integral component in authentic Jhol broths, roasted sesame pastes, and artisanal chilli oil.",
      riskLevel: "Direct Ingredient",
    },
    {
      name: "Wheat (Gluten)",
      presence: "Found in all hand-rolled momo dough wrappers and pan-fried kothey flour coatings.",
      riskLevel: "Direct Ingredient",
    },
  ];

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
              Food Safety &amp; Statutory Compliance
            </span>
            <span className="text-xs text-neutral-300">•</span>
            <span className="text-xs font-medium text-neutral-500">
              FSSAI Registered Entity
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-950 font-secondary">
            Allergen &amp; Food Advisory
          </h1>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs sm:text-sm text-neutral-500 font-secondary">
            <span>Effective Date: October 2026</span>
            <span>•</span>
            <span>Last Updated: October 2026</span>
            <span>•</span>
            <span>FSSAI Compliant Declarations</span>
          </div>

          <p className="mt-5 text-base sm:text-lg text-neutral-600 leading-relaxed font-secondary max-w-4xl">
            At {siteConfig.name}, customer well-being, ingredient transparency,
            and food safety are fundamental to our kitchen operations. This page
            outlines our statutory food declarations under FSSAI regulations,
            declared kitchen allergens, and guidance for customers with food
            allergies or dietary sensitivities.
          </p>
        </header>

        {/* Main Content Sections (Displayed directly without sidebar) */}
        <div className="pt-10 lg:pt-14 space-y-12 text-neutral-700 leading-relaxed text-base font-secondary">
          {/* Mandatory Statutory MSG Declaration */}
          <section
            id="statutory-msg"
            className="rounded-2xl border border-red-200 bg-red-50/40 p-6 sm:p-8 space-y-4"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide bg-red-100 text-red-800">
                Mandatory Statutory Declaration
              </span>
            </div>

            <div className="rounded-xl border border-red-200 bg-white p-5 shadow-sm">
              <p className="text-base sm:text-lg font-bold text-neutral-950 uppercase leading-snug">
                This product contains added MONOSODIUM GLUTAMATE. NOT RECOMMENDED
                FOR INFANTS BELOW 12 MONTHS AND PREGNANT WOMEN.
              </p>
            </div>

            <p className="text-sm text-neutral-700 leading-relaxed">
              In strict accordance with the Food Safety and Standards Authority
              of India (FSSAI) labelling regulations, we transparently disclose
              the inclusion of Monosodium Glutamate (MSG) in seasoned dishes.
              Individuals with sensitivity to glutamate, pregnant women, and
              parents of infants under 12 months are strongly advised to note
              this advisory prior to ordering or consumption.
            </p>
          </section>

          {/* Section 1: Declared Allergens Grid */}
          <section id="declared-allergens" className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950">
              1. Declared Major Kitchen Allergens
            </h2>
            <p>
              The following common allergens are actively utilized in our
              culinary recipes and daily food preparation:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {declaredAllergens.map((allergen) => (
                <div
                  key={allergen.name}
                  className="rounded-2xl border border-neutral-200/90 bg-white p-5 sm:p-6 shadow-sm space-y-2 hover:border-neutral-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-neutral-950 uppercase tracking-wide">
                      {allergen.name}
                    </h3>
                    <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[11px] font-semibold text-neutral-700">
                      {allergen.riskLevel}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    {allergen.presence}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 2: Shared Facility & Cross-Contact */}
          <section
            id="shared-kitchen"
            className="rounded-2xl border border-neutral-200/90 bg-neutral-50/70 p-6 sm:p-8 space-y-3"
          >
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950">
              2. Shared Kitchen Environment &amp; Cross-Contact
            </h2>
            <p>
              While our kitchen staff adheres strictly to food hygiene, clean
              cookware protocols, and sanitized preparation surfaces, all our
              dishes are prepared within a shared artisanal kitchen space located
              at Shop No. 2, Metropolis Riveria, Kasarvadavali, Thane.
            </p>
            <p className="text-sm text-neutral-600">
              Because equipment, steamers, pan-frying surfaces, and utensils may
              come into contact with peanuts, soybeans, sesame seeds, and wheat
              flour throughout the day, we cannot guarantee an allergen-free
              environment for individuals with life-threatening or anaphylactic
              allergies.
            </p>
          </section>

          {/* Section 3: Dietary Restrictions */}
          <section id="dietary-instructions" className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950">
              3. Instructions for Customers with Dietary Restrictions
            </h2>
            <p>
              If you or any member of your dining group has specific allergies,
              food intolerances, or dietary questions:
            </p>
            <ol className="list-decimal pl-5 space-y-2 text-neutral-600 text-sm sm:text-base">
              <li>
                <strong className="text-neutral-900">Consult Before Ordering:</strong> Contact our kitchen
                directly before placing your order via phone or WhatsApp at{" "}
                <a
                  href={`tel:${siteConfig.contact.kitchenPhoneClean}`}
                  className="font-bold text-brand-red underline hover:text-[#b81b1b]"
                >
                  {siteConfig.contact.kitchenPhone}
                </a>
                .
              </li>
              <li>
                <strong className="text-neutral-900">Specify in Order Notes:</strong> Clearly state any
                ingredient exclusions (e.g., &quot;No peanut chutney&quot;,
                &quot;Mild spice, no chilli oil&quot;) during checkout.
              </li>
              <li>
                <strong className="text-neutral-900">Kitchen Confirmation:</strong> Our culinary team will
                confirm whether safe modification is feasible for the requested
                dish. If cross-contact cannot be ruled out, we will recommend
                safe alternative menu items or advise against ordering.
              </li>
            </ol>
          </section>

          {/* Section 4: Safe Handling */}
          <section id="fresh-handling" className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950">
              4. Safe Handling &amp; Consumption Notice
            </h2>
            <p>
              Freshly steamed dumplings and warm Nepali jhol broths are made
              daily without artificial preservatives. To ensure optimal taste,
              texture, and microbial safety:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-neutral-600 text-sm">
              <li>
                Consume food immediately upon delivery while piping hot.
              </li>
              <li>
                Do not leave cooked momo or warm broths at room temperature for
                extended periods.
              </li>
              <li>
                Store artisanal chilli oil in a cool, dry place and use a clean,
                dry spoon for each serving to preserve freshness.
              </li>
            </ul>
          </section>

          {/* Section 5: Support Desk */}
          <section
            id="ingredient-desk"
            className="pt-8 border-t border-neutral-200/80 space-y-4"
          >
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950">
              5. Have Questions Regarding Ingredients?
            </h2>
            <p>
              For ingredient inquiries or direct guidance from our culinary team:
            </p>

            <div className="rounded-2xl border border-neutral-200/90 bg-neutral-50/70 p-6 sm:p-8 space-y-3 text-sm">
              <p>
                <strong className="text-neutral-900">Direct Kitchen Line &amp; WhatsApp:</strong>{" "}
                <a
                  href={`tel:${siteConfig.contact.kitchenPhoneClean}`}
                  className="font-bold text-brand-red underline hover:text-[#b81b1b]"
                >
                  {siteConfig.contact.kitchenPhone}
                </a>
              </p>
              <p>
                <strong className="text-neutral-900">WhatsApp Messaging Link:</strong>{" "}
                <a
                  href={siteConfig.contact.kitchenWhatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-brand-red underline hover:text-[#b81b1b]"
                >
                  Chat with Kitchen on WhatsApp (+91 76780 97659)
                </a>
              </p>
              <p>
                <strong className="text-neutral-900">Kitchen Counter Address:</strong> {siteConfig.location.fullAddress}
              </p>
              <p>
                <strong className="text-neutral-900">FSSAI Registered Entity:</strong> {siteConfig.legalName}
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
