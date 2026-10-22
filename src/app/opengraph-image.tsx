import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import path from "node:path";

export const alt = "Invoicely — free online invoice maker by Saarthi Studio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function font(file: string, weight: 400 | 700) {
  return {
    name: "Inter",
    data: readFileSync(path.join(process.cwd(), "public", "fonts", file)),
    weight,
    style: "normal" as const,
  };
}

const GLYPH_BARS = [
  { width: 44, height: 12, color: "#4f46e5", radius: 6 },
  { width: 32, height: 9, color: "#c7d2fe", radius: 5 },
  { width: 26, height: 13, color: "#4f46e5", radius: 7, selfEnd: true },
];

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
          backgroundColor: "#4f46e5",
          padding: "72px 80px",
          fontFamily: "Inter",
          color: "#ffffff",
        }}
      >
        {/* Brand row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <div
              style={{
                width: 96,
                height: 96,
                backgroundColor: "#ffffff",
                borderRadius: 22,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: "7px",
                padding: "0 20px",
              }}
            >
              {GLYPH_BARS.map((bar) => (
                <div
                  key={bar.width}
                  style={{
                    width: bar.width,
                    height: bar.height,
                    backgroundColor: bar.color,
                    borderRadius: bar.radius,
                    marginLeft: bar.selfEnd ? "auto" : 0,
                  }}
                />
              ))}
            </div>
            <div style={{ display: "flex", fontSize: 40, fontWeight: 700, letterSpacing: "-1.5px" }}>
              Invoicely
            </div>
          </div>
          <div style={{ display: "flex", fontSize: 26, color: "rgba(255,255,255,0.8)" }}>
            by Saarthi Studio
          </div>
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              display: "flex",
              fontSize: 62,
              fontWeight: 700,
              letterSpacing: "-2px",
              lineHeight: 1.15,
              maxWidth: 940,
            }}
          >
            Create professional invoices in your browser
          </div>
          <div style={{ display: "flex", fontSize: 30, color: "rgba(255,255,255,0.85)" }}>
            Free, no sign-up — download them as PDF in seconds.
          </div>
        </div>

        {/* Facts */}
        <div style={{ display: "flex", gap: "16px" }}>
          {["Free forever", "Nothing leaves your device", "12 currencies"].map((chip) => (
            <div
              key={chip}
              style={{
                display: "flex",
                fontSize: 24,
                padding: "14px 28px",
                borderRadius: 999,
                color: "rgba(255,255,255,0.95)",
                border: "1.5px solid rgba(255,255,255,0.35)",
              }}
            >
              {chip}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size, fonts: [font("Inter-Regular.ttf", 400), font("Inter-Bold.ttf", 700)] },
  );
}
