import React from "react";
import { AbsoluteFill } from "remotion";
import { PlivoLogoSvg } from "./PlivoLogoSvg";
import { SORA_FAMILY, INTER_FAMILY } from "./fonts";

// YouTube thumbnail for the Plivo CLI launch video, in the video's own language: off-white, dot grid,
// "Plivo | CLI", one line, a terminal window with the install command.
const INK = "#0f1117"; const BLUE = "#323dfe"; const HAIR = "rgba(15,17,23,0.12)"; const MONO = "ui-monospace, Menlo, monospace";
export const CliThumb: React.FC = () => (
  <AbsoluteFill style={{ background: "#f9fafb", fontFamily: `${SORA_FAMILY}, sans-serif`, color: INK, overflow: "hidden" }}>
    <AbsoluteFill style={{ backgroundImage: "radial-gradient(rgba(15,17,23,0.10) 1.5px, transparent 1.5px)", backgroundSize: "30px 30px", opacity: 0.6 }} />
    <div style={{ position: "absolute", left: 120, top: 0, bottom: 0, width: 900, display: "flex", flexDirection: "column", justifyContent: "center", gap: 34, paddingBottom: 90 }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 30 }}><PlivoLogoSvg width={360} color={INK} /><span style={{ width: 3, height: 100, background: HAIR, marginBottom: 6 }} /><span style={{ fontSize: 118, fontWeight: 500, letterSpacing: -3, color: BLUE, lineHeight: 0.8, paddingBottom: 6 }}>CLI</span></div>
      <div style={{ fontSize: 66, fontWeight: 600, letterSpacing: -2.4, lineHeight: 1.05, whiteSpace: "nowrap" }}>Build. Inspect. Debug.</div>
    </div>
    <div style={{ position: "absolute", left: 120, right: 120, bottom: 96, textAlign: "center", fontSize: 48, fontFamily: INTER_FAMILY, color: "#4b5563", whiteSpace: "nowrap" }}>Plivo in your terminal, with skills for your coding agent.</div>
    <div style={{ position: "absolute", left: 1090, top: 296, width: 720, borderRadius: 16, overflow: "hidden", background: "#0b0f14", boxShadow: "0 40px 90px rgba(15,17,23,0.30)", border: "1px solid rgba(255,255,255,0.10)" }}>
      <div style={{ height: 52, background: "#161b22", display: "flex", alignItems: "center", padding: "0 20px", gap: 8 }}>{[0, 1, 2].map((i) => <span key={i} style={{ width: 12, height: 12, borderRadius: 6, background: "rgba(255,255,255,0.18)" }} />)}<span style={{ marginLeft: 12, fontFamily: MONO, fontSize: 18, color: "#8b949e" }}>plivo</span><span style={{ marginLeft: "auto", fontFamily: MONO, fontSize: 16, color: "#8b949e" }}>~/voice-agent</span></div>
      <div style={{ padding: "34px 30px 38px", fontFamily: MONO, fontSize: 30, color: "#e6edf3", lineHeight: 1.7 }}>
        <div><span style={{ color: BLUE }}>$</span> brew install plivo/tap/plivo</div>
        <div style={{ color: "#8b949e" }}>  ✓ Plivo CLI installed.</div>
        <div><span style={{ color: BLUE }}>$</span> plivo skill install sip-trunking</div>
        <div><span style={{ color: BLUE }}>$</span> plivo ask "why did my call fail?"<span style={{ display: "inline-block", width: 14, height: 34, background: "#e6edf3", marginLeft: 6, verticalAlign: "-6px" }} /></div>
      </div>
    </div>
  </AbsoluteFill>
);
