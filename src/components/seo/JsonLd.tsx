import { siteConfig } from "@/config/site";

export function RestaurantJsonLd({
  faqs,
}: {
  faqs?: Array<{ question: string; answer: string }>;
} = {}) {
  const restaurantSchema = {
    "@context": "https://schema.org",
    "@type": ["Restaurant", "FoodEstablishment"],
    "@id": `${siteConfig.url}/#restaurant`,
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    description: siteConfig.description,
    url: siteConfig.url,
    telephone: siteConfig.contact.phoneClean,
    email: siteConfig.contact.email,
    priceRange: siteConfig.priceRange,
    servesCuisine: siteConfig.cuisine,
    currenciesAccepted: siteConfig.currenciesAccepted,
    paymentAccepted: siteConfig.paymentAccepted,
    image: [
      `${siteConfig.url}/opengraph-image`,
      `${siteConfig.url}/icon.png`,
    ],
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
    sameAs: [siteConfig.contact.instagram],
    founder: siteConfig.founders.map((f) => ({
      "@type": "Person",
      name: f.name,
      jobTitle: f.role,
      description: f.details,
      birthPlace: {
        "@type": "Place",
        name: f.origin,
      },
    })),
    areaServed: siteConfig.serviceAreas.map((area) => ({
      "@type": "AdministrativeArea",
      name: area,
    })),
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "11:00",
        closes: "23:00",
      },
    ],
    menu: `${siteConfig.url}/#menu`,
    acceptsReservations: "False",
    potentialAction: {
      "@type": "OrderAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: siteConfig.contact.whatsapp,
        inLanguage: "en-IN",
        actionPlatform: [
          "http://schema.org/DesktopWebPlatform",
          "http://schema.org/MobileWebPlatform",
        ],
      },
      result: {
        "@type": "FoodOrder",
      },
    },
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: siteConfig.url,
    logo: `${siteConfig.url}/icon.png`,
    sameAs: [siteConfig.contact.instagram],
    description: siteConfig.description,
    foundingLocation: {
      "@type": "Place",
      name: "Jaigaon, Indo-Bhutan border, India",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: siteConfig.contact.phoneClean,
        contactType: "customer service",
        areaServed: "IN",
        availableLanguage: ["English", "Hindi", "Nepali"],
      },
    ],
    founders: siteConfig.founders.map((f) => ({
      "@type": "Person",
      name: f.name,
      jobTitle: f.role,
      description: f.details,
      knowsAbout: [
        "Himalayan Cuisine",
        "Authentic Momo Crafting",
        "Artisanal Chilli Oil",
        "Traditional Jhol",
      ],
    })),
  };

  const dynamicFaqEntities =
    faqs && faqs.length > 0
      ? faqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: f.answer,
          },
        }))
      : [
          {
            "@type": "Question",
            name: "Where is Nepali Tales located?",
            acceptedAnswer: {
              "@type": "Answer",
              text: `Nepali Tales is located at Metropolis Riveria, Shop No-2, Kasarvadavali, Ghodbunder Road, Thane, Maharashtra 400615. Contact: +91 76780 97659.`,
            },
          },
          {
            "@type": "Question",
            name: "Who founded Nepali Tales and what is their background?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Nepali Tales was founded by Ashika and Dipesh, two culinary creators from Jaigaon, a border town on the Indo-Bhutan border. Their journey began with Momo Ghar in 2022, continued through supper clubs, and Ashika's recognition on MasterChef India, culminating in Nepali Tales.",
            },
          },
          {
            "@type": "Question",
            name: "What makes Nepali Tales momos different from regular momos?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Ashika and Dipesh wake up at 5:00 AM daily to craft thin hand-rolled dough, fresh seasoned stuffing, slow-simmered herbal jhol, and fresh chutneys from scratch. They follow generational recipes from the Indo-Bhutan border rather than commercial shortcuts.",
            },
          },
          {
            "@type": "Question",
            name: "What is Nepali Tales' viral chilli oil?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Nepali Tales' artisanal chilli oil is a slow-infused condiment featuring aromatic roasted spices, crispy garlic, and select Himalayan chillies. It gained viral popularity on Instagram (@nepali_tales) and has become a household staple for diners across Thane and Mumbai.",
            },
          },
          {
            "@type": "Question",
            name: "How do I order from Nepali Tales?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "You can place your order directly via WhatsApp or phone at +91 76780 97659, email Nepalitales2025@gmail.com, or visit the outlet at Metropolis Riveria, Kasarvadavali, Ghodbunder Road, Thane.",
            },
          },
          {
            "@type": "Question",
            name: "What are the operating hours and delivery areas?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Nepali Tales operates daily from 11:00 AM to 11:00 PM, serving Kasarvadavali, Ghodbunder Road, Ovala, Waghbil, Manpada, Majiwada, Hiranandani Estate, and across Thane and Mumbai suburbs.",
            },
          },
        ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${siteConfig.url}/#faq`,
    mainEntity: dynamicFaqEntities,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: siteConfig.name,
        item: siteConfig.url,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
