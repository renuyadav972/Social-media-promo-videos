import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate, Easing } from "remotion";
import { PlivoLogoSvg } from "./PlivoLogoSvg";
import { CREAM, BLUE, INK, MONO, SORA, INTER, Grid } from "./StyleFrames";
import { MUSIC } from "./promoConfig";
import { BuilderPage, LiveFlow, VibeEmpty, VibePanel, VibeItem, SimulationsPage } from "./cards/AgentBuilder";
import { NAME, PROMPT, SimulateBeat, SimDetailBeat, VoicePickBeat, PublishBeat, ConnectModalBeat } from "./cards/CSBeats";
import { S1_WORDS, S2_WORDS } from "./shortsWords";

// ---- YouTube Shorts about Vibe Agent, v2 --------------------------------------------------------
// Format learned from the Shorts that perform in this space (Synthflow, Retell, Sonny Sangha):
// a hook in the first two seconds, the real screen edge to edge, karaoke captions with the
// spoken word highlighted, one idea per short, and the payoff (a call) at the end.
const S = 30; const W = 1080;
const ease = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const pop = (f: number, at: number): React.CSSProperties => { const p = ease(f, at, at + 10); return { opacity: p, transform: `translateY(${(1 - p) * 26}px)` }; };
const steps = (f: number, from: number, every: number, n: number) => Math.max(0, Math.min(n, Math.floor((f - from) / every) + 1));

/** A 1920x1080 kit screen cropped to (x,y,w,h) and scaled to the full 1080 width, edge to edge. */
const Screen: React.FC<{ node: React.ReactNode; x: number; y: number; w: number; h: number; top: number; at?: number }> = ({ node, x, y, w, h, top, at = 0 }) => {
  const f = useCurrentFrame(); const s = W / w; const H = Math.round(h * s);
  return (
    <div style={{ position: "absolute", left: 0, top, width: W, height: H, overflow: "hidden", borderRadius: 24, boxShadow: "0 24px 60px rgba(15,17,23,0.16)", background: "#fff", ...pop(f, at) }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${s}) translate(${-x}px, ${-y}px)`, transformOrigin: "top left" }}>{node}</div>
    </div>
  );
};
const Frame: React.FC<{ children: React.ReactNode; blue?: boolean }> = ({ children, blue }) => (
  <AbsoluteFill style={{ background: blue ? BLUE : CREAM, fontFamily: SORA }}><Grid dark={blue} />{children}</AbsoluteFill>
);
const Kicker: React.FC<{ children: React.ReactNode }> = ({ children }) => <div style={{ position: "absolute", left: 0, right: 0, top: 96, textAlign: "center", fontFamily: MONO, fontSize: 22, letterSpacing: 4, color: "#6b6f7c" }}>{children}</div>;
const Hook: React.FC<{ children: React.ReactNode; top?: number; size?: number }> = ({ children, top = 200, size = 108 }) => { const f = useCurrentFrame(); return <div style={{ position: "absolute", left: 60, right: 60, top, textAlign: "center", fontSize: size, fontWeight: 700, color: INK, letterSpacing: -4, lineHeight: 1.0, ...pop(f, 0) }}>{children}</div>; };
const Hi: React.FC<{ children: React.ReactNode }> = ({ children }) => <span style={{ color: BLUE }}>{children}</span>;

/** Karaoke captions: the current phrase (≤4 words, cut at punctuation) with the spoken word in a blue box. */
type Word = { w: string; s: number; e: number };
const phrases = (words: Word[]) => { const out: Word[][] = []; let cur: Word[] = []; for (const w of words) { cur.push(w); if (/[.,?!]$/.test(w.w) || cur.length >= 4) { out.push(cur); cur = []; } } if (cur.length) out.push(cur); return out; };
const Karaoke: React.FC<{ words: Word[]; t0: number; top?: number }> = ({ words, t0, top = 1420 }) => {
  const f = useCurrentFrame(); const t = (f - t0) / S; const ph = phrases(words); const i = ph.findIndex((p, k) => t >= p[0].s - 0.05 && (k === ph.length - 1 ? t < p[p.length - 1].e + 1.2 : t < ph[k + 1][0].s - 0.05)); if (i < 0) return null; const p = ph[i];
  return (
    <div style={{ position: "absolute", left: 40, right: 40, top, textAlign: "center", fontFamily: SORA, fontSize: 70, fontWeight: 700, lineHeight: 1.25, letterSpacing: -1.5, ...pop((t - (p[0].s - 0.05)) * S, 0) }}>
      {p.map((w, k) => { const on = t >= w.s - 0.03; const now = on && (k === p.length - 1 || t < p[k + 1].s - 0.03); return <span key={k} style={{ display: "inline-block", margin: "0 7px", padding: "2px 14px", borderRadius: 16, color: now ? "#fff" : on ? INK : "#b4b7c2", background: now ? BLUE : "transparent", transform: now ? "scale(1.06)" : "none", textShadow: now ? "none" : "0 2px 0 #fff" }}>{w.w}</span>; })}
    </div>
  );
};

// ---- vertical pieces ----
const LivePhone: React.FC<{ pills?: string[] }> = ({ pills = [] }) => { const f = useCurrentFrame(); const pulse = 1 + 0.06 * Math.abs(Math.sin(f / 5)); return (<>
  <div style={{ position: "absolute", left: 215, top: 300, width: 650, height: 940, borderRadius: 66, background: "linear-gradient(180deg,#141a33,#0b0f24)", boxShadow: "0 60px 120px rgba(15,17,23,0.35), inset 0 0 0 12px #05070f", color: "#fff", display: "flex", flexDirection: "column", alignItems: "center", padding: "140px 40px 0", ...pop(f, 0) }}>
    <div style={{ width: 160, height: 160, borderRadius: 80, background: BLUE, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 72, fontWeight: 700, boxShadow: `0 0 0 ${(pulse - 1) * 120}px rgba(50,61,254,0.25)` }}>R</div>
    <div style={{ marginTop: 40, fontSize: 42, fontWeight: 600 }}>Redbud Studio</div>
    <div style={{ marginTop: 12, fontFamily: MONO, fontSize: 20, letterSpacing: 3, color: "#8ea2ff" }}>INCOMING VOICE CALL</div>
    <div style={{ marginTop: 30, fontSize: 28, color: "rgba(255,255,255,0.7)", textAlign: "center", lineHeight: 1.3, fontFamily: INTER }}>"Hi, thanks for calling<br />Redbud Studio…"</div>
    <div style={{ marginTop: "auto", marginBottom: 100, display: "flex", gap: 120 }}><span style={{ width: 110, height: 110, borderRadius: 55, background: "#e5484d", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 44 }}>✕</span><span style={{ width: 110, height: 110, borderRadius: 55, background: "#30a46c", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 44, transform: `scale(${pulse})` }}>☎</span></div>
  </div>
  <div style={{ position: "absolute", left: 0, right: 0, top: 1270, display: "flex", justifyContent: "center", gap: 18 }}>{pills.map((p, i) => <span key={p} style={{ border: `2.5px solid ${INK}`, color: INK, borderRadius: 999, padding: "14px 30px", fontSize: 34, fontWeight: 600, ...pop(f, 8 + i * 8) }}>{p}</span>)}</div>
</>); };
const EndCard: React.FC<{ line: string }> = ({ line }) => { const f = useCurrentFrame(); const bars = Array.from({ length: 40 }, (_, i) => 14 + 60 * Math.abs(Math.sin(i * 0.55 + f * 0.1)) * (0.35 + 0.65 * Math.abs(Math.sin(i * 0.21 + 1.3)))); return (
  <Frame>
    <div style={{ position: "absolute", left: 0, right: 0, top: 520, textAlign: "center", ...pop(f, 0) }}>
      <div style={{ fontSize: 128, fontWeight: 700, color: BLUE, letterSpacing: -5, lineHeight: 1 }}>Vibe Agent</div>
      <div style={{ marginTop: 30, display: "flex", alignItems: "center", justifyContent: "center", gap: 4, height: 80 }}>{bars.map((h, i) => <span key={i} style={{ width: 9, height: h, borderRadius: 5, background: BLUE, opacity: 0.35 + 0.65 * Math.abs(Math.sin(i * 0.3)) }} />)}</div>
      <div style={{ marginTop: 26, display: "inline-flex", alignItems: "center", gap: 16, fontSize: 40, color: INK, fontFamily: INTER, fontWeight: 500, ...pop(f, 10) }}>by <PlivoLogoSvg width={150} color={INK} /></div>
      <div style={{ marginTop: 70, fontSize: 52, fontWeight: 700, color: INK, letterSpacing: -1.5, ...pop(f, 18) }}>{line}</div>
      <div style={{ marginTop: 26, display: "inline-block", background: INK, color: "#fff", fontFamily: INTER, fontWeight: 600, fontSize: 34, padding: "18px 40px", borderRadius: 999, ...pop(f, 26) }}>cx.plivo.com</div>
    </div>
  </Frame>); };

// ---- fast kit scenes ----
const TypeBeat: React.FC = () => <AbsoluteFill><BuilderPage name={NAME} status="Unsaved" zoom="92%" panel={<VibeEmpty typing={PROMPT} typedFrom={0} typedUntil={38} />} /></AbsoluteFill>;
const PlanFast: React.FC<{ speed?: number; g0?: number }> = ({ speed = 5, g0 = 262 }) => { const f = useCurrentFrame(); const items: VibeItem[] = [
  { at: 0, kind: "user", text: PROMPT },
  { at: 4, kind: "text", text: "I'm mapping the receptionist flow and checking the scheduling and handoff components." },
  { at: 12, kind: "checks", items: ["Finding flow components", "Checking voice node settings", "Checking calendar booking"], done: steps(f, 16, 7, 3) },
  { at: 40, kind: "heading", text: "Two quick questions" },
  { at: 40, kind: "bullets", items: ["Should transfers go to Sarah, or should I take a message?", "Do you want a calendar connected, or just callbacks?"] },
  { at: 64, kind: "user", text: "Take a message. Callbacks are fine." },
  { at: 80, kind: "text", text: "Got it. Building the flow now." },
]; return <AbsoluteFill><BuilderPage name={NAME} status="Unsaved" zoom="84%" flow={<LiveFlow g={g0 + f * speed} />} panel={<VibePanel items={items} status="generating" />} /></AbsoluteFill>; };
const FixFast: React.FC = () => { const f = useCurrentFrame(); const items: VibeItem[] = [
  { at: 0, kind: "text", text: "Hostile Message Refusal did not pass. The agent argued with the caller instead of closing the call." },
  { at: 8, kind: "user", text: "Stay calm with hostile callers and end the call politely." },
  { at: 26, kind: "thinking" },
  { at: 42, kind: "text", text: "Done. Elise now stays calm, declines to engage, and ends the call politely." },
  { at: 52, kind: "checks", items: ["Updating the voice node", "Re-running Hostile Message Refusal"], done: steps(f, 56, 14, 2) },
]; return <AbsoluteFill><BuilderPage name={NAME} status="Unsaved" zoom="84%" flow={<LiveFlow g={1010} />} panel={<VibePanel items={items} status="generating" />} /></AbsoluteFill>; };
const SimRows: React.FC<{ hl: [number, string][] }> = ({ hl }) => { const f = useCurrentFrame(); const cur = [...hl].reverse().find(([at]) => f >= at); return <AbsoluteFill><SimulationsPage name={NAME} highlight={cur ? cur[1] : undefined} /></AbsoluteFill>; };

// ---- Short 1: watch it build ------------------------------------------------------------------
const T1 = 12; const a1 = (t: number) => T1 + Math.round(t * S);
const S1: [number, number, React.ReactNode][] = [
  [0.0, 2.26, <Frame><Kicker>VIBE AGENT · PLIVO</Kicker><Hook top={330} size={124}>Watch an AI<br />build a<br /><Hi>receptionist.</Hi></Hook><Screen node={<TypeBeat />} x={1180} y={214} w={728} h={420} top={860} at={10} /></Frame>],
  [2.26, 3.78, <Frame><Kicker>01 · ONE PROMPT</Kicker><Screen node={<TypeBeat />} x={1180} y={214} w={728} h={812} top={170} /></Frame>],
  [3.78, 7.8, <Frame><Kicker>02 · IT ASKS, THEN BUILDS</Kicker><Screen node={<PlanFast />} x={1180} y={214} w={728} h={430} top={170} /><Screen node={<PlanFast />} x={92} y={214} w={1078} h={560} top={830} at={6} /></Frame>],
  [7.8, 9.76, <Frame><Kicker>02 · NODE BY NODE</Kicker><Screen node={<PlanFast g0={760} speed={4} />} x={92} y={214} w={1078} h={812} top={170} /></Frame>],
  [9.76, 14.54, <Frame><Kicker>03 · IT TESTS ITSELF</Kicker><Screen node={<SimulateBeat />} x={92} y={214} w={820} h={620} top={170} /></Frame>],
  [14.54, 15.6, <Frame><Kicker>04 · VOICE</Kicker><Screen node={<VoicePickBeat />} x={92} y={214} w={820} h={640} top={170} /></Frame>],
  [15.6, 17.06, <Frame><Kicker>05 · PUBLISH</Kicker><Screen node={<PublishBeat clickAt={8} />} x={960} y={40} w={950} h={520} top={170} /></Frame>],
  [17.06, 19.36, <Frame><Kicker>06 · A REAL NUMBER</Kicker><Screen node={<ConnectModalBeat pickAt={24} />} x={1170} y={16} w={730} h={700} top={170} /></Frame>],
  [19.36, 22.0, <Frame><Kicker>LIVE</Kicker><LivePhone pills={["10 minutes", "No code"]} /></Frame>],
  [22.0, 26.0, <EndCard line="Build yours today" />],
];
export const SHORT1_FRAMES = a1(26.0);
export const VibeShort1: React.FC = () => (
  <AbsoluteFill style={{ background: "#f6f5f3" }}>
    <Audio src={staticFile(MUSIC.src)} loop volume={0.09} />
    <Sequence from={T1} layout="none"><Audio src={staticFile("vo/shorts/s1b.mp3")} /></Sequence>
    {S1.map(([a, b, node], i) => <Sequence key={i} from={a1(a)} durationInFrames={a1(b) - a1(a)} layout="none">{node}</Sequence>)}
    <Karaoke words={S1_WORDS} t0={T1} />
  </AbsoluteFill>
);

// ---- Short 2: it tests itself -----------------------------------------------------------------
const T2 = 12; const a2 = (t: number) => T2 + Math.round(t * S);
const S2: [number, number, React.ReactNode][] = [
  [0.0, 2.62, <Frame><Kicker>VIBE AGENT · PLIVO</Kicker><Hook top={330} size={116}>Your receptionist<br />just got<br /><Hi>prank called.</Hi></Hook><Screen node={<SimulateBeat />} x={92} y={214} w={820} h={420} top={880} at={10} /></Frame>],
  [2.62, 6.48, <Frame><Kicker>EIGHT FAKE CALLERS · ON PURPOSE</Kicker><Screen node={<SimulateBeat />} x={92} y={214} w={820} h={640} top={170} /></Frame>],
  [6.48, 9.06, <Frame><Kicker>01 · GOALS, WRITTEN FOR YOU</Kicker><Screen node={<SimulateBeat />} x={1180} y={214} w={728} h={812} top={170} /></Frame>],
  [9.06, 16.32, <Frame><Kicker>02 · FAKE CALLERS, REAL TRANSCRIPTS</Kicker><Screen node={<SimRows hl={[[0, ""], [61, "Reject Cold Sales Call"], [107, "Hostile Message Refusal"], [154, "Clarify Vague Inquiry"]]} />} x={92} y={214} w={820} h={640} top={170} /></Frame>],
  [16.32, 18.22, <Frame><Kicker>03 · READ THE CALL</Kicker><Screen node={<SimDetailBeat />} x={1348} y={214} w={560} h={600} top={170} /></Frame>],
  [18.22, 21.5, <Frame><Kicker>04 · FIX IT IN ONE SENTENCE</Kicker><Screen node={<FixFast />} x={1180} y={214} w={728} h={812} top={170} /></Frame>],
  [21.5, 22.84, <Frame><Kicker>05 · PUBLISH</Kicker><Screen node={<PublishBeat clickAt={6} />} x={960} y={40} w={950} h={520} top={170} /></Frame>],
  [22.84, 26.5, <Frame><Kicker>LIVE</Kicker><LivePhone pills={["Tested", "Then shipped"]} /></Frame>],
  [26.5, 30.5, <EndCard line="Try it today" />],
];
export const SHORT2_FRAMES = a2(30.5);
export const VibeShort2: React.FC = () => (
  <AbsoluteFill style={{ background: "#f6f5f3" }}>
    <Audio src={staticFile(MUSIC.src)} loop volume={0.09} />
    <Sequence from={T2} layout="none"><Audio src={staticFile("vo/shorts/s2b.mp3")} /></Sequence>
    {S2.map(([a, b, node], i) => <Sequence key={i} from={a2(a)} durationInFrames={a2(b) - a2(a)} layout="none">{node}</Sequence>)}
    <Karaoke words={S2_WORDS} t0={T2} />
  </AbsoluteFill>
);
