import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { SipTrunkingPage, CreateTrunkDrawer, LiveKitOverview, LiveKitAgents } from "./TrunkKit";
import { INTER_FAMILY } from "../fonts";
import { LK_CALL_ENV } from "../lkCallEnv";

// Beats of the LiveKit video on the recreated kit. Frames are relative to each beat's Sequence.
const ease = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { easing: Easing.inOut(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const F = `${INTER_FAMILY}, sans-serif`;
export const NUMBER = "+1 775 239 8525";

// 01 — LiveKit Cloud: overview → agents list, the agent card highlighted on "Note the name"
export const LkAgentBeat: React.FC<{ switchAt: number; noteAt: number }> = ({ switchAt, noteAt }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill>{f < switchAt ? <LiveKitOverview /> : <LiveKitAgents highlightAt={noteAt} />}</AbsoluteFill>;
};
// 02 — Plivo SIP Trunking: empty list, click Create Trunk, the drawer slides in
export const LkTrunkBeat: React.FC<{ clickAt: number }> = ({ clickAt }) => {
  const f = useCurrentFrame(); const slide = ease(f, clickAt + 6, clickAt + 26);
  return <AbsoluteFill><SipTrunkingPage pulseAt={clickAt} dim={slide > 0.05} drawer={slide > 0 ? <CreateTrunkDrawer showPlatform right={-760 * (1 - slide)} /> : null} /></AbsoluteFill>;
};
// 02b — name it, pick the LiveKit platform preset; the SIP details are filled in for you
export const LkTrunkFormBeat: React.FC<{ typeFrom: number; typeUntil: number; platformOpenAt: number; platformPickAt: number }> = ({ typeFrom, typeUntil, platformOpenAt, platformPickAt }) => {
  const f = useCurrentFrame(); const name = "LiveKit Demo"; const n = Math.floor(ease(f, typeFrom, typeUntil) * name.length); const picked = f >= platformPickAt;
  return <AbsoluteFill><SipTrunkingPage dim drawer={<CreateTrunkDrawer showPlatform name={name.slice(0, n)} typing={f < typeUntil + 8} nameFocus={f < platformOpenAt} platformOpen={f >= platformOpenAt && !picked} platform={picked ? "LiveKit Cloud" : f >= platformOpenAt + 14 ? "LiveKit Cloud" : ""} uri={picked ? "LiveKit" : ""} />} /></AbsoluteFill>;
};
// 02c — link the number, create the trunk
export const LkTrunkLinkBeat: React.FC<{ openAt: number; pickAt: number; createAt: number }> = ({ openAt, pickAt, createAt }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill><SipTrunkingPage dim drawer={<CreateTrunkDrawer showPlatform name="LiveKit Demo" platform="LiveKit Cloud" uri="LiveKit" numbersOpen={f >= openAt && f < pickAt + 18} numbersHover={f >= openAt + 12 ? NUMBER : ""} linked={f >= pickAt ? [NUMBER] : []} />} /></AbsoluteFill>;
};

// 04 — the real call, on a clean version of the test page (real audio plays underneath)
export const CALL_LINES: [number, number, "AGENT" | "YOU", string][] = [
  [0.0, 4.46, "AGENT", "Hello, I am the Plivo voice assistant. How can I help you with Plivo today?"],
  [5.22, 9.0, "YOU", "Hi, I wanted to know how I can send messages to the US?"],
  [9.72, 14.9, "AGENT", "You can send messages to the United States using our messaging API, to send SMS or WhatsApp messages."],
];
export const LkCallBeat: React.FC = () => {
  const f = useCurrentFrame(); const t = f / 30; const lvl = LK_CALL_ENV[f] ?? 0; const cur = CALL_LINES.findIndex(([a, b]) => t >= a && t < b + 0.4); const who = cur >= 0 ? CALL_LINES[cur][2] : null;
  const Wave: React.FC<{ on: boolean; color: string }> = ({ on, color }) => <div style={{ display: "flex", alignItems: "center", gap: 4, height: 44 }}>{Array.from({ length: 34 }, (_, i) => <span key={i} style={{ width: 5, height: on ? 4 + 36 * lvl * (0.35 + 0.65 * Math.abs(Math.sin(i * 0.8 + f * 0.3))) : 4, borderRadius: 3, background: on ? color : "#2a2f3a" }} />)}</div>;
  return (
    <AbsoluteFill style={{ background: "#0f1117", fontFamily: F, color: "#e6e8f0" }}>
      <div style={{ position: "absolute", left: 120, top: 90, right: 120 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: "ui-monospace, Menlo, monospace", fontSize: 14, letterSpacing: 3, color: "#8ea2ff" }}><span style={{ width: 8, height: 8, background: "#8ea2ff" }} />PLIVO VOICE AI<span style={{ flex: 1, borderTop: "1px dashed #2a2f3a" }} /></div>
        <div style={{ marginTop: 26, fontSize: 54, fontWeight: 600, letterSpacing: -1.5 }}>Talk to the Plivo voice assistant</div>
        <div style={{ marginTop: 12, fontSize: 20, color: "#9aa3b8", maxWidth: 900, lineHeight: 1.5 }}>Click call, allow your microphone, and ask it anything about Plivo. You're talking to the same agent that answers on the phone line.</div>
        <div style={{ marginTop: 40, display: "flex", alignItems: "center", gap: 26 }}>
          <div style={{ width: 92, height: 92, borderRadius: 46, background: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34 }}>☎</div>
          <div><div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 20, fontWeight: 600 }}><span style={{ width: 10, height: 10, borderRadius: 5, background: "#22c55e" }} />Live</div><div style={{ fontFamily: "ui-monospace, Menlo, monospace", fontSize: 16, color: "#9aa3b8", marginTop: 4 }}>00:{String(Math.floor(t)).padStart(2, "0")}</div><div style={{ fontSize: 16, color: "#9aa3b8", marginTop: 4 }}>Ask it anything about Plivo. Tap the button to end the call</div></div>
        </div>
        <div style={{ marginTop: 40, display: "flex", gap: 20 }}>
          {[["YOU", "#e6e8f0", who === "YOU"], ["PLIVO AGENT", "#5b6cff", who === "AGENT"]].map(([k, c, on]) => <div key={String(k)} style={{ flex: 1, background: "#151923", border: "1px solid #232837", borderRadius: 14, padding: "20px 24px" }}><div style={{ fontFamily: "ui-monospace, Menlo, monospace", fontSize: 13, letterSpacing: 3, color: "#9aa3b8" }}><span style={{ display: "inline-block", width: 8, height: 8, background: String(c), marginRight: 10 }} />{k}</div><div style={{ marginTop: 16 }}><Wave on={Boolean(on)} color={String(c)} /></div></div>)}
        </div>
        <div style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 14 }}>
          {CALL_LINES.map(([a, b, w, txt], i) => { if (t < a - 0.1) return null; const n = Math.floor(Math.max(0, Math.min(1, (t - a) / (b - a))) * txt.length); return <div key={i} style={{ display: "flex", gap: 20, opacity: i < cur ? 0.6 : 1 }}><span style={{ fontFamily: "ui-monospace, Menlo, monospace", fontSize: 13, letterSpacing: 2, color: w === "YOU" ? "#e6e8f0" : "#8ea2ff", width: 120, paddingTop: 6 }}>{w === "YOU" ? "YOU" : "PLIVO AGENT"}</span><span style={{ fontSize: 24, lineHeight: 1.4, color: w === "YOU" ? "#c9cdd8" : "#fff", maxWidth: 1300 }}>{txt.slice(0, n)}</span></div>; })}
        </div>
      </div>
      <div style={{ position: "absolute", left: 120, bottom: 60, fontFamily: "ui-monospace, Menlo, monospace", fontSize: 14, color: "#9aa3b8" }}>plivo × livekit</div>
    </AbsoluteFill>
  );
};
