import React from "react";
import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import { PlivoLogoSvg } from "./PlivoLogoSvg";
import { MONO, SORA, INTER } from "./StyleFrames";

// ============================================================================
// STYLE FRAMES for the xAI video — a different language from the LiveKit cut:
// a dark BOARD with the architecture as nodes; the camera flies into a node and
// the recording plays there at real speed with a click ring; the call is a
// growing transcript thread. Big numerals, mono kickers, one accent.
// ============================================================================
const BG = "#0a0c12"; const INK = "#f2f3f7"; const DIM = "rgba(242,243,247,0.45)"; const BLUE = "#cd3ef9"; /* Plivo purple (accent for this video) */ const GREEN = "#3ddc84";
const Board: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: `radial-gradient(90% 70% at 50% 40%, #131728 0%, ${BG} 70%)`, fontFamily: SORA, color: INK }}>
    <AbsoluteFill style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
    <div style={{ position: "absolute", top: 48, left: 72, display: "flex", alignItems: "center", gap: 16 }}><PlivoLogoSvg width={100} color={INK} /><span style={{ fontFamily: MONO, fontSize: 14, letterSpacing: 3, color: DIM }}>× XAI VOICE AGENTS</span></div>
    {children}
  </AbsoluteFill>
);
const Node: React.FC<{ x: number; y: number; n: string; title: string; sub: string; state?: "off" | "on" | "active"; w?: number }> = ({ x, y, n, title, sub, state = "off", w = 360 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, borderRadius: 22, padding: "22px 26px", background: state === "active" ? BLUE : "rgba(255,255,255,0.04)", border: `1px solid ${state === "off" ? "rgba(255,255,255,0.12)" : state === "on" ? GREEN : BLUE}`, boxShadow: state === "active" ? `0 30px 80px rgba(205,62,249,0.45)` : "none" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}><span style={{ fontFamily: MONO, fontSize: 13, letterSpacing: 2, color: state === "active" ? "#fff" : DIM }}>{n}</span>{state === "on" ? <span style={{ marginLeft: "auto", fontFamily: MONO, fontSize: 12, color: GREEN }}>● DONE</span> : null}</div>
    <div style={{ marginTop: 10, fontSize: 30, fontWeight: 600, color: "#fff" }}>{title}</div>
    <div style={{ marginTop: 6, fontFamily: MONO, fontSize: 14, color: state === "active" ? "rgba(255,255,255,0.8)" : DIM }}>{sub}</div>
  </div>
);
const Edge: React.FC<{ x1: number; y1: number; x2: number; y2: number; on?: boolean }> = ({ x1, y1, x2, y2, on }) => (
  <svg style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }} width={1920} height={1080}><path d={`M ${x1} ${y1} C ${(x1 + x2) / 2} ${y1}, ${(x1 + x2) / 2} ${y2}, ${x2} ${y2}`} fill="none" stroke={on ? BLUE : "rgba(255,255,255,0.18)"} strokeWidth={on ? 4 : 2} strokeDasharray={on ? undefined : "8 10"} /></svg>
);

// 1 — the board: the whole story on one screen, progress lights up as we go
export const StyleX1: React.FC = () => (
  <Board>
    <div style={{ position: "absolute", left: 72, top: 150, width: 760 }}>
      <div style={{ fontFamily: MONO, fontSize: 16, letterSpacing: 4, color: BLUE }}>THE MAP</div>
      <div style={{ marginTop: 14, fontSize: 76, fontWeight: 600, letterSpacing: -2.6, lineHeight: 1.02 }}>Four boxes.<br />Two consoles.<br /><span style={{ color: BLUE }}>One phone number.</span></div>
      <div style={{ marginTop: 26, fontSize: 24, color: DIM, fontFamily: INTER, lineHeight: 1.5 }}>We'll fly into each box, do the real clicks at real speed, and come back out when it lights up green.</div>
    </div>
    <Edge x1={1000} y1={330} x2={1240} y2={330} on /><Edge x1={1600} y1={330} x2={1240} y2={620} /><Edge x1={1240} y1={700} x2={1240} y2={640} />
    <Node x={880} y={250} n="01" title="Caller" sub="any phone, anywhere" state="on" w={300} />
    <Node x={1240} y={250} n="02" title="Plivo" sub="number + inbound trunk · xAI preset" state="active" />
    <Node x={1600} y={250} n="03" title="xAI" sub="sip.voice.x.ai · TLS" w={280} />
    <Node x={1060} y={620} n="04" title="Athena Pottery Support" sub="built by describing it" w={520} />
    <div style={{ position: "absolute", right: 72, bottom: 60, fontFamily: MONO, fontSize: 14, color: DIM, letterSpacing: 2 }}>STEP 2 OF 4</div>
  </Board>
);

// 2 — inside a node: the real recording, full frame, real speed, click ring + caption strip
export const StyleX2: React.FC = () => {
  const f = useCurrentFrame(); const r = 30 + (f % 30) * 3;
  return (
    <AbsoluteFill style={{ background: BG, fontFamily: SORA }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, overflow: "hidden" }}>
        <OffthreadVideo src={staticFile("xai-demo.mp4")} trimBefore={Math.round(265 * 30)} muted style={{ width: 1920, height: 1200, marginTop: -155, display: "block", filter: "brightness(0.92)" }} />
      </div>
      {/* click ring on the real click */}
      <div style={{ position: "absolute", left: 1466 - r, top: 428 - r, width: r * 2, height: r * 2, borderRadius: "50%", border: `3px solid ${BLUE}`, opacity: 1 - (f % 30) / 30 }} />
      <div style={{ position: "absolute", left: 1466 - 8, top: 428 - 8, width: 16, height: 16, borderRadius: 8, background: BLUE, boxShadow: `0 0 0 6px rgba(205,62,249,0.35)` }} />
      {/* node badge + caption strip */}
      <div style={{ position: "absolute", top: 40, left: 60, display: "flex", alignItems: "center", gap: 14, background: "rgba(10,12,18,0.85)", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 999, padding: "10px 18px 10px 12px" }}><span style={{ fontFamily: MONO, fontSize: 13, background: BLUE, color: "#fff", padding: "6px 10px", borderRadius: 999 }}>02</span><span style={{ fontSize: 20, fontWeight: 600, color: "#fff" }}>Plivo · inbound trunk</span><span style={{ fontFamily: MONO, fontSize: 13, color: DIM }}>· real time</span></div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "60px 72px 44px", background: "linear-gradient(180deg, rgba(10,12,18,0) 0%, rgba(10,12,18,0.92) 55%)" }}>
        <div style={{ fontFamily: MONO, fontSize: 14, letterSpacing: 3, color: BLUE }}>SIP PLATFORM</div>
        <div style={{ marginTop: 8, fontSize: 44, fontWeight: 600, color: "#fff", letterSpacing: -1.2 }}>Pick <span style={{ color: BLUE }}>xAI</span>. The URI, TLS and secure trunking are set for you.</div>
      </div>
    </AbsoluteFill>
  );
};

// 3 — building the agent: the console chat on the left, what it's becoming on the right
export const StyleX3: React.FC = () => (
  <AbsoluteFill style={{ background: BG, fontFamily: SORA }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: 1100, height: 1080, overflow: "hidden" }}>
      <OffthreadVideo src={staticFile("xai-demo.mp4")} trimBefore={Math.round(120 * 30)} muted style={{ width: 1920, height: 1200, marginLeft: -350, marginTop: -155, display: "block" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(10,12,18,0) 75%, rgba(10,12,18,1) 100%)" }} />
    </div>
    <div style={{ position: "absolute", left: 1140, top: 0, width: 720, height: 1080, display: "flex", flexDirection: "column", justifyContent: "center", gap: 18 }}>
      <div style={{ fontFamily: MONO, fontSize: 14, letterSpacing: 3, color: BLUE }}>03 · THE AGENT, AS IT TAKES SHAPE</div>
      <div style={{ fontSize: 56, fontWeight: 600, color: "#fff", letterSpacing: -1.8, lineHeight: 1.05 }}>You describe it.<br />It asks. It writes.</div>
      {[["Business", "Athena Pottery, custom orders", true], ["Hours", "Mon–Fri · 8 AM–5 PM CST", true], ["If it can't help", "take a message + callback number", true], ["Transfer to a human", "no", false], ["Name", "Athena Pottery Support", false]].map(([k, v, on], i) => (
        <div key={String(k)} style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 18px", borderRadius: 14, background: "rgba(255,255,255,0.04)", border: `1px solid ${on ? "rgba(61,220,132,0.5)" : "rgba(255,255,255,0.1)"}`, opacity: on ? 1 : 0.45 }}>
          <span style={{ fontFamily: MONO, fontSize: 13, color: on ? GREEN : DIM, width: 22 }}>{on ? "✓" : String(i + 1)}</span><span style={{ fontFamily: INTER, fontSize: 18, color: DIM, width: 200 }}>{k as string}</span><span style={{ fontFamily: INTER, fontSize: 20, color: "#fff" }}>{v as string}</span>
        </div>))}
    </div>
  </AbsoluteFill>
);

// 4 — the call: a live transcript thread with the real audio, no dashboards
export const StyleX4: React.FC = () => {
  const f = useCurrentFrame();
  const rows = [["AGENT", "Hi, thanks for calling Athena Pottery! How can I help you today?"], ["YOU", "Hi, I'd like to book an appointment for a custom order."], ["AGENT", "Happy to help with that. We take custom order appointments Monday to Friday, eight to five Central. What day works for you?"], ["YOU", "Thursday afternoon, if you have it."]];
  return (
    <Board>
      <div style={{ position: "absolute", left: 72, top: 150, display: "flex", alignItems: "center", gap: 18 }}><span style={{ width: 14, height: 14, borderRadius: 7, background: GREEN, boxShadow: `0 0 0 8px rgba(61,220,132,0.2)` }} /><span style={{ fontFamily: MONO, fontSize: 16, letterSpacing: 3, color: INK }}>LIVE · +1 701 719 8695 → ATHENA POTTERY SUPPORT · 00:{String(12 + Math.floor(f / 30)).padStart(2, "0")}</span></div>
      <div style={{ position: "absolute", left: 72, top: 230, width: 1100, display: "flex", flexDirection: "column", gap: 22 }}>
        {rows.map(([w, t], i) => (
          <div key={i} style={{ display: "flex", gap: 22, alignItems: "flex-start", opacity: i === 3 ? 0.6 : 1 }}>
            <span style={{ fontFamily: MONO, fontSize: 13, letterSpacing: 2, color: w === "YOU" ? GREEN : BLUE, width: 70, paddingTop: 12 }}>{w}</span>
            <div style={{ fontSize: w === "YOU" ? 30 : 34, fontWeight: w === "YOU" ? 500 : 600, color: w === "YOU" ? DIM : "#fff", lineHeight: 1.3, maxWidth: 980 }}>{t}</div>
          </div>))}
        <div style={{ display: "flex", gap: 22, alignItems: "center" }}><span style={{ fontFamily: MONO, fontSize: 13, letterSpacing: 2, color: BLUE, width: 70 }}>AGENT</span><div style={{ display: "flex", gap: 5, alignItems: "center", height: 40 }}>{Array.from({ length: 28 }, (_, i) => <span key={i} style={{ width: 6, height: 6 + 30 * Math.abs(Math.sin(i * 0.8 + f * 0.3)), borderRadius: 3, background: BLUE }} />)}</div></div>
      </div>
      <div style={{ position: "absolute", right: 72, top: 230, width: 560, borderRadius: 24, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)", padding: "26px 28px" }}>
        <div style={{ fontFamily: MONO, fontSize: 13, letterSpacing: 3, color: DIM }}>WHAT'S HAPPENING</div>
        {[["Caller", "dials the Plivo number"], ["Plivo", "inbound trunk → sip.voice.x.ai over TLS"], ["xAI", "answers with Athena Pottery Support"], ["Agent", "greets, books, takes a message"]].map(([a, b], i) => <div key={a} style={{ marginTop: 16, display: "flex", gap: 14, alignItems: "baseline" }}><span style={{ fontFamily: MONO, fontSize: 13, color: i <= 2 ? GREEN : BLUE, width: 64 }}>{a}</span><span style={{ fontFamily: INTER, fontSize: 20, color: "#fff" }}>{b}</span></div>)}
      </div>
    </Board>
  );
};
