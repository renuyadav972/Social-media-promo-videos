import React from "react";
import { AbsoluteFill } from "remotion";
import { PlivoLogoSvg } from "./PlivoLogoSvg";
import { SORA_FAMILY, INTER_FAMILY } from "./fonts";
import { JBM } from "./glFonts";

// YouTube thumbnail for the OpenAI GPT-Live film, second idea: the film's own hook. A phone card shows GPT-Live
// being interrupted mid-sentence by the caller; the headline sits left with the OpenAI | Plivo lockup above it.
// Different from the connection layout already used on the channel (xAI, LiveKit).
const INK = "#0f1117"; const BLUE = "#323dfe"; const BORDER = "#c4c7cf"; const BORDER2 = "#9ea2ad"; const MUTED = "#666a75";
const SORA = `${SORA_FAMILY}, sans-serif`; const INTER = `${INTER_FAMILY}, sans-serif`; const MONO = `"${JBM}", ui-monospace, Menlo, monospace`;
export const GL_THUMB2 = { lockTop: 134, headTop: 322, cardLeft: 1235, cardTop: 110, cardW: 520, cardH: 860 };
const Bars: React.FC<{ n: number; h: number; from: number; to: number }> = ({ n, h, from, to }) => <div style={{ display: "flex", alignItems: "center", gap: 5, height: h }}>{Array.from({ length: n }, (_, i) => { const x = i / n; const v = 0.3 + 0.7 * Math.abs(Math.sin(i * 1.7) * 0.55 + Math.sin(i * 0.41) * 0.45); const hot = x >= from && x <= to; return <span key={i} style={{ width: 5, height: Math.max(4, Math.round(h * (0.15 + 0.85 * (hot ? v : v * 0.45)))), borderRadius: 1, background: hot ? BLUE : BORDER }} />; })}</div>;
export const GlThumb2: React.FC<{ g?: typeof GL_THUMB2 }> = ({ g = GL_THUMB2 }) => (
  <AbsoluteFill style={{ background: "#fbfbfc", fontFamily: SORA, overflow: "hidden" }}>
    <AbsoluteFill style={{ backgroundImage: `radial-gradient(${BORDER} 1.4px, transparent 1.4px)`, backgroundSize: "30px 30px", opacity: 0.5, WebkitMaskImage: "radial-gradient(90% 90% at 60% 50%, #000 30%, transparent 100%)", maskImage: "radial-gradient(90% 90% at 60% 50%, #000 30%, transparent 100%)" }} />
    <AbsoluteFill style={{ background: "radial-gradient(45% 55% at 78% 50%, rgba(50,61,254,0.10) 0%, rgba(251,251,252,0) 70%)" }} />
    {/* lockup */}
    <div style={{ position: "absolute", left: 160, top: g.lockTop, display: "flex", alignItems: "center", gap: 30 }}>
      <span style={{ fontSize: 60, fontWeight: 600, color: INK, letterSpacing: -2.4, lineHeight: 1 }}>OpenAI</span>
      <span style={{ width: 1, height: 54, background: BORDER2 }} />
      <PlivoLogoSvg width={200} color={INK} />
    </div>
    {/* headline */}
    <div style={{ position: "absolute", left: 160, top: g.headTop, width: 1000 }}>
      <div style={{ fontSize: 168, fontWeight: 600, color: INK, letterSpacing: -7, lineHeight: 1 }}>GPT-Live</div>
      <div style={{ marginTop: 24, fontSize: 92, fontWeight: 600, color: BLUE, letterSpacing: -3.4, lineHeight: 1.05 }}>on a real<br />phone line.</div>
    </div>
    <div style={{ position: "absolute", left: 160, top: 922, display: "flex", alignItems: "center", gap: 20 }}><span style={{ width: 44, height: 2, background: BLUE }} /><span style={{ fontFamily: MONO, fontSize: 22, letterSpacing: 4, textTransform: "uppercase", color: MUTED }}>SIP trunk · webhook · accept</span></div>
    {/* the phone card: GPT-Live interrupted mid-sentence */}
    <div style={{ position: "absolute", left: g.cardLeft, top: g.cardTop, width: g.cardW, height: g.cardH, background: "#fff", border: `2px solid ${BORDER}`, boxShadow: `0 2px 0 ${BORDER2}, 0 40px 80px rgba(15,17,23,0.14)`, padding: "44px 40px", display: "flex", flexDirection: "column", fontFamily: INTER }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}><span style={{ width: 12, height: 12, borderRadius: 6, background: BLUE }} /><span style={{ fontFamily: MONO, fontSize: 18, letterSpacing: 3.6, textTransform: "uppercase", color: MUTED }}>live · +1 806 209 0453</span></div>
      <div style={{ marginTop: 70, fontFamily: MONO, fontSize: 16, letterSpacing: 3, textTransform: "uppercase", color: MUTED }}>GPT-Live</div>
      <div style={{ marginTop: 14, fontFamily: SORA, fontSize: 38, fontWeight: 500, letterSpacing: -1.2, lineHeight: 1.22, color: MUTED }}>Thanks for calling. I can help you book, resche<span style={{ color: BORDER2 }}>…</span></div>
      <div style={{ marginTop: 54, display: "flex", flexDirection: "column", alignItems: "flex-end", textAlign: "right" }}>
        <div style={{ fontFamily: MONO, fontSize: 16, letterSpacing: 3, textTransform: "uppercase", color: BLUE }}>Caller</div>
        <div style={{ marginTop: 14, fontFamily: SORA, fontSize: 40, fontWeight: 500, letterSpacing: -1.4, lineHeight: 1.18, color: BLUE }}>Reschedule.<br />Tomorrow, same time.</div>
      </div>
      <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 18 }}><Bars n={44} h={64} from={0.6} to={0.92} /><span style={{ fontFamily: MONO, fontSize: 16, letterSpacing: 3, textTransform: "uppercase", color: BLUE }}>listening</span></div>
    </div>
  </AbsoluteFill>
);
