import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/terms",
        destination: "/terms-and-conditions",
        permanent: true,
      },
      {
        source: "/refund-policy",
        destination: "/cancellation-policy",
        permanent: true,
      },
      {
        source: "/refunds",
        destination: "/cancellation-policy",
        permanent: true,
      },
      {
        source: "/shipping-policy",
        destination: "/delivery-policy",
        permanent: true,
      },
      {
        source: "/shipping",
        destination: "/delivery-policy",
        permanent: true,
      },
      {
        source: "/allergen-info",
        destination: "/allergen-advisory",
        permanent: true,
      },
      {
        source: "/allergens",
        destination: "/allergen-advisory",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
