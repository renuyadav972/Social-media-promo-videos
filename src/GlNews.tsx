import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate, Easing } from "remotion";
import { PlivoLogoSvg } from "./PlivoLogoSvg";
import { MONO, SORA, INTER } from "./StyleFrames";
import { GlListBeat, GlPlatformBeat, GlUriBeat, GlLinkBeat, GlDoneBeat, GL_NUMBER } from "./cards/GlBeats";
import { OaiWebhooksPage } from "./cards/OpenAiKit";
import { Phone } from "./Hooks";
import { T, TB as TBW } from "./glNewsTimes";
import { GL_REAL_CALL_ENV } from "./glRealCallEnv";

// ============================================================================
// OpenAI GPT-Live launch video, THREE-PART cut (the xAI v25 format, its own script and idea):
// intro on the words (full duplex: the agent gets interrupted; the four things between a caller and
// the model) → Part 1 the trunk on Plivo (console kit, camera regions) → Part 2 the webhook on OpenAI
// → Part 3 the handshake (diagram builds, then the accept request) → a real call → closer.
// Timings come from glNewsTimes.ts (tools/gl_times.py over the narration's word times).
// ============================================================================
const S = 30; const BG = "#f9fafb"; const INK = "#0f1117"; const BLUE = "#323dfe"; const PURPLE = "#cd3ef9"; const GRAY = "#6b7280"; const LINE = "rgba(15,17,23,0.10)"; const GREEN = "#16a34a";
const GRAD = "linear-gradient(90deg, #cd3ef9 0%, #323dfe 100%)"; const HAIR = "rgba(15,17,23,0.12)";
const ease = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { easing: Easing.inOut(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const pop = (f: number, at: number): React.CSSProperties => { const p = interpolate(f, [at, at + 16], [0, 1], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" }); return { opacity: p, transform: `translateY(${(1 - p) * 20}px)` }; };
const Hi: React.FC<{ children: React.ReactNode }> = ({ children }) => <span style={{ color: BLUE }}>{children}</span>;
const GCard: React.FC<{ style?: React.CSSProperties; dark?: boolean; children: React.ReactNode }> = ({ style, dark, children }) => <div style={{ borderRadius: 20, background: dark ? "#0b0b0d" : "#fff", border: `1px solid ${dark ? "rgba(255,255,255,0.10)" : HAIR}`, boxShadow: "0 20px 50px rgba(15,17,23,0.10)", ...style }}>{children}</div>;

// ---- timeline -----------------------------------------------------------------------------------
const TA = 16; const na = (t: number) => TA + Math.round(t * S);
const T_S1 = na(T.part1 - 0.1); const T_S2 = na(T.part2 - 0.05); const T_S3 = na(T.part3 - 0.05);
const CALL_LEN = Math.round(22.7 * S); const T_CALL = na(T.endA) + 24; const T_CALL_END = T_CALL + CALL_LEN + 20;
const TB = T_CALL_END; const nb = (t: number) => TB + Math.round(t * S);
export const GL_NEWS_FRAMES = nb(TBW.endB) + 110;

const Stage: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: BG, fontFamily: SORA, color: INK, overflow: "hidden" }}>
    <div style={{ position: "absolute", top: 44, right: 72 }}><PlivoLogoSvg width={100} color={INK} /></div>
    {children}
  </AbsoluteFill>
);
type Ring = { at: number; x: number; y: number };
const RingsIn: React.FC<{ f: number; rings: Ring[] }> = ({ f, rings }) => <>{rings.map((r, i) => { const tt = f - r.at; if (tt < -6 || tt > 40) return null; const rad = 18 + Math.max(0, tt) * 3.2; return <React.Fragment key={i}><div style={{ position: "absolute", left: r.x - rad, top: r.y - rad, width: rad * 2, height: rad * 2, borderRadius: "50%", border: `2.5px solid ${BLUE}`, opacity: Math.max(0, 0.9 - Math.max(0, tt) / 40) }} /><div style={{ position: "absolute", left: r.x - 7, top: r.y - 7, width: 14, height: 14, borderRadius: 7, background: BLUE, opacity: ease(f, r.at - 6, r.at) * (1 - Math.max(0, tt - 26) / 14) }} /></React.Fragment>; })}</>;
// the console: one crop of the built screen per beat, scaled up to fill the stage; the camera eases
// between crops (LiveKit's Screen model), so there is no small full screen with lenses popping over it.
const FX = 620, FY = 200, FW = 1230, FH = Math.round(1080 * FW / 1920);
type Rect = { x: number; y: number; w: number; h: number; at: number };
const FULL: Rect = { x: 0, y: 0, w: 1920, h: 1080, at: 0 };
const fit = (r: Rect) => { const Z = Math.min(FW / r.w, FH / r.h, 1.6); return { Z, w: r.w * Z, h: r.h * Z }; };
const R = (x: number, y: number, at: number): Rect => ({ x, y, w: 960, h: 540, at });
const camAt = (f: number, rects: Rect[]) => { const list = [FULL, ...rects].filter((r) => r.at <= f); const cur = list[list.length - 1]; const prev = list.length > 1 ? list[list.length - 2] : cur; const k = cur === prev || cur.at === 0 ? 1 : ease(f, cur.at, cur.at + 24); const L = (a: number, b: number) => a + (b - a) * k; const fp = fit(prev), fc = fit(cur); return { x: L(prev.x, cur.x), y: L(prev.y, cur.y), Z: L(fp.Z, fc.Z), w: L(fp.w, fc.w), h: L(fp.h, fc.h) }; };
const Screen: React.FC<{ node: React.ReactNode; rects?: Rect[]; rings?: Ring[]; fade?: boolean }> = ({ node, rects = [], rings = [], fade = true }) => { const f = useCurrentFrame(); const e = fade ? ease(f, 0, 10) : 1; const c = camAt(f, rects); const left = FX + (FW - c.w) / 2, top = FY + (FH - c.h) / 2; return (
  <div style={{ position: "absolute", left, top, width: c.w, height: c.h, borderRadius: 14, overflow: "hidden", background: "#fff", boxShadow: "0 30px 70px rgba(15,17,23,0.14)", border: `1px solid ${HAIR}`, opacity: e }}>
    <div style={{ position: "absolute", left: -c.x * c.Z, top: -c.y * c.Z, width: 1920, height: 1080, transform: `scale(${c.Z})`, transformOrigin: "0 0" }}>{node}<RingsIn f={f} rings={rings} /></div>
  </div>); };

// ---- 1. intro: story beats cut to the words ------------------------------------------------------

// ---- 1. intro: full duplex, then the four things between a caller and the model -------------------
const AGENT_LINE = "Thanks for calling. I can help you book, reschedule, or cancel an appointment. Which would you";
const Intro: React.FC = () => { const f = useCurrentFrame(); const t = (s: number) => na(s);
  const title = "GPT-Live"; const typed = title.slice(0, Math.max(0, Math.floor((f - t(T.gpt) + 4) / 2.4))); const cursorOn = f < t(T.gpt + 2.2) && Math.floor(f / 14) % 2 === 0;
  const hd = ease(f, t(T.gpt + 2.4), t(T.gpt + 3.0));
  const cut = f >= t(T.interrupt); const n = cut ? Math.floor(ease(f, t(T.gpt + 2.6), t(T.interrupt)) * AGENT_LINE.length) : Math.floor(ease(f, t(T.gpt + 2.6), t(T.interrupt) + 40) * AGENT_LINE.length);
  const caller = f >= t(T.interrupt + 0.15); const stopped = f >= t(T.stops); const cardOut = ease(f, t(T.but), t(T.but + 0.5)); const phone = f >= t(T.built); const shove = ease(f, t(T.built), t(T.built + 0.5));
  const nodes: [number, string, string][] = [[T.number1, "Phone number", "☎"], [T.trunk1, "SIP trunk", "⇄"], [T.openai3 > 0 ? T.trunk1 + 0.5 : 0, "OpenAI project", "●"], [T.webhook1, "Webhook", "↯"]];
  const strip = f >= t(T.between); const stripOut = 1; const plivoOn = f >= t(T.plivo1);
  return (
  <Stage>
    <div style={{ position: "absolute", left: 0, right: 0, top: 330 - hd * 250, display: "flex", justifyContent: "center", transform: `scale(${1 - hd * 0.55})`, transformOrigin: "50% 0%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 28 }}><span style={{ fontSize: 30, fontWeight: 600, color: GRAY, opacity: ease(f, t(0), t(0.5)) }}>OpenAI</span><div style={{ fontSize: 112, fontWeight: 600, letterSpacing: -4, lineHeight: 1 }}>{typed.slice(0, 4)}<span style={{ color: BLUE }}>{typed.slice(4)}</span><span style={{ display: "inline-block", width: 5, height: 92, background: INK, marginLeft: 8, verticalAlign: "-10px", opacity: cursorOn ? 1 : 0 }} /></div></div>
    </div>
    {/* the full-duplex card: the agent is mid-sentence, the caller cuts in, the agent stops and listens */}
    {f >= t(T.gpt + 2.4) && cardOut < 1 ? <div style={{ position: "absolute", left: 420, top: 330, width: 1080, ...pop(f, t(T.gpt + 2.4)), opacity: 1 - cardOut, transform: `translateX(${-shove * 330}px)` }}><GCard><div style={{ padding: "28px 32px", display: "flex", flexDirection: "column", gap: 18, fontFamily: INTER }}>
      <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}><span style={{ width: 44, height: 44, borderRadius: 22, background: INK, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontFamily: MONO, flexShrink: 0 }}>AI</span><div style={{ background: "#f1f2f4", borderRadius: 16, padding: "14px 20px", fontSize: 24, lineHeight: 1.4, maxWidth: 800, color: stopped ? GRAY : INK }}>{AGENT_LINE.slice(0, n)}{cut ? <span style={{ color: GRAY }}>…</span> : <span style={{ opacity: Math.round(f / 6) % 2 }}>▍</span>}</div></div>
      {caller ? <div style={{ display: "flex", gap: 16, alignItems: "flex-start", justifyContent: "flex-end", ...pop(f, t(T.interrupt + 0.15)) }}><div style={{ background: BLUE, color: "#fff", borderRadius: 16, padding: "14px 20px", fontSize: 24, lineHeight: 1.4 }}>Reschedule. Tomorrow, same time.</div><span style={{ width: 44, height: 44, borderRadius: 22, background: "#e5e7eb", color: INK, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>☎</span></div> : null}
      <div style={{ display: "flex", alignItems: "center", gap: 14, paddingTop: 14, borderTop: `1px solid ${HAIR}` }}><span style={{ fontFamily: MONO, fontSize: 13, letterSpacing: 2, color: stopped ? BLUE : GRAY }}>{stopped ? "● LISTENING" : caller ? "● INTERRUPTED" : "● SPEAKING"}</span><div style={{ display: "flex", gap: 3, alignItems: "center", height: 28, marginLeft: 8 }}>{Array.from({ length: 30 }, (_, i) => { const live = !caller || stopped; return <span key={i} style={{ width: 3, height: live ? 4 + 22 * Math.abs(Math.sin(i * 0.7 + f * 0.3)) : 4, borderRadius: 2, background: stopped ? BLUE : INK, opacity: live ? 0.7 : 0.25 }} />; })}</div></div>
    </div></GCard></div> : null}
    {/* the phone arrives on "built for phone calls"; it cannot connect on its own */}
    {phone && !strip ? <div style={{ position: "absolute", inset: 0, transform: "scale(0.62)", transformOrigin: "50% 50%" }}><Phone f={f} enterAt={t(T.built)} left={1180}>
      <div style={{ width: 120, height: 120, borderRadius: 60, background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 50 }}>☎</div>
      <div style={{ marginTop: 30, fontSize: 30, fontWeight: 600 }}>{f >= t(T.but) ? "No route to GPT-Live" : "Phone"}</div>
      <div style={{ marginTop: 10, fontFamily: MONO, fontSize: 30, letterSpacing: 1, opacity: 0.35 }}>{GL_NUMBER}</div>
      <div style={{ marginTop: 180, display: "flex", gap: 60 }}><span style={{ width: 96, height: 96, borderRadius: 48, background: "rgba(255,255,255,0.12)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>✕</span><span style={{ width: 96, height: 96, borderRadius: 48, background: "rgba(255,255,255,0.12)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>☎</span></div>
    </Phone></div> : null}
    {/* the line: what sits between a caller and the model, one node per word; Plivo takes the first two */}
    {strip ? <>
      <div style={{ position: "absolute", left: 250, top: 529, width: Math.round(1420 * ease(f, t(T.between), t(T.webhook1 + 0.4))), height: 2, background: INK, opacity: 0.3 }} />
      {nodes.map(([at, label, icon], i) => { const x = 250 + i * 473; const mine = i < 2 && plivoOn; return <div key={label} style={{ position: "absolute", left: x - 60, top: 470, width: 120, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, ...pop(f, t(at)) }}><div style={{ width: 120, height: 120, borderRadius: 60, background: mine ? BLUE : "#fff", border: `1px solid ${mine ? BLUE : HAIR}`, boxShadow: "0 20px 50px rgba(15,17,23,0.10)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, color: mine ? "#fff" : INK }}>{icon}</div><span style={{ fontFamily: INTER, fontSize: 22, color: INK, whiteSpace: "nowrap" }}>{label}</span></div>; })}
      {plivoOn ? <div style={{ position: "absolute", left: 250 - 80, top: 360, width: 473 + 160, display: "flex", justifyContent: "center", ...pop(f, t(T.plivo1)) }}><div style={{ display: "inline-flex", alignItems: "center", gap: 14, background: "#fff", border: `1px solid ${HAIR}`, borderRadius: 14, boxShadow: "0 16px 40px rgba(15,17,23,0.12)", padding: "12px 22px" }}><PlivoLogoSvg width={100} color={INK} /><span style={{ fontSize: 22, fontWeight: 600 }}><Hi>handles these</Hi></span></div></div> : null}
    </> : null}
  </Stage>); };

// ---- 2. a step: key points on the left, the console on the right ---------------------------------
type Shot = { a: number; b: number; node: React.ReactNode; rings?: Ring[]; rects?: Rect[] };
const Side: React.FC<{ n: string; side: string; title: React.ReactNode; points: [number, string][]; from: number; start: number }> = ({ n, side, title, points, from, start }) => { const f = useCurrentFrame() + from; return (
  <div style={{ position: "absolute", left: 90, top: 200, width: 480 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 14, ...pop(f, 0) }}><span style={{ width: 44, height: 44, borderRadius: 22, background: INK, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontSize: 16 }}>{n}</span></div>
    <div style={{ marginTop: 22, height: 64, display: "flex", alignItems: "center", ...pop(f, 4) }}>{side === "plivo" ? <PlivoLogoSvg width={150} color={INK} /> : <span style={{ fontSize: 40, fontWeight: 600, letterSpacing: -1.2 }}>OpenAI</span>}</div>
    <div style={{ marginTop: 14, fontSize: 46, fontWeight: 700, letterSpacing: -1.8, lineHeight: 1.08, ...pop(f, 8) }}>{title}</div>
    <div style={{ marginTop: 34, display: "flex", flexDirection: "column", gap: 18 }}>{points.map(([at, text]) => { const on = f + start >= na(at); return <div key={text} style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: INTER, fontSize: 24, fontWeight: 500, color: INK, opacity: on ? 1 : 0, transform: `translateX(${on ? 0 : -12}px)` }}><span style={{ width: 14, height: 2, background: INK, opacity: 0.6, flexShrink: 0 }} />{text}</div>; })}</div>
  </div>); };
const ShotView: React.FC<{ s: Shot; first: boolean }> = ({ s, first }) => <Screen node={s.node} rects={s.rects} rings={s.rings} fade={first} />;
const Step: React.FC<{ n: string; side: string; title: React.ReactNode; points: [number, string][]; shots: Shot[]; start: number }> = ({ n, side, title, points, shots, start }) => (
  <Stage>
    {shots.map((s, i) => <Sequence key={i} from={na(s.a) - start} durationInFrames={na(s.b) - na(s.a)} layout="none"><ShotView s={s} first={i === 0} /></Sequence>)}
    {shots.map((s, i) => <Sequence key={"s" + i} from={na(s.a) - start} durationInFrames={na(s.b) - na(s.a)} layout="none"><Side n={n} side={side} title={title} points={points} from={na(s.a) - start} start={start} /></Sequence>)}
  </Stage>);
const fr = (a: number, b: number) => Math.round((b - a) * S); // frames between two anchor times

// part 1 screens (Plivo). PLACEHOLDER regions: the project-ID step still shows the old modal until a
// current console recording of the OpenAI Realtime trunk flow arrives.
const L0 = T.part1 - 0.1, N0 = T.name - 0.15, P0 = T.then - 0.1, U0 = T.plivo2 - 0.1, K0 = T.link - 0.1, D0 = T.every - 0.1;
const STEP1: Shot[] = [
  { a: L0, b: N0, node: <GlListBeat clickAt={fr(L0, T.open + 1.2)} />, rects: [R(0, 100, 0), R(960, 0, fr(L0, T.open + 1.2) - 60)] },
  { a: N0, b: U0, node: <GlPlatformBeat openAt={fr(N0, T.then + 0.3)} hoverAt={fr(N0, T.openai1 - 0.1)} pickAt={fr(N0, T.openai1 + 0.6)} />, rects: [R(960, 60, 0)] },
  { a: U0, b: K0, node: <GlUriBeat modalAt={fr(U0, T.all - 0.3)} projFrom={fr(U0, T.project1 - 0.2)} projUntil={fr(U0, T.project1 + 0.9)} createdAt={fr(U0, T.link - 0.5)} />, rects: [R(960, 60, 0), { x: 600, y: 260, w: 720, h: 405, at: fr(U0, T.all - 0.2) }] },
  { a: K0, b: D0, node: <GlLinkBeat openAt={fr(K0, T.link - 0.2)} pickAt={fr(K0, T.link + 0.6)} createAt={fr(K0, T.create2 + 0.2)} />, rects: [R(960, 520, 0)] },
  { a: D0, b: T.part2 - 0.05, node: <GlDoneBeat />, rects: [R(960, 40, 0), R(240, 100, 60)] },
];
// part 2 screens (OpenAI): the webhook endpoint appears on "add", the event on "subscribe"
const WebhookScreen: React.FC<{ rowAt: number }> = ({ rowAt }) => { const f = useCurrentFrame(); return <OaiWebhooksPage row={f >= rowAt} />; };
const W0 = T.part2 - 0.05;
const STEP2: Shot[] = [
  { a: W0, b: T.part3 - 0.05, node: <WebhookScreen rowAt={fr(W0, T.add + 0.4)} />, rects: [R(560, 120, fr(W0, T.in2))] },
];
// part 3: the handshake diagram, then the accept request
const Handshake: React.FC = () => { const f = useCurrentFrame() + T_S3; const t = (s: number) => na(s); const on = (s: number) => f >= t(s);
  const stage: [number, string, string][] = [[T.acall, "Caller", "☎"], [T.plivo3, "Plivo", ""], [T.openai3, "OpenAI", "●"], [T.your3, "Your backend", "{ }"]];
  const seg = (i: number, at: number) => <div key={"s" + i} style={{ position: "absolute", left: 250 + i * 473 + 60, top: 449, width: Math.round(353 * ease(f, t(at), t(at) + 14)), height: 2, background: INK, opacity: 0.3 }} />;
  const accept = on(T.accept);
  return (
  <Stage>
    <div style={{ position: "absolute", left: 90, top: 200, width: 480 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, ...pop(f - T_S3, 0) }}><span style={{ width: 44, height: 44, borderRadius: 22, background: INK, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontSize: 16 }}>03</span></div>
      <div style={{ marginTop: 40, fontSize: 46, fontWeight: 700, letterSpacing: -1.8, lineHeight: 1.08, ...pop(f - T_S3, 6) }}>The <Hi>handshake.</Hi></div>
      <div style={{ marginTop: 34, display: "flex", flexDirection: "column", gap: 18 }}>{([[T.acall, "A call lands on your number"], [T.plivo3, "Plivo sends it to OpenAI"], [T.openai3 + 1.5, "OpenAI asks your backend"], [T.accept, "Your backend accepts"]] as [number, string][]).map(([at, text]) => { const o = on(at); return <div key={text} style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: INTER, fontSize: 24, fontWeight: 500, color: INK, opacity: o ? 1 : 0, transform: `translateX(${o ? 0 : -12}px)` }}><span style={{ width: 14, height: 2, background: INK, opacity: 0.6, flexShrink: 0 }} />{text}</div>; })}</div>
    </div>
    {/* the diagram, in the console's place */}
    <div style={{ position: "absolute", left: 620, top: 200, width: 1230, height: 692 }}>
      {stage.map(([at, label, icon], i) => { const x = 80 + i * 330; return on(at) ? <div key={label} style={{ position: "absolute", left: x, top: 180, width: 140, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, ...pop(f, t(at)) }}><div style={{ width: 110, height: 110, borderRadius: 55, background: i === 1 ? "#fff" : i === 3 ? INK : "#fff", border: `1px solid ${i === 3 ? INK : HAIR}`, boxShadow: "0 20px 50px rgba(15,17,23,0.10)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: i === 3 ? 26 : 38, color: i === 3 ? "#fff" : INK, fontFamily: i === 3 ? MONO : undefined }}>{i === 1 ? <PlivoLogoSvg width={64} color={INK} /> : icon}</div><span style={{ fontFamily: INTER, fontSize: 21, color: INK, whiteSpace: "nowrap" }}>{label}</span></div> : null; })}
      {[T.plivo3, T.openai3, T.your3].map((at, i) => on(at) ? <div key={i} style={{ position: "absolute", left: 80 + i * 330 + 125, top: 234, width: Math.round(190 * ease(f, t(at), t(at) + 14)), height: 2, background: INK, opacity: 0.3 }} /> : null)}
      {on(T.your3) ? <div style={{ position: "absolute", left: 80 + 2 * 330 + 40, top: 150, fontFamily: MONO, fontSize: 14, letterSpacing: 2, color: GRAY, ...pop(f, t(T.your3 + 0.3)) }}>live.transport.incoming →</div> : null}
      {accept ? <div style={{ position: "absolute", left: 80, top: 380, width: 1070, ...pop(f, t(T.accept)) }}><GCard dark><div style={{ padding: "26px 30px", fontFamily: MONO, fontSize: 22, lineHeight: 1.6, color: "#e6edf3" }}>
        <div><span style={{ color: "#8b949e" }}>POST</span> /v1/live/sessions/<span style={{ color: "#8b949e" }}>{"{session_id}"}</span>/accept</div>
        <div style={{ marginTop: 8 }}>{"{"} "session": {"{"}</div>
        <div style={{ paddingLeft: 40, opacity: on(T.model) ? 1 : 0.25 }}>"model": <span style={{ color: BLUE }}>"gpt-live-1"</span>,</div>
        <div style={{ paddingLeft: 40, opacity: on(T.voice) ? 1 : 0.25 }}>"audio": {"{"} "output": {"{"} "voice": <span style={{ color: BLUE }}>"marin"</span> {"}"} {"}"},</div>
        <div style={{ paddingLeft: 40, opacity: on(T.instructions) ? 1 : 0.25 }}>"instructions": <span style={{ color: BLUE }}>"You are the receptionist for Redbud Studio…"</span></div>
        <div>{"}"} {"}"}</div>
      </div></GCard></div> : null}
      {on(T.from) ? <div style={{ position: "absolute", left: 80, top: 640, display: "flex", alignItems: "center", gap: 14, ...pop(f, t(T.from)) }}><span style={{ width: 10, height: 10, borderRadius: 5, background: GREEN }} /><span style={{ fontFamily: INTER, fontSize: 22, color: INK }}>Connected. The caller is talking to GPT-Live.</span></div> : null}
    </div>
  </Stage>); };

// ---- 4. the call (PLACEHOLDER: the earlier agent-to-agent recording; replace with the real human call) --
const LINES: [number, number, "AGENT" | "YOU", string][] = [
  [0.0, 3.6, "AGENT", "Hi, thanks for calling Plivo. What can I help you with today?"],
  [4.15, 11.15, "YOU", "Hi, I'm building a voice agent and I want to put it on a real phone number. Does Plivo support SIP trunking for that?"],
  [11.7, 22.7, "AGENT", "I'll check that for you. Yes, Plivo supports SIP trunking through Zentrunk, so you can connect your voice agent to the public phone network for inbound and outbound calls."],
];
const REAL_CALL_ENV = GL_REAL_CALL_ENV;
const Call: React.FC = () => { const f = useCurrentFrame(); const t = f / S; const secs = Math.floor(Math.max(0, t)); const cur = LINES.findIndex(([a, b]) => t >= a && t < b + 0.3); const lvl = REAL_CALL_ENV[f] ?? 0; const e = ease(f, 0, 10); return (
  <Stage>
    <div style={{ position: "absolute", left: 90, top: 200, width: 480, opacity: e }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}><span style={{ width: 14, height: 14, borderRadius: 7, background: GREEN, boxShadow: "0 0 0 8px rgba(22,163,74,0.18)" }} /><span style={{ fontSize: 30, fontWeight: 700 }}>Connected</span><span style={{ marginLeft: "auto", fontFamily: MONO, fontSize: 26 }}>00:{String(secs).padStart(2, "0")}</span></div>
      <div style={{ marginTop: 26 }}><GCard><div style={{ padding: "22px 24px", display: "flex", flexDirection: "column", gap: 14 }}><div style={{ fontFamily: MONO, fontSize: 24 }}>☎ {GL_NUMBER}</div><div style={{ fontFamily: INTER, fontSize: 18, color: GRAY }}>a real phone, calling the Plivo number</div></div></GCard></div>
      <div style={{ margin: "8px 0 8px 40px", width: 1, height: 46, background: HAIR }} />
      <div style={{ display: "inline-flex", alignItems: "center", gap: 12, background: "#fff", padding: "10px 18px", borderRadius: 12, boxShadow: "0 16px 40px rgba(15,17,23,0.14)", marginLeft: 20 }}><PlivoLogoSvg width={80} color={INK} /><span style={{ fontSize: 18, fontWeight: 700 }}><Hi>SIP Trunking</Hi></span></div>
      <div style={{ margin: "8px 0 8px 40px", width: 1, height: 46, background: HAIR }} />
      <GCard dark><div style={{ padding: "22px 24px", display: "flex", alignItems: "center", gap: 16, color: "#fff" }}><span style={{ fontFamily: MONO, fontSize: 18, color: "#fff" }}>AI</span><div><div style={{ fontSize: 22, fontWeight: 700 }}>Athena Pottery Support</div><div style={{ fontFamily: INTER, fontSize: 16, color: "rgba(255,255,255,0.6)" }}>OpenAI GPT-Live voice agent</div></div></div></GCard>
    </div>
    <div style={{ position: "absolute", left: FX, top: FY, width: FW, height: FH, borderRadius: 16, background: "#fff", boxShadow: "0 30px 70px rgba(15,17,23,0.14)", border: `1px solid ${HAIR}`, opacity: e, padding: "60px 70px", boxSizing: "border-box", fontFamily: INTER }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        {LINES.map(([a, b, w, txt], i) => { if (t < a - 0.1) return null; const on = i === cur; const n = Math.floor(Math.max(0, (t - a) / (b - a)) * txt.length); const me = w === "YOU"; return (
          <div key={i} style={{ display: "flex", justifyContent: me ? "flex-end" : "flex-start", opacity: i < cur ? 0.6 : 1 }}>
            <div style={{ maxWidth: 820, background: me ? "#f1f2f4" : "#0b0b0d", color: me ? INK : "#fff", borderRadius: 22, padding: "20px 26px", fontSize: 30, lineHeight: 1.35 }}>{txt.slice(0, n)}{on && n < txt.length ? <span style={{ opacity: Math.round(f / 6) % 2 }}>▍</span> : null}</div>
          </div>); })}
      </div>
      <div style={{ position: "absolute", left: 70, bottom: 50, display: "flex", alignItems: "center", gap: 18 }}><span style={{ fontFamily: MONO, fontSize: 13, letterSpacing: 3, color: cur >= 0 && LINES[cur][2] === "YOU" ? GRAY : BLUE }}>{cur >= 0 ? (LINES[cur][2] === "YOU" ? "CALLER" : "GPT-LIVE") : ""}</span><div style={{ display: "flex", gap: 4, alignItems: "center", height: 36 }}>{Array.from({ length: 40 }, (_, i) => <span key={i} style={{ width: 3, height: 4 + 26 * lvl * (0.4 + 0.6 * Math.abs(Math.sin(i * 0.8 + f * 0.3))), borderRadius: 2, background: INK, opacity: 0.7 }} />)}</div></div>
      <div style={{ position: "absolute", right: 70, bottom: 56, fontFamily: MONO, fontSize: 13, letterSpacing: 3, color: GRAY }}>REAL CALL · RECORDED ON PLIVO</div>
    </div>
    <Audio src={staticFile("vo/gptlive2/real-call-1-tight.mp3")} trimAfter={CALL_LEN} volume={(fr) => 1.15 * Math.min(1, (CALL_LEN - fr) / 12)} />
  </Stage>); };


// ---- 5. closer ------------------------------------------------------------------------------------
// ---- 4. closer ------------------------------------------------------------------------------------
const Closer: React.FC = () => { const f = useCurrentFrame(); const t = (s: number) => nb(s) - TB; return (
  <Stage>
    <div style={{ position: "absolute", left: 0, right: 0, top: 230, display: "flex", justifyContent: "center", alignItems: "center", gap: 40, ...pop(f, t(TBW.thats)) }}><span style={{ fontSize: 64, fontWeight: 600, letterSpacing: -2 }}>OpenAI</span><span style={{ width: 120, height: 5, borderRadius: 3, backgroundImage: GRAD }} /><PlivoLogoSvg width={300} color={INK} /></div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 420, textAlign: "center", fontSize: 54, fontWeight: 600, letterSpacing: -1.8, color: GRAY, ...pop(f, t(TBW.real)) }}>on a real phone line.</div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 540, textAlign: "center", fontSize: 78, fontWeight: 700, letterSpacing: -2.8, lineHeight: 1.1 }}><div style={pop(f, t(TBW.built))}>OpenAI built the model.</div><div style={pop(f, t(TBW.brings))}><Hi>Plivo brings the calls.</Hi></div></div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 800, textAlign: "center", ...pop(f, t(TBW.endB + 0.6)) }}><span style={{ display: "inline-block", background: INK, color: "#fff", fontFamily: INTER, fontWeight: 600, fontSize: 26, padding: "14px 32px", borderRadius: 999 }}>cx.plivo.com</span></div>
  </Stage>); };


// ---- music bed: calm loop under everything, ducked under the call, out over the last 2.5 s -------
const MUSIC = 0.13;
const musicVol = (f: number) => { const inn = Math.min(1, f / 30); const out = Math.min(1, Math.max(0, (GL_NEWS_FRAMES - f) / 75)); const duck = f >= T_CALL && f < T_CALL_END ? 0.55 : 1; return MUSIC * inn * out * duck; };


export const GlNews: React.FC = () => (
  <AbsoluteFill style={{ background: BG }}>
    <Audio src={staticFile("cinno-loop.mp3")} loop volume={musicVol} />
    <Sequence from={TA} layout="none"><Audio src={staticFile("vo/gl2/news-a.mp3")} /></Sequence>
    <Sequence from={TB} layout="none"><Audio src={staticFile("vo/gl2/news-b.mp3")} /></Sequence>
    <Sequence from={0} durationInFrames={T_S1} layout="none"><Intro /></Sequence>
    <Sequence from={T_S1} durationInFrames={T_S2 - T_S1} layout="none"><Step n="01" side="plivo" title={<>The <Hi>trunk.</Hi></>} start={T_S1} shots={STEP1} points={[[T.open, "SIP Trunking → Create Trunk"], [T.name, "Name the trunk"], [T.then, "Platform: OpenAI Realtime"], [T.plivo2, "SIP address + TLS, filled in"], [T.all, "Your OpenAI project ID"], [T.link, "Link your number"], [T.every, "Calls now travel to OpenAI"]]} /></Sequence>
    <Sequence from={T_S2} durationInFrames={T_S3 - T_S2} layout="none"><Step n="02" side="openai" title={<>The <Hi>webhook.</Hi></>} start={T_S2} shots={STEP2} points={[[T.in2, "Project settings → Webhooks"], [T.add, "Endpoint: your backend"], [T.subscribe, "Event: incoming live calls"], [T.thats, "That's all OpenAI needs"]]} /></Sequence>
    <Sequence from={T_S3} durationInFrames={T_CALL - T_S3} layout="none"><Handshake /></Sequence>
    <Sequence from={T_CALL} durationInFrames={T_CALL_END - T_CALL} layout="none"><Call /></Sequence>
    <Sequence from={TB} durationInFrames={GL_NEWS_FRAMES - TB} layout="none"><Closer /></Sequence>
  </AbsoluteFill>
);
