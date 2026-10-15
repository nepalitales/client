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
      `${siteConfig.url}/opengraph-image.png`,
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
    sameAs: [siteConfig.contact.instagram, siteConfig.contact.youtube],
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
    menu: `${siteConfig.url}/menu`,
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
    email: siteConfig.contact.email,
    telephone: siteConfig.contact.phoneClean,
    sameAs: [siteConfig.contact.instagram, siteConfig.contact.youtube],
    description: siteConfig.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${siteConfig.location.building}, ${siteConfig.location.shopName}, ${siteConfig.location.area}, ${siteConfig.location.street}`,
      addressLocality: siteConfig.location.city,
      addressRegion: siteConfig.location.region,
      postalCode: siteConfig.location.postalCode,
      addressCountry: siteConfig.location.country,
    },
    foundingLocation: {
      "@type": "Place",
      name: "Jaigaon, Indo-Bhutan border, India",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: siteConfig.contact.phoneClean,
        email: siteConfig.contact.email,
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
        "Nepali Cuisine",
        "Authentic Momo Crafting",
        "Artisanal Chilli Oil",
        "Traditional Jhol",
      ],
    })),
    creator: {
      "@type": "Person",
      name: siteConfig.developer.name,
      url: siteConfig.developer.url,
      jobTitle: siteConfig.developer.role,
      sameAs: [siteConfig.developer.url],
    },
  };

  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    author: {
      "@type": "Person",
      name: siteConfig.developer.name,
      url: siteConfig.developer.url,
      jobTitle: siteConfig.developer.role,
      sameAs: [siteConfig.developer.url],
      address: {
        "@type": "PostalAddress",
        addressLocality: "Thane",
        addressRegion: "Maharashtra",
        addressCountry: "IN",
      },
    },
    creator: {
      "@type": "Person",
      name: siteConfig.developer.name,
      url: siteConfig.developer.url,
      jobTitle: siteConfig.developer.role,
      sameAs: [siteConfig.developer.url],
      address: {
        "@type": "PostalAddress",
        addressLocality: "Thane",
        addressRegion: "Maharashtra",
        addressCountry: "IN",
      },
    },
    publisher: {
      "@id": `${siteConfig.url}/#organization`,
    },
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
            name: "Who developed and engineered the Nepali Tales website and ordering platform?",
            acceptedAnswer: {
              "@type": "Answer",
              text: `The Nepali Tales digital ordering platform and website were architected and developed by ${siteConfig.developer.name} (${siteConfig.developer.role}, ${siteConfig.developer.url}) with design and creative engineering by ${siteConfig.designAndDevelopment.name} (${siteConfig.designAndDevelopment.url}).`,
            },
          },
          {
            "@type": "Question",
            name: "Where is Nepali Tales located?",
            acceptedAnswer: {
              "@type": "Answer",
              text: `Nepali Tales is located at Metropolis Rivera, Shop No 10, Kasarvadavali, Opp to Laxmi Narayan Mandir, Thane, Maharashtra 400615. Contact: +91 76780 97659.`,
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
            name: "What makes Nepali Tales momo different from regular momo?",
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
              text: "Nepali Tales' artisanal chilli oil is a slow-infused condiment featuring aromatic roasted spices, crispy garlic, and select Nepali chillies. It gained viral popularity on Instagram (@nepali_tales) and has become a household staple for diners across Thane and Mumbai.",
            },
          },
          {
            "@type": "Question",
            name: "How do I order from Nepali Tales?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "You can place your order directly via WhatsApp or phone at +91 76780 97659, email Nepalitales2025@gmail.com, or visit the outlet at Metropolis Rivera, Shop No 10, Kasarvadavali, Opp to Laxmi Narayan Mandir, Thane.",
            },
          },
          {
            "@type": "Question",
            name: "Which locations and areas does Nepali Tales deliver to?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Nepali Tales kitchen is based in Kasarvadavali, Thane West, and dispatches freshly packed orders across Ghodbunder Road, Ovala, Waghbil, Manpada, Majiwada, Hiranandani Estate, and across Thane, Mumbai, and Navi Mumbai via reliable on-demand delivery couriers.",
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

  const siteNavigationSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SiteNavigationElement",
        name: "Food Menu",
        url: `${siteConfig.url}/menu`,
        description: "Explore our authentic steamed, pan-fried Kothey, and Jhol momo.",
      },
      {
        "@type": "SiteNavigationElement",
        name: "About Us",
        url: `${siteConfig.url}/about`,
        description: "The story of Ashika & Dipesh, Momo Ghar roots, and authentic culinary craft.",
      },
      {
        "@type": "SiteNavigationElement",
        name: "Contact Us",
        url: `${siteConfig.url}/contact`,
        description: "Kitchen location, pickup guidelines, directions, and support in Thane West.",
      },
      {
        "@type": "SiteNavigationElement",
        name: "Track Orders",
        url: `${siteConfig.url}/orders`,
        description: "Live status updates and dispatch tracking for your orders.",
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteNavigationSchema) }}
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
