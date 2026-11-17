import { ImageResponse } from "next/og";

export const alt = "VEXOR EDITZ | Video Editor Portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #08070D 55%, #2a1760 130%)",
          color: "#fff",
        }}
      >
        <div style={{ display: "flex", fontSize: 40, fontWeight: 800, letterSpacing: 2 }}>
          VEXOR<span style={{ color: "#8B5CF6" }}>.</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 128, fontWeight: 900, lineHeight: 0.95 }}>
            CRAFTING VISUALS
          </div>
          <div style={{ display: "flex", fontSize: 128, fontWeight: 900, lineHeight: 0.95 }}>
            THAT SPEAK.
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#A78BFA", letterSpacing: 4 }}>
          VIDEO EDITOR | MOTION GRAPHICS | CREATIVE STORYTELLING
        </div>
      </div>
    ),
    size,
  );
}
