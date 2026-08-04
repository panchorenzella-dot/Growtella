import { ImageResponse } from "next/og";

export const alt = "Growtella — herramientas para hacer crecer tu negocio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background: "#f7fbf8",
        color: "#10291f",
        display: "flex",
        fontFamily: "Arial, sans-serif",
        height: "100%",
        justifyContent: "center",
        padding: "64px",
        width: "100%",
      }}
    >
      <div
        style={{
          alignItems: "center",
          background: "white",
          border: "2px solid #d3e4d9",
          borderRadius: "48px",
          boxShadow: "0 30px 80px rgba(21, 63, 46, 0.12)",
          display: "flex",
          height: "100%",
          justifyContent: "space-between",
          overflow: "hidden",
          padding: "72px",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            background: "#dff4e7",
            borderRadius: "999px",
            height: "360px",
            position: "absolute",
            right: "-130px",
            top: "-150px",
            width: "360px",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", maxWidth: "780px" }}>
          <div style={{ alignItems: "center", display: "flex", gap: "18px" }}>
            <div
              style={{
                alignItems: "center",
                background: "#153f2e",
                borderRadius: "18px",
                color: "white",
                display: "flex",
                fontSize: "34px",
                fontWeight: 900,
                height: "64px",
                justifyContent: "center",
                width: "64px",
              }}
            >
              G
            </div>
            <span style={{ fontSize: "36px", fontWeight: 900, letterSpacing: "-1.5px" }}>
              Growtella
            </span>
          </div>
          <div
            style={{
              fontSize: "67px",
              fontWeight: 900,
              letterSpacing: "-4px",
              lineHeight: 1.02,
              marginTop: "54px",
            }}
          >
            Decisiones más claras. Negocios que crecen mejor.
          </div>
          <div style={{ color: "#577066", fontSize: "25px", marginTop: "30px" }}>
            Calculadoras, inteligencia artificial y herramientas simples para emprender.
          </div>
        </div>
        <div
          style={{
            alignItems: "center",
            background: "#153f2e",
            borderRadius: "999px",
            bottom: "48px",
            color: "#a7e8c1",
            display: "flex",
            fontSize: "18px",
            fontWeight: 800,
            padding: "16px 24px",
            position: "absolute",
            right: "48px",
          }}
        >
          Crecé con claridad →
        </div>
      </div>
    </div>,
    size,
  );
}
