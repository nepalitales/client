import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #D92121 0%, #2B471F 100%)",
          borderRadius: "8px",
          color: "#FFFFFF",
          fontSize: "14px",
          fontWeight: 800,
          letterSpacing: "-0.5px",
        }}
      >
        NT
      </div>
    ),
    {
      ...size,
    }
  );
}
