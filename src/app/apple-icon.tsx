import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#000000",
          borderRadius: "36px",
          color: "#FFFFFF",
          border: "4px solid #D92121",
        }}
      >
        <div
          style={{
            fontSize: "72px",
            fontWeight: 900,
            letterSpacing: "-2px",
            background: "linear-gradient(135deg, #FFFFFF 0%, #D92121 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          NT
        </div>
        <div
          style={{
            fontSize: "13px",
            letterSpacing: "3px",
            textTransform: "uppercase",
            color: "#CBD5E0",
            marginTop: "6px",
            fontWeight: 600,
          }}
        >
          Nepali Tales
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
