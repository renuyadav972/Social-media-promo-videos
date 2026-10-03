import React from "react";
import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame, interpolate, Easing } from "remotion";
import { SORA_FAMILY, INTER_FAMILY } from "./fonts";
import { PlivoLogoSvg } from "./PlivoLogoSvg";

// ============================================================================
// STYLE FRAMES — candidate "beat kinds" for a brand-forward re-cut of the Call
// Scheduling Agent video (per user feedback: more personality, brand colour,
// a different kind of visual per beat, Bolna-style). Rendered as stills.
// ============================================================================
export const BLUE = "#323dfe";
export const INK = "#0f1117";
export const CREAM = "radial-gradient(120% 95% at 50% 0%, #fbfaf8 0%, #f6f5f3 55%, #efeeea 100%)";
export const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";
export const SORA = `${SORA_FAMILY}, ${INTER_FAMILY}, sans-serif`;
export const INTER = `${INTER_FAMILY}, sans-serif`;

export const Grid: React.FC<{ dark?: boolean }> = ({ dark }) => (
  <AbsoluteFill style={{ backgroundImage: `radial-gradient(circle, ${dark ? "rgba(255,255,255,0.10)" : "rgba(15,17,23,0.06)"} 1.2px, transparent 1.6px)`, backgroundSize: "30px 30px", WebkitMaskImage: "radial-gradient(120% 120% at 50% 30%, #000 55%, transparent 100%)", maskImage: "radial-gradient(120% 120% at 50% 30%, #000 55%, transparent 100%)" }} />
);
export const Chip: React.FC<{ n: string; label: string; dark?: boolean }> = ({ n, label, dark }) => (
  <div style={{ position: "absolute", top: 56, left: 72, display: "inline-flex", alignItems: "center", gap: 12, fontFamily: INTER, fontSize: 20, fontWeight: 600, color: dark ? "#fff" : INK }}>
    <span style={{ background: dark ? "#fff" : BLUE, color: dark ? BLUE : "#fff", borderRadius: 999, padding: "6px 14px", fontFamily: MONO, fontSize: 17, letterSpacing: 1 }}>{n}</span>
    <span style={{ opacity: 0.85 }}>{label}</span>
  </div>
);
export const Logo: React.FC<{ white?: boolean }> = ({ white }) => (
  <div style={{ position: "absolute", top: 52, right: 72 }}><PlivoLogoSvg width={110} color={white ? "#ffffff" : INK} /></div>
);

// A — Typographic interstitial on brand blue (section opener)
export const StyleA: React.FC = () => {
  const f = useCurrentFrame(); const e = interpolate(f, [0, 28], [0, 1], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: BLUE, fontFamily: SORA }}>
      <Grid dark /><Chip n="02" label="Plan" dark /><Logo white />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 1440, textAlign: "center", opacity: e, transform: `translateY(${(1 - e) * 24}px)` }}>
          <div style={{ fontSize: 108, fontWeight: 600, color: "#fff", letterSpacing: -3, lineHeight: 1.02 }}>Vibe Agent designs<br />the <span style={{ background: "#fff", color: BLUE, padding: "0 22px", borderRadius: 20 }}>call flow.</span></div>
          <div style={{ marginTop: 34, fontSize: 30, color: "rgba(255,255,255,0.8)", fontFamily: INTER, fontWeight: 500 }}>It reads your request, asks what it needs, and builds the whole thing.</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// B — Console in a floating frame on the brand canvas, with a headline + step chip
export const StyleB: React.FC = () => (
  <AbsoluteFill style={{ background: CREAM, fontFamily: SORA }}>
    <Grid /><Chip n="03" label="Refine & approve" /><Logo />
    <div style={{ position: "absolute", top: 138, left: 0, right: 0, textAlign: "center", fontSize: 54, fontWeight: 600, color: INK, letterSpacing: -1.5 }}>Want to change something? <span style={{ color: BLUE }}>Just say so.</span></div>
    <div style={{ position: "absolute", top: 232, left: 160, width: 1600, height: 812, borderRadius: 22, overflow: "hidden", boxShadow: "0 40px 90px rgba(15,17,23,0.22), 0 0 0 1px rgba(15,17,23,0.06)", background: "#fff" }}>
      <div style={{ height: 40, background: "#fafafa", borderBottom: "1px solid #ececef", display: "flex", alignItems: "center", gap: 8, padding: "0 16px" }}>
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => <span key={c} style={{ width: 12, height: 12, borderRadius: 6, background: c }} />)}
        <span style={{ marginLeft: 16, fontFamily: INTER, fontSize: 13, color: "#8a8f9c" }}>cx.plivo.com</span>
      </div>
      <div style={{ position: "relative", width: 1600, height: 772, overflow: "hidden" }}>
        <OffthreadVideo src={staticFile("call-scheduling.mp4")} trimBefore={Math.round(140 * 30)} muted style={{ width: 1600, height: 1000, marginTop: -Math.round(150 * (1600 / 1728)), display: "block" }} />
      </div>
    </div>
  </AbsoluteFill>
);

// C — Extract-and-float: the real UI fragment cut out of the footage, enlarged on the canvas
export const StyleC: React.FC = () => {
  // Configure Number modal in final-frame coords ≈ (1170,40)-(1905,1050) at fit-to-width scale → source rect
  const sx = 1728 / 1920; const rx = 1170 * sx, ry = 150 + (40 - 24) * sx, rw = 735 * sx, rh = 1010 * sx; const Z = 0.95;
  return (
    <AbsoluteFill style={{ background: CREAM, fontFamily: SORA }}>
      <Grid /><Chip n="07" label="Connect a number" /><Logo />
      <div style={{ position: "absolute", left: 120, top: 330, width: 760 }}>
        <div style={{ fontSize: 72, fontWeight: 600, color: INK, letterSpacing: -2.2, lineHeight: 1.04 }}>Attach your agent<br />to a <span style={{ color: BLUE }}>phone number.</span></div>
        <div style={{ marginTop: 26, fontSize: 27, color: "#55586a", fontFamily: INTER, lineHeight: 1.45 }}>Pick the number, choose the agent, save. Real calls start ringing through.</div>
        <div style={{ marginTop: 34, display: "inline-flex", alignItems: "center", gap: 10, background: "#e7f8ee", color: "#15a34a", fontFamily: MONO, fontSize: 18, padding: "10px 16px", borderRadius: 10 }}>● +1 806 209 0453 → Call Scheduling Agent</div>
      </div>
      <div style={{ position: "absolute", left: 1010, top: 60, width: rw * Z * (1920 / 1728), height: rh * Z * (1920 / 1728), borderRadius: 18, overflow: "hidden", boxShadow: "0 40px 90px rgba(15,17,23,0.24), 0 0 0 1px rgba(15,17,23,0.06)", background: "#fff" }}>
        <OffthreadVideo src={staticFile("call-scheduling.mp4")} trimBefore={Math.round(915.5 * 30)} muted style={{ position: "absolute", width: 1920 * Z, height: 1200 * Z, left: -rx * Z * (1920 / 1728), top: -ry * Z * (1920 / 1728), display: "block" }} />
      </div>
    </AbsoluteFill>
  );
};

// D — Kinetic word list (scenario roll) with a status tag
export const StyleD: React.FC = () => {
  const items = ["Do-not-contact request", "Cold sales pitch", "Pricing question", "Angry caller", "Vague inquiry"]; const active = 2;
  return (
    <AbsoluteFill style={{ background: CREAM, fontFamily: SORA }}>
      <Grid /><Chip n="05" label="Simulations" /><Logo />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", perspective: 1400 }}>
        <div style={{ transform: "rotateX(14deg)", transformStyle: "preserve-3d", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 6, marginLeft: -120 }}>
          {items.map((t, i) => { const d = Math.abs(i - active); return (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: 26, fontSize: d === 0 ? 96 : 76, fontWeight: 600, color: INK, opacity: d === 0 ? 1 : 0.28 - d * 0.06, filter: d === 0 ? "none" : `blur(${d * 1.6}px)`, letterSpacing: -2.5, lineHeight: 1.05 }}>
              <span style={{ width: 70, color: BLUE, opacity: d === 0 ? 1 : 0 }}>→</span>{t}
              {d === 0 ? <span style={{ marginLeft: 26, fontFamily: MONO, fontSize: 24, background: "#e7f8ee", color: "#15a34a", padding: "10px 18px", borderRadius: 12, letterSpacing: 0.5 }}>✓ Achieved</span> : null}
            </div>); })}
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", bottom: 90, left: 0, right: 0, textAlign: "center", fontSize: 30, fontFamily: INTER, fontWeight: 500, color: "#55586a" }}>Vibe Agent runs a whole set of simulations against your goals.</div>
    </AbsoluteFill>
  );
};

// E — Stat / recap cards
export const StyleE: React.FC = () => {
  const cards = [
    { icon: "☎", title: "Answers every call", rows: [["Greeting", "Custom"], ["Missed calls", "0"], ["Hours", "24 / 7"]] },
    { icon: "✎", title: "Takes a message", rows: [["Name + number", "Captured"], ["Urgent flag", "Active"], ["Callback", "Promised"]] },
    { icon: "▲", title: "Built in minutes", rows: [["Design", "Vibe Agent"], ["Simulations", "8 passed"], ["Code written", "None"]] },
  ];
  return (
    <AbsoluteFill style={{ background: CREAM, fontFamily: SORA }}>
      <Grid /><Chip n="09" label="What you built" /><Logo />
      <div style={{ position: "absolute", top: 150, left: 0, right: 0, textAlign: "center", fontSize: 64, fontWeight: 600, color: INK, letterSpacing: -2 }}>Your AI receptionist, <span style={{ color: BLUE }}>live.</span></div>
      <div style={{ position: "absolute", top: 330, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 34 }}>
        {cards.map((c) => (
          <div key={c.title} style={{ width: 480, background: "#fff", borderRadius: 24, padding: "34px 34px 26px", boxShadow: "0 30px 70px rgba(15,17,23,0.14), 0 0 0 1px rgba(15,17,23,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}><span style={{ width: 54, height: 54, borderRadius: 16, background: "#eef0ff", color: BLUE, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>{c.icon}</span><span style={{ fontSize: 30, fontWeight: 600, color: INK }}>{c.title}</span></div>
            <div style={{ marginTop: 26, background: "#f7f8fa", borderRadius: 14, padding: "6px 18px" }}>
              {c.rows.map(([k, v]) => <div key={k} style={{ display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 19, padding: "12px 0", borderBottom: "1px solid #ebedf1", color: "#7a7f8c" }}><span>{k}</span><span style={{ color: "#15a34a", fontWeight: 600 }}>{v}</span></div>)}
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// F — Phone: incoming call from the receptionist (3D tilt)
export const StyleF: React.FC = () => (
  <AbsoluteFill style={{ background: CREAM, fontFamily: SORA }}>
    <Grid /><Chip n="10" label="Live" /><Logo />
    <div style={{ position: "absolute", left: 150, top: 340, width: 760 }}>
      <div style={{ fontSize: 84, fontWeight: 600, color: INK, letterSpacing: -2.6, lineHeight: 1.02 }}>One that <span style={{ color: BLUE }}>never</span><br />misses a call.</div>
      <div style={{ marginTop: 26, fontSize: 28, color: "#55586a", fontFamily: INTER }}>Every caller gets Jerry. Every message reaches Sarah.</div>
    </div>
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", perspective: 1600 }}>
      <div style={{ marginLeft: 700, width: 400, height: 820, borderRadius: 56, background: "linear-gradient(180deg,#141a33,#0b0f24)", boxShadow: "0 60px 120px rgba(15,17,23,0.35), inset 0 0 0 10px #05070f", transform: "rotateY(-18deg) rotateX(8deg) rotateZ(6deg)", color: "#fff", fontFamily: INTER, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 120 }}>
        <div style={{ width: 120, height: 120, borderRadius: 60, background: BLUE, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 54, fontWeight: 700, fontFamily: SORA }}>J</div>
        <div style={{ marginTop: 30, fontSize: 32, fontWeight: 600 }}>Jerry · Redbud Studio</div>
        <div style={{ marginTop: 10, fontFamily: MONO, fontSize: 16, letterSpacing: 2, color: "#8ea2ff" }}>INCOMING VOICE CALL</div>
        <div style={{ marginTop: "auto", marginBottom: 90, display: "flex", gap: 90 }}>
          <span style={{ width: 84, height: 84, borderRadius: 42, background: "#e5484d", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 34 }}>✕</span>
          <span style={{ width: 84, height: 84, borderRadius: 42, background: "#30a46c", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 34 }}>☎</span>
        </div>
      </div>
    </AbsoluteFill>
  </AbsoluteFill>
);

// G — Logo + waveform outro with a CTA pill
export const StyleG: React.FC = () => {
  const f = useCurrentFrame();
  const bars = Array.from({ length: 64 }, (_, i) => 18 + 70 * Math.abs(Math.sin(i * 0.55 + f * 0.09)) * (0.35 + 0.65 * Math.abs(Math.sin(i * 0.21 + 1.3))));
  return (
    <AbsoluteFill style={{ background: CREAM, fontFamily: SORA, alignItems: "center", justifyContent: "center" }}>
      <Grid />
      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 4, height: 160 }}>
        {bars.map((h, i) => <span key={i} style={{ width: 8, height: h, borderRadius: 4, background: BLUE, opacity: 0.35 + 0.65 * Math.abs(Math.sin(i * 0.3)) }} />)}
        <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", background: "#f6f5f3", padding: "0 34px" }}><PlivoLogoSvg width={330} color={INK} /></div>
      </div>
      <div style={{ marginTop: 44, fontSize: 40, fontWeight: 600, color: INK, letterSpacing: -1 }}>Build <span style={{ color: BLUE }}>yours</span> today</div>
      <div style={{ marginTop: 22, background: BLUE, color: "#fff", fontFamily: INTER, fontWeight: 600, fontSize: 24, padding: "14px 30px", borderRadius: 999 }}>● cx.plivo.com</div>
    </AbsoluteFill>
  );
};
