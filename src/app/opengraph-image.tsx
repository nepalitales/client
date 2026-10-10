import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const alt = "Nepali Tales — Authentic Himalayan Momos & Artisanal Chilli Oil";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 70px",
          background: "#000000",
          color: "#ffffff",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
        }}
      >
        {/* Subtle decorative glow */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(217, 33, 33, 0.35) 0%, rgba(0,0,0,0) 70%)",
          }}
        />

        {/* Top Header Tag */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              padding: "8px 20px",
              borderRadius: "9999px",
              fontSize: "16px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: "#F6AD55",
            }}
          >
            Indo-Bhutan Roots • MasterChef India Craft
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#E2E8F0",
              fontSize: "18px",
            }}
          >
            Kasarvadavali, Ghodbunder Rd, Thane
          </div>
        </div>

        {/* Brand Name & Tagline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              fontSize: "68px",
              fontWeight: 800,
              letterSpacing: "-1.5px",
              lineHeight: 1.05,
              background: "linear-gradient(90deg, #FFFFFF 30%, #FBD38D 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            {siteConfig.name}
          </div>
          <div
            style={{
              fontSize: "30px",
              fontWeight: 500,
              color: "#FED7D7",
              lineHeight: 1.3,
              maxWidth: "850px",
            }}
          >
            {siteConfig.tagline}
          </div>
          <div
            style={{
              fontSize: "20px",
              color: "#CBD5E0",
              marginTop: "8px",
            }}
          >
            Handcrafted fresh daily by Ashika & Dipesh • Traditional Jhol • Viral Chilli Oil
          </div>
        </div>

        {/* Footer Badges */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255, 255, 255, 0.12)",
            paddingTop: "24px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <div style={{ fontSize: "14px", color: "#A0AEC0", textTransform: "uppercase", letterSpacing: "1px" }}>
              Kitchen Location
            </div>
            <div style={{ fontSize: "18px", fontWeight: 600, color: "#FFFFFF" }}>
              Shop No. 2, Metropolis Riveria, Thane — 400615
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              background: "#D92121",
              color: "#FFFFFF",
              padding: "12px 24px",
              borderRadius: "12px",
              fontSize: "20px",
              fontWeight: 700,
            }}
          >
            Order: {siteConfig.contact.phone}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
