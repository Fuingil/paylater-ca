import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "paylater.ca — Premium Domain Satılık";
export const size = { width: 1200, height: 630 };
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
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #030712 0%, #0f172a 50%, #064e3b 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 96,
            fontWeight: 800,
            letterSpacing: "-0.04em",
            display: "flex",
            alignItems: "baseline",
          }}
        >
          <span style={{ color: "#34d399" }}>paylater</span>
          <span style={{ color: "#f8fafc" }}>.ca</span>
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 32,
            color: "#94a3b8",
            fontWeight: 500,
          }}
        >
          Premium Domain Satılık — BNPL & Fintech
        </div>
        <div
          style={{
            marginTop: 48,
            padding: "12px 32px",
            borderRadius: 16,
            background: "#10b981",
            color: "#030712",
            fontSize: 24,
            fontWeight: 700,
          }}
        >
          Teklif Verin →
        </div>
      </div>
    ),
    { ...size },
  );
}
