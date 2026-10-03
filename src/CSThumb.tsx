import React from "react";
import { AbsoluteFill } from "remotion";
import { PlivoLogoSvg } from "./PlivoLogoSvg";
import { SORA_FAMILY, INTER_FAMILY } from "./fonts";

// YouTube thumbnail for the Call Scheduling Agent video (render one frame, then scale to 1280x720).
const BLUE = "#323dfe"; const INK = "#0f1117";
export const CSThumb: React.FC = () => (
  <AbsoluteFill style={{ background: BLUE, fontFamily: `${SORA_FAMILY}, sans-serif`, overflow: "hidden" }}>
    <AbsoluteFill style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.18) 1.5px, transparent 2px)", backgroundSize: "34px 34px", opacity: 0.6 }} />
    <div style={{ position: "absolute", left: 90, top: 70 }}><PlivoLogoSvg width={190} color="#fff" /></div>
    <div style={{ position: "absolute", left: 90, top: 300, width: 1150 }}>
      <div style={{ fontSize: 150, fontWeight: 700, color: "#fff", letterSpacing: -6, lineHeight: 0.98 }}><span style={{ background: "#fff", color: BLUE, borderRadius: 26, padding: "0 28px", display: "inline-block" }}>AI Receptionist</span><br /><span style={{ display: "inline-block", marginTop: 18, fontSize: 118, letterSpacing: -4 }}>Never misses a call.</span></div>
      <div style={{ marginTop: 44, display: "flex", gap: 18 }}>
        {["No code", "About 10 minutes", "Takes a message"].map((t) => <span key={t} style={{ border: "3px solid rgba(255,255,255,0.7)", color: "#fff", borderRadius: 999, padding: "14px 30px", fontSize: 36, fontWeight: 600 }}>{t}</span>)}
      </div>
    </div>
    <div style={{ position: "absolute", left: 90, bottom: 70, fontFamily: `${INTER_FAMILY}, sans-serif`, fontSize: 34, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>with Vibe Agent</div>
    {/* phone: the receptionist's call coming in */}
    <div style={{ position: "absolute", right: 150, top: 120, width: 440, height: 900, borderRadius: 64, background: "linear-gradient(180deg,#141a33,#0b0f24)", boxShadow: "0 70px 140px rgba(0,0,0,0.45), inset 0 0 0 12px #05070f", transform: "rotate(-8deg)", color: "#fff", display: "flex", flexDirection: "column", alignItems: "center", padding: "150px 30px 0" }}>
      <div style={{ width: 150, height: 150, borderRadius: 75, background: BLUE, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 70, fontWeight: 700, boxShadow: "0 0 0 22px rgba(50,61,254,0.28)" }}>R</div>
      <div style={{ marginTop: 40, fontSize: 40, fontWeight: 600 }}>Redbud Studio</div>
      <div style={{ marginTop: 14, fontFamily: "ui-monospace, Menlo, monospace", fontSize: 19, letterSpacing: 3, color: "#8ea2ff" }}>AI RECEPTIONIST</div>
      <div style={{ marginTop: 26, fontSize: 26, color: "rgba(255,255,255,0.7)", textAlign: "center", lineHeight: 1.3 }}>"Hi, thanks for calling<br />Redbud Studio…"</div>
      <div style={{ marginTop: "auto", marginBottom: 100, display: "flex", gap: 110 }}>
        <span style={{ width: 100, height: 100, borderRadius: 50, background: "#e5484d", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>✕</span>
        <span style={{ width: 100, height: 100, borderRadius: 50, background: "#30a46c", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>☎</span>
      </div>
    </div>
  </AbsoluteFill>
);
