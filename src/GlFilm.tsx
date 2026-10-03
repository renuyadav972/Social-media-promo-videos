import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate, Easing } from "remotion";
import { PlivoLogoSvg } from "./PlivoLogoSvg";
import { SORA_FAMILY, INTER_FAMILY } from "./fonts";
import { JBM } from "./glFonts";
import { T, TB as TBW } from "./glNewsTimes";
import { NARR_A, NARR_B } from "./glNarrEnv";
import { GL_CALL_CUT_ENV } from "./glCallCutEnv";
import { GlListBeat, GlPlatformBeat, GlUriBeat, GlLinkBeat, GlDoneBeat, GL_NUMBER } from "./cards/GlBeats";
import { OaiWebhooksPage } from "./cards/OpenAiKit";

// ============================================================================
// OpenAI GPT-Live launch film, built to the Plivo product-videos playbook: near-white instrument
// field, near-black type, fine grey rules, blue only for the active signal. One world, one camera.
// Three plates (number, trunk, webhook) carry the story: they rise as the narration names them,
// the camera pushes into each to reveal the console inside it, then pulls back for the handshake.
// Timings from glNewsTimes.ts (word onsets); sound bars from the measured narration envelope.
// ============================================================================
const S = 30;
const BG = "#fbfbfc"; const FG = "#111318"; const SURF = "#ffffff"; const BORDER = "#c4c7cf"; const BORDER2 = "#9ea2ad"; const MUTED = "#666a75"; const BLUE = "#323dfe"; const CODE_BG = "#15171c"; const CODE_FG = "#f0f3f7"; const CODE_MUTED = "#a3a7b2";
const SORA = `${SORA_FAMILY}, sans-serif`; const INTER = `${INTER_FAMILY}, sans-serif`; const MONO = `"${JBM}", ui-monospace, Menlo, monospace`;
export const GL_DEBUG = false;
const travel = Easing.bezier(0.45, 0, 0.35, 1); const arrive = Easing.bezier(0.22, 1, 0.36, 1);
const tv = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { easing: travel, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const ar = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { easing: arrive, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const lin = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

// ---- timeline -----------------------------------------------------------------------------------
const TA = 16; const na = (t: number) => TA + Math.round(t * S);
const CALL_LEN = Math.round(19.04 * S); const T_CALL = na(T.endA) + 24; const T_CALL_END = T_CALL + CALL_LEN + 24;
const TB = T_CALL_END; const nb = (t: number) => TB + Math.round(t * S);
export const GL_FILM_FRAMES = nb(TBW.endB) + 160;

// ---- instruments ----------------------------------------------------------------------------------
const Dots: React.FC = () => <AbsoluteFill style={{ backgroundImage: `radial-gradient(${BORDER} 1px, transparent 1px)`, backgroundSize: "28px 28px", opacity: 0.45, WebkitMaskImage: "radial-gradient(110% 100% at 50% 40%, #000 40%, transparent 100%)", maskImage: "radial-gradient(110% 100% at 50% 40%, #000 40%, transparent 100%)" }} />;
// discrete sound bars: measured level × deterministic spatial variation; grey with a blue active region
const Bars: React.FC<{ level: number; n?: number; w?: number; h?: number; active?: boolean; from?: number; to?: number }> = ({ level, n = 72, w = 3, h = 36, active = true, from = 0.38, to = 0.62 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 4, height: h }}>{Array.from({ length: n }, (_, i) => { const x = i / n; const v = 0.35 + 0.65 * Math.abs(Math.sin(i * 1.7) * 0.55 + Math.sin(i * 0.41) * 0.45); const bh = Math.max(2, Math.round(h * (0.12 + 0.88 * level * v))); const hot = active && x >= from && x <= to; return <span key={i} style={{ width: w, height: bh, borderRadius: 1, background: hot ? BLUE : BORDER }} />; })}</div>
);
// a phrase arriving through a mask, word by word
const Mask: React.FC<{ at: number; words: string[]; size: number; weight?: number; color?: string; accent?: number[]; stagger?: number; dur?: number; ls?: number }> = ({ at, words, size, weight = 500, color = FG, accent = [], stagger = 4, dur = 13, ls = -0.03 }) => { const f = useCurrentFrame(); return (
  <div style={{ display: "flex", gap: size * 0.26, fontFamily: SORA, fontWeight: weight, fontSize: size, letterSpacing: size * ls, lineHeight: 1.05, color }}>{words.map((w, i) => { const p = ar(f, at + i * stagger, at + i * stagger + dur); return <span key={i} style={{ display: "inline-block", overflow: "hidden", lineHeight: 1.15 }}><span style={{ display: "inline-block", transform: `translateY(${(1 - p) * 110}%)`, color: accent.includes(i) ? BLUE : color }}>{w}</span></span>; })}</div>); };
const Label: React.FC<{ children: React.ReactNode; color?: string; size?: number }> = ({ children, color = MUTED, size = 13 }) => <span style={{ fontFamily: MONO, fontSize: size, letterSpacing: size * 0.18, textTransform: "uppercase", color, whiteSpace: "nowrap" }}>{children}</span>;
const Rule: React.FC<{ w: number; p: number; color?: string }> = ({ w, p, color = BORDER2 }) => <div style={{ width: Math.round(w * p), height: 1, background: color }} />;
const PhoneGlyph: React.FC<{ size: number; color?: string; ring?: boolean }> = ({ size, color = FG, ring = true }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />{ring ? <><path d="M14.05 6A5 5 0 0 1 18 10" /><path d="M14.05 2a9 9 0 0 1 8 7.94" /></> : null}</svg>;

// ---- the three plates (one shared perspective rig) ----------------------------------------------
// Pose: the voice film's recipe (X 55 / Y -10 / Z -5, 140 px depth intervals), plates 850×430.
const PLATES: [string, string, React.ReactNode][] = [["01", "Phone number", <span style={{ fontFamily: MONO, fontSize: 30, color: FG }}>{GL_NUMBER}</span>], ["02", "SIP trunk", <Label size={14} color={FG}>sip · tls · srtp</Label>], ["03", "Webhook", <Label size={14} color={FG}>live.transport.incoming</Label>]];
const Plate: React.FC<{ i: number; p: number; lit: number; trace?: number; children?: React.ReactNode }> = ({ i, p, lit, trace = 0, children }) => (
  <div style={{ position: "absolute", left: 0, top: i * 190, width: 850, height: 430, transform: `translateZ(${-i * 140}px) translateY(${(1 - p) * 80}px)`, opacity: p, transformStyle: "preserve-3d" }}>
    <div style={{ position: "absolute", inset: 0, background: SURF, border: `1px solid ${BORDER}`, boxShadow: `0 1px 0 ${BORDER2}, 0 14px 0 -8px ${BORDER}`, overflow: "hidden" }}>
      {GL_DEBUG ? <><div style={{ position: "absolute", right: 0, top: 211, width: 8, height: 8, background: "#ff0000" }} /><div style={{ position: "absolute", left: 0, top: 0, width: 8, height: 8, background: "#00ff00" }} /><div style={{ position: "absolute", left: 0, bottom: 0, width: 8, height: 8, background: "#0000ff" }} /><div style={{ position: "absolute", left: 0, top: 211, width: 8, height: 8, background: "#ff00ff" }} /><div style={{ position: "absolute", right: 0, top: 0, width: 8, height: 8, background: "#ffff00" }} /><div style={{ position: "absolute", right: 0, bottom: 0, width: 8, height: 8, background: "#00ffff" }} /></> : null}
      <div style={{ position: "absolute", left: 28, top: 22 }}><Label>layer {PLATES[i][0]}</Label></div>
      <div style={{ position: "absolute", left: 28, bottom: 24, display: "flex", gap: 6 }}>{Array.from({ length: 26 }, (_, k) => <span key={k} style={{ width: 4, height: 4, background: BORDER }} />)}</div>
      <div style={{ position: "absolute", right: 28, top: 22, width: 160, height: 1, background: BORDER }} />
      <div style={{ position: "absolute", left: 300, top: 150, width: 250, height: 120, border: `1px solid ${BORDER}`, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 0 ${8 * lit}px rgba(50,61,254,${0.08 * lit})` }}>{children ?? PLATES[i][2]}</div>
      {/* the active trace across the plate */}
      <svg style={{ position: "absolute", left: 0, top: 0 }} width={850} height={430} fill="none"><path d="M 40 300 L 180 300 L 240 210 L 300 210 M 550 210 L 620 210 L 700 120 L 810 120" stroke={BORDER} strokeWidth="2" /><path d="M 40 300 L 180 300 L 240 210 L 300 210 M 550 210 L 620 210 L 700 120 L 810 120" stroke={BLUE} strokeWidth="2.5" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - trace} opacity={trace > 0 ? 1 : 0} /></svg>
    </div>
  </div>
);
const Stack: React.FC<{ rise: number[]; lit: number[]; traces?: number[]; pose: number; scale?: number; x?: number; y?: number; opacity?: number }> = ({ rise, lit, traces = [0, 0, 0], pose, scale = 1, x = 0, y = 0, opacity = 1 }) => (
  <div style={{ position: "absolute", left: 960 + x, top: 540 + y, width: 0, height: 0, perspective: 2200, opacity }}>
    <div style={{ position: "absolute", left: -425, top: -400, width: 850, height: 850, transformStyle: "preserve-3d", transform: `scale(${scale}) rotateX(${55 * pose}deg) rotateY(${-10 * pose}deg) rotateZ(${-5 * pose}deg)` }}>
      {[0, 1, 2].map((i) => <Plate key={i} i={i} p={rise[i]} lit={lit[i]} trace={traces[i]} />)}
    </div>
  </div>
);
// labels sit in one column outside the steep faces, each leader landing on its plate's projected right-edge
// midpoint (measured from a marker render at scale 0.62, relative to the stack origin).
const ANCH = [[227, -91], [259, 37], [294, 174]]; // right-edge midpoints
const ANCH_L = [[-247, 2], [-231, 132], [-214, 270]]; // left-edge midpoints
const StackLabels: React.FC<{ rise: number[]; lit: number[]; x?: number; y?: number }> = ({ rise, lit, x = 0, y = 0 }) => (
  <>{PLATES.map(([n, name], i) => { const ax = 960 + x + ANCH[i][0], ay = 540 + y + ANCH[i][1]; const col = 960 + x + 460; return <div key={n} style={{ position: "absolute", left: ax, top: ay, opacity: rise[i] }}>
    <svg style={{ position: "absolute", left: 0, top: -4 }} width={col - ax} height={8}><line x1="4" y1="4" x2={col - ax} y2="4" stroke={BORDER2} strokeWidth="1" /><circle cx="4" cy="4" r="3" fill="#fff" stroke={BORDER2} /></svg>
    <div style={{ position: "absolute", left: col - ax + 16, top: -30, display: "flex", alignItems: "center", gap: 14, transform: `translateX(${(1 - rise[i]) * -14}px)` }}><span style={{ width: 3, height: 44, background: lit[i] > 0 ? BLUE : BORDER }} /><div style={{ whiteSpace: "nowrap" }}><Label>layer {n}</Label><div style={{ fontFamily: SORA, fontSize: 32, fontWeight: 500, color: FG, letterSpacing: -0.8, lineHeight: 1.1 }}>{name}</div></div></div>
  </div>; })}</>
);

const CallerBox: React.FC<{ x: number; p: number; lit?: number; ring?: boolean; label?: boolean; left?: number; top?: number }> = ({ x, p, lit = 0, ring = true, label = true, left = 160, top = 482 }) => { const ax = 960 + x + ANCH_L[0][0], ay = 540 + ANCH_L[0][1]; return (
  <>
    <div style={{ position: "absolute", left, top, opacity: p }}><div style={{ width: 120, height: 120, border: `1px solid ${BORDER}`, background: SURF, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 1px 0 ${BORDER2}` }}><PhoneGlyph size={56} ring={ring} color={lit > 0 ? BLUE : FG} /></div>{label ? <div style={{ marginTop: 14 }}><Label color={lit > 0 ? BLUE : MUTED}>caller</Label></div> : null}</div>
    {p >= 1 ? <svg style={{ position: "absolute", left: left + 120, top: ay - 4 }} width={ax - left - 120} height={8}><line x1="0" y1="4" x2={ax - left - 120 - 4} y2="4" stroke={BORDER2} strokeWidth="1" /><line x1="0" y1="4" x2={(ax - left - 120 - 4) * lit} y2="4" stroke={BLUE} strokeWidth="2" /><circle cx={ax - left - 120 - 4} cy="4" r="3" fill="#fff" stroke={lit > 0 ? BLUE : BORDER2} /></svg> : null}
  </>); };

// ---- console inside a level plate (camera regions over the real kit screens) ---------------------
const FW = 1180, FH = Math.round(1080 * FW / 1920);
type Rect = { x: number; y: number; w: number; h: number; at: number }; const FULL: Rect = { x: 0, y: 0, w: 1920, h: 1080, at: 0 };
const R = (x: number, y: number, at: number): Rect => ({ x, y, w: 960, h: 540, at });
const fitZ = (r: Rect) => Math.min(FW / r.w, FH / r.h, 1.6);
const camAt = (f: number, rects: Rect[]) => { const list = [FULL, ...rects].filter((r) => r.at <= f); const cur = list[list.length - 1]; const prev = list.length > 1 ? list[list.length - 2] : cur; const k = cur === prev || cur.at === 0 ? 1 : tv(f, cur.at, cur.at + 30); const L = (a: number, b: number) => a + (b - a) * k; const zp = fitZ(prev), zc = fitZ(cur); return { x: L(prev.x, cur.x), y: L(prev.y, cur.y), Z: L(zp, zc), w: L(prev.w * zp, cur.w * zc), h: L(prev.h * zp, cur.h * zc) }; };
const Console: React.FC<{ node: React.ReactNode; rects?: Rect[]; left?: number; top?: number }> = ({ node, rects = [], left = 370, top = 200 }) => { const f = useCurrentFrame(); const c = camAt(f, rects); return (
  <div style={{ position: "absolute", left: left + (FW - c.w) / 2, top: top + (FH - c.h) / 2, width: c.w, height: c.h, overflow: "hidden", background: "#fff", border: `1px solid ${BORDER}`, boxShadow: `0 1px 0 ${BORDER2}, 0 18px 0 -10px ${BORDER}` }}>
    <div style={{ position: "absolute", left: -c.x * c.Z, top: -c.y * c.Z, width: 1920, height: 1080, transform: `scale(${c.Z})`, transformOrigin: "0 0" }}>{node}</div>
  </div>); };
type Shot = { a: number; b: number; node: React.ReactNode; rects?: Rect[] };
const Shots: React.FC<{ shots: Shot[]; start: number }> = ({ shots, start }) => <>{shots.map((s, i) => <Sequence key={i} from={na(s.a) - start} durationInFrames={na(s.b) - na(s.a)} layout="none"><Console node={s.node} rects={s.rects} /></Sequence>)}</>;
const fr = (a: number, b: number) => Math.round((b - a) * S);

// ---- A. spatial type: GPT-Live, the interruption ------------------------------------------------
const AGENT_LINE = "Thanks for calling. I can help you book, reschedule, or cancel. Which would you";
const SceneA: React.FC = () => { const f = useCurrentFrame(); const t = (s: number) => na(s); const lvl = NARR_A[Math.max(0, Math.min(NARR_A.length - 1, f - TA))] ?? 0;
  const settle = tv(f, t(T.gpt + 2.3), t(T.gpt + 3.3)); // the title moves up and shrinks to make room
  const cut = f >= t(T.interrupt); const n = Math.floor(lin(f, t(T.gpt + 2.9), cut ? t(T.interrupt) : t(T.interrupt) + 40) * AGENT_LINE.length); const shown = cut ? AGENT_LINE.slice(0, Math.floor(lin(t(T.interrupt), t(T.gpt + 2.9), t(T.interrupt) + 40) * AGENT_LINE.length)) : AGENT_LINE.slice(0, n);
  const callerIn = f >= t(T.interrupt + 0.12); const stopped = f >= t(T.stops); const out = tv(f, t(T.built - 0.4), t(T.built + 0.2));
  return (
  <AbsoluteFill style={{ opacity: 1 - out }}>
    <div style={{ position: "absolute", left: 160, top: 400 - settle * 250, transform: `scale(${1 - settle * 0.42})`, transformOrigin: "0 0" }}>
      <Mask at={t(T.gpt) - 6} words={["GPT-Live"]} size={150} weight={600} ls={-0.045} />
      <div style={{ marginTop: 26, display: "flex", alignItems: "center", gap: 22, opacity: ar(f, t(T.gpt + 0.9), t(T.gpt + 1.4)) }}><Label>OpenAI · live voice model</Label><Rule w={300} p={ar(f, t(T.gpt + 1.0), t(T.gpt + 1.8))} /></div>
    </div>
    <div style={{ position: "absolute", left: 160, top: 640 - settle * 160, opacity: 1 - settle }}><Bars level={lvl} n={90} h={40} active={f >= t(T.gpt + 0.6)} /></div>
    {/* the conversation as type, not a chat card */}
    {settle > 0.6 ? <div style={{ position: "absolute", left: 160, top: 420, width: 1600 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, opacity: ar(f, t(T.gpt + 2.9), t(T.gpt + 3.3)) }}><span style={{ width: 8, height: 8, borderRadius: 4, background: stopped ? BORDER2 : FG }} /><Label>GPT-Live</Label></div>
      <div style={{ marginTop: 14, fontFamily: SORA, fontSize: 60, fontWeight: 500, letterSpacing: -1.8, lineHeight: 1.18, color: stopped ? MUTED : FG, maxWidth: 1240 }}>{shown}{cut ? <span style={{ color: BORDER2 }}>…</span> : <span style={{ display: "inline-block", width: 3, height: 54, background: FG, marginLeft: 6, verticalAlign: "-6px", opacity: Math.floor(f / 14) % 2 ? 0 : 1 }} />}</div>
      {callerIn ? <div style={{ marginTop: 44, display: "flex", flexDirection: "column", alignItems: "flex-end", opacity: ar(f, t(T.interrupt + 0.12), t(T.interrupt + 0.5)) }}><div style={{ display: "flex", alignItems: "center", gap: 16 }}><Label color={BLUE}>Caller</Label><span style={{ width: 8, height: 8, borderRadius: 4, background: BLUE }} /></div><div style={{ marginTop: 14, fontFamily: SORA, fontSize: 60, fontWeight: 500, letterSpacing: -1.8, lineHeight: 1.18, color: BLUE }}>Reschedule. Tomorrow, same time.</div></div> : null}
      <div style={{ marginTop: 40, display: "flex", alignItems: "center", gap: 22 }}><Bars level={lvl} n={110} h={34} active from={callerIn ? 0.62 : 0.2} to={callerIn ? 0.9 : 0.45} /><Label color={stopped ? BLUE : MUTED}>{stopped ? "listening" : callerIn ? "interrupted" : "speaking"}</Label></div>
    </div> : null}
  </AbsoluteFill>); };

// ---- B. the phone, and what sits between it and the model ---------------------------------------
const SceneB: React.FC = () => { const f = useCurrentFrame(); const t = (s: number) => na(s);
  const inn = ar(f, t(T.built), t(T.built + 0.6)); const noRoute = f >= t(T.but); const rig = f >= t(T.between - 0.2); const rise = [ar(f, t(T.number1), t(T.number1 + 0.6)), ar(f, t(T.trunk1), t(T.trunk1 + 0.6)), ar(f, t(T.webhook1), t(T.webhook1 + 0.6))];
  const plivo = ar(f, t(T.plivo1), t(T.plivo1 + 0.6)); const lit = [plivo, plivo, 0]; const move = tv(f, t(T.between - 0.2), t(T.between + 0.9)); // the phone travels from centre to the stack's port
  const phoneX = 960 - 60 + move * (160 - 900), phoneY = 540 - 60 + move * (482 - 480);
  const end = na(T.part1 - 0.1); const out = tv(f, end - 14, end + 6); const builtOut = tv(f, t(T.between - 0.6), t(T.between - 0.2));
  return (
  <AbsoluteFill style={{ opacity: 1 - out }}>
    {rig ? <><Stack rise={rise} lit={lit} pose={1} scale={0.62} x={-120} y={0} /><StackLabels rise={rise} lit={lit} x={-120} /></> : null}
    {move < 1 ? <div style={{ position: "absolute", left: phoneX, top: phoneY, opacity: inn, transform: `scale(${0.8 + 0.2 * inn})` }}><div style={{ width: 120, height: 120, border: `1px solid ${BORDER}`, background: SURF, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 1px 0 ${BORDER2}` }}><PhoneGlyph size={56} ring={!noRoute || rig} /></div></div> : <CallerBox x={-120} p={1} label={rise[0] >= 1} />}
    {noRoute && !rig ? <div style={{ position: "absolute", left: 1090, top: 599, display: "flex", alignItems: "center", gap: 18, opacity: ar(f, t(T.but), t(T.but + 0.4)) }}><svg width={260} height={2}><line x1="0" y1="1" x2="250" y2="1" stroke={BORDER2} strokeWidth="1.5" strokeDasharray="6 8" /></svg><span style={{ width: 14, height: 14, borderRadius: 7, border: `1.5px solid ${BORDER2}` }} /><Label>no route to the model</Label></div> : null}
    {!rig ? <div style={{ position: "absolute", left: 160, top: 160, opacity: inn * (1 - builtOut) }}><Mask at={t(T.built)} words={["Built", "for", "phone", "calls."]} size={64} /></div> : null}
    {rig ? <div style={{ position: "absolute", left: 160, top: 150 }}><Mask at={t(T.between)} words={["Between", "a", "caller", "and", "the", "model."]} size={54} /><div style={{ marginTop: 14 }}><Rule w={220} p={ar(f, t(T.between + 0.4), t(T.between + 1.0))} /></div></div> : null}
    {plivo > 0 ? <div style={{ position: "absolute", left: 160, top: 760, opacity: plivo, transform: `translateY(${(1 - plivo) * 16}px)` }}><PlivoLogoSvg width={210} color={FG} /><div style={{ marginTop: 14 }}><Label color={BLUE}>handles layers 01 and 02</Label></div></div> : null}
  </AbsoluteFill>); };

// ---- C/D. inside a plate: the console ------------------------------------------------------------
const L0 = T.part1 - 0.1, N0 = T.name - 0.15, U0 = T.plivo2 - 0.1, K0 = T.link - 0.1, D0 = T.every - 0.1;
const STEP1: Shot[] = [
  { a: L0, b: N0, node: <GlListBeat clickAt={fr(L0, T.open + 1.2)} />, rects: [R(0, 100, 0), R(960, 0, fr(L0, T.open + 1.2) - 60)] },
  { a: N0, b: U0, node: <GlPlatformBeat openAt={fr(N0, T.then + 0.3)} hoverAt={fr(N0, T.openai1 - 0.1)} pickAt={fr(N0, T.openai1 + 0.6)} />, rects: [R(960, 60, 0)] },
  { a: U0, b: K0, node: <GlUriBeat modalAt={fr(U0, T.all - 0.3)} projFrom={fr(U0, T.project1 - 0.2)} projUntil={fr(U0, T.project1 + 0.9)} createdAt={fr(U0, T.link - 0.5)} />, rects: [R(960, 60, 0), { x: 600, y: 260, w: 720, h: 405, at: fr(U0, T.all - 0.2) }] },
  { a: K0, b: D0, node: <GlLinkBeat openAt={fr(K0, T.link - 0.2)} pickAt={fr(K0, T.link + 0.6)} createAt={fr(K0, T.create2 + 0.2)} />, rects: [R(960, 520, 0)] },
  { a: D0, b: T.part2 - 0.05, node: <GlDoneBeat />, rects: [R(960, 40, 0), R(240, 100, 60)] },
];
const WebhookScreen: React.FC<{ rowAt: number }> = ({ rowAt }) => { const f = useCurrentFrame(); return <OaiWebhooksPage row={f >= rowAt} />; };
const W0 = T.part2 - 0.05;
const STEP2: Shot[] = [{ a: W0, b: T.part3 - 0.05, node: <WebhookScreen rowAt={fr(W0, T.add + 0.4)} />, rects: [R(560, 120, fr(W0, T.in2))] }];
// the plate flattens and grows as the camera arrives; the console appears inside it
const Inside: React.FC<{ start: number; i: number; shots: Shot[]; title: string[]; kicker: string; side: "left" | "right" }> = ({ start, i, shots, title, kicker, side }) => { const f = useCurrentFrame(); const land = tv(f, 0, 36); const out = tv(f, (shots[shots.length - 1] ? na(shots[shots.length - 1].b) - start : 0) - 20, (shots[shots.length - 1] ? na(shots[shots.length - 1].b) - start : 0)); return (
  <AbsoluteFill style={{ opacity: 1 - out }}>
    {/* the plate, arriving level */}
    <div style={{ position: "absolute", left: 960, top: 540, perspective: 2200 }}><div style={{ position: "absolute", left: -600, top: -360, width: 1200, height: 710, background: SURF, border: `1px solid ${BORDER}`, boxShadow: `0 1px 0 ${BORDER2}, 0 18px 0 -10px ${BORDER}`, transform: `rotateX(${55 * (1 - land)}deg) rotateY(${-10 * (1 - land)}deg) rotateZ(${-5 * (1 - land)}deg) scale(${0.72 + 0.28 * land})`, opacity: land }} /></div>
    <div style={{ opacity: land }}><Shots shots={shots} start={start} /></div>
    <div style={{ position: "absolute", [side]: 160, top: 96, display: "flex", flexDirection: "column", gap: 10, alignItems: side === "left" ? "flex-start" : "flex-end", opacity: ar(f, 20, 40) }}><Label color={BLUE}>{kicker}</Label><Mask at={22} words={title} size={44} /></div>
  </AbsoluteFill>); };

// ---- E. the handshake: pull back to the stack, the call travels through it -------------------------
const SceneE: React.FC = () => { const f = useCurrentFrame() + na(T.part3 - 0.05); const t = (s: number) => na(s); const lf = f - na(T.part3 - 0.05);
  const land = tv(lf, 0, 34); const tr = [tv(f, t(T.acall), t(T.acall + 0.9)), tv(f, t(T.plivo3), t(T.plivo3 + 0.9)), tv(f, t(T.openai3), t(T.openai3 + 0.9))];
  const backend = ar(f, t(T.your3), t(T.your3 + 0.6)); const accept = ar(f, t(T.accept), t(T.accept + 0.5)); const done = f >= t(T.from);
  return (
  <AbsoluteFill style={{ opacity: land }}>
    <Stack rise={[1, 1, 1]} lit={[tr[0], tr[1], tr[2]]} traces={tr} pose={1} scale={0.62} x={-340} y={0} />
    <StackLabels rise={[1, 1, 1]} lit={[tr[0], tr[1], tr[2]]} x={-340} />
    <CallerBox x={-340} p={1} lit={tr[0]} />
    <div style={{ position: "absolute", left: 160, top: 150 }}><Mask at={na(T.part3) - na(T.part3 - 0.05)} words={["The", "handshake."]} size={54} /><div style={{ marginTop: 14 }}><Rule w={220} p={ar(lf, 20, 40)} /></div></div>
    {/* the backend: a dark block to the right, fed by the webhook plate */}
    {backend > 0 ? <svg style={{ position: "absolute", left: 1300, top: 540 + ANCH[2][1] - 4, opacity: backend }} width={120} height={8}><circle cx="4" cy="4" r="3" fill="#fff" stroke={BLUE} /><line x1="8" y1="4" x2={120 * backend} y2="4" stroke={BLUE} strokeWidth="2" /></svg> : null}
    {backend > 0 ? <div style={{ position: "absolute", left: 1420, top: 540 + ANCH[2][1] - 128, width: 340, opacity: backend, transform: `translateX(${(1 - backend) * 24}px)` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}><Label color={BLUE}>your backend</Label><Rule w={140} p={backend} color={BLUE} /></div>
      <div style={{ background: CODE_BG, color: CODE_FG, fontFamily: MONO, fontSize: 16, lineHeight: 1.7, padding: "20px 22px", border: `1px solid ${BORDER2}` }}>
        <div style={{ color: CODE_MUTED }}>← live.transport.incoming</div>
        <div style={{ opacity: accept }}><span style={{ color: CODE_MUTED }}>POST</span> /v1/live/sessions/…/accept</div>
        <div style={{ paddingLeft: 24, opacity: f >= t(T.model) ? 1 : 0.25 }}>"model": <span style={{ color: BLUE }}>"gpt-live-1"</span>,</div>
        <div style={{ paddingLeft: 24, opacity: f >= t(T.voice) ? 1 : 0.25 }}>"voice": <span style={{ color: BLUE }}>"marin"</span>,</div>
        <div style={{ paddingLeft: 24, opacity: f >= t(T.instructions) ? 1 : 0.25 }}>"instructions": <span style={{ color: BLUE }}>"You are the receptionist…"</span></div>
      </div>
    </div> : null}
    {done ? <div style={{ position: "absolute", left: 160, top: 990, display: "flex", alignItems: "center", gap: 18, opacity: ar(f, t(T.from), t(T.from + 0.4)) }}><span style={{ width: 8, height: 8, borderRadius: 4, background: BLUE }} /><Label color={FG}>connected · the caller is talking to GPT-Live</Label></div> : null}
  </AbsoluteFill>); };

// ---- F. the call: dialogue as type, bars from the recording (PLACEHOLDER audio) --------------------
const LINES: [number, number, "AGENT" | "YOU", string][] = [
  [0.0, 3.06, "AGENT", "Hi, thanks for calling. What can I help you with today?"],
  [3.96, 10.56, "YOU", "Hi, I'm building a voice agent and I want to put it on a real phone number. And I was wondering if Plivo supports SIP trunking for that?"],
  [11.62, 18.66, "AGENT", "I'll check that for you. Yes, so you can connect your voice agent to the public phone network for inbound and outbound calls."],
];
const SceneF: React.FC = () => { const f = useCurrentFrame(); const t = f / S; const cur = LINES.findIndex(([a, b]) => t >= a && t < b + 0.3); const lvl = GL_CALL_CUT_ENV[Math.min(f, CALL_LEN - 1)] ?? 0; const inn = ar(f, 0, 14); const secs = Math.floor(Math.max(0, t));
  return (
  <AbsoluteFill style={{ opacity: inn }}>
    <div style={{ position: "absolute", left: 160, top: 110, display: "flex", alignItems: "center", gap: 18 }}><span style={{ width: 8, height: 8, borderRadius: 4, background: BLUE }} /><Label color={FG}>live · {GL_NUMBER} · 00:{String(secs).padStart(2, "0")}</Label></div>
    <div style={{ position: "absolute", left: 160, right: 160, top: 220, display: "flex", flexDirection: "column", gap: 44 }}>
      {LINES.map(([a, b, w, txt], i) => { if (t < a - 0.1) return null; const on = i === cur; const n = Math.floor(Math.max(0, Math.min(1, (t - a) / (b - a))) * txt.length); const me = w === "YOU"; return (
        <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: me ? "flex-end" : "flex-start", opacity: i < cur ? 0.45 : 1 }}>
          <Label color={me ? BLUE : MUTED}>{me ? "caller" : "GPT-Live"}</Label>
          <div style={{ marginTop: 10, fontFamily: SORA, fontSize: 42, fontWeight: 500, letterSpacing: -1.2, lineHeight: 1.2, color: me ? BLUE : FG, maxWidth: 1200, textAlign: me ? "right" : "left" }}>{txt.slice(0, n)}{on && n < txt.length ? <span style={{ display: "inline-block", width: 3, height: 40, background: me ? BLUE : FG, marginLeft: 6, verticalAlign: "-4px" }} /> : null}</div>
        </div>); })}
    </div>
    <div style={{ position: "absolute", left: 160, bottom: 120 }}><Bars level={lvl} n={120} h={44} active from={cur >= 0 && LINES[cur][2] === "YOU" ? 0.6 : 0.2} to={cur >= 0 && LINES[cur][2] === "YOU" ? 0.9 : 0.5} /></div>
    <div style={{ position: "absolute", right: 160, bottom: 130 }}><Label>real call · recorded on plivo</Label></div>
    <Audio src={staticFile("vo/gptlive2/real-call-2-cut.mp3")} trimAfter={CALL_LEN} volume={(fr2) => 1.15 * Math.min(1, (CALL_LEN - fr2) / 12)} />
  </AbsoluteFill>); };

// ---- G. close -------------------------------------------------------------------------------------
const SceneG: React.FC = () => { const f = useCurrentFrame(); const t = (s: number) => nb(s) - TB; const lvl = NARR_B[Math.max(0, Math.min(NARR_B.length - 1, f))] ?? 0; const logo = ar(f, t(TBW.thats), t(TBW.thats + 0.6));
  return (
  <AbsoluteFill>
    <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center", opacity: logo, transform: `translateY(${(1 - logo) * 18}px)` }}><PlivoLogoSvg width={420} color={FG} /></div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 480, display: "flex", justifyContent: "center" }}><Mask at={t(TBW.real)} words={["GPT-Live,", "on", "a", "real", "phone", "line."]} size={44} weight={400} color={MUTED} /></div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 580, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}><Mask at={t(TBW.built)} words={["OpenAI", "built", "the", "model."]} size={60} /><Mask at={t(TBW.brings)} words={["Plivo", "brings", "the", "calls."]} size={60} accent={[0]} /></div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 800, display: "flex", justifyContent: "center" }}><Bars level={lvl} n={110} h={30} active={f < nb(TBW.endB) - TB + 10} /></div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 880, display: "flex", justifyContent: "center", opacity: ar(f, t(TBW.endB), t(TBW.endB + 0.5)) }}><Label color={FG}>start building · plivo.com</Label></div>
  </AbsoluteFill>); };

// ---- music bed: audible under speech, resolves after the last line ---------------------------------
// gl-music.mp3: generated with ElevenLabs Music (132 s, -14.4 LUFS, instrumental, drums enter at ~18 s). Narration is
// -17.9 LUFS, so 0.19 puts the bed ~11 LU under the voice. Aligned so the track's own ending lands on the film's last frame.
const MUSIC_SRC = "gl-music.mp3"; const MUSIC = 0.19; const MUSIC_LEN = Math.round(132 * S); const MUSIC_FROM = MUSIC_LEN - GL_FILM_FRAMES;
const musicVol = (f: number) => { const inn = Math.min(1, f / 30); const out = Math.min(1, Math.max(0, (GL_FILM_FRAMES - f) / 12)); const duck = f >= T_CALL && f < T_CALL_END ? 0.6 : 1; return MUSIC * inn * out * duck; };

export const GlFilm: React.FC = () => (
  <AbsoluteFill style={{ background: BG, fontFamily: INTER, color: FG }}>
    <Dots />
    <Audio src={staticFile(MUSIC_SRC)} startFrom={MUSIC_FROM} volume={musicVol} />
    <Sequence from={TA} layout="none"><Audio src={staticFile("vo/gl2/news-a.mp3")} /></Sequence>
    <Sequence from={TB} layout="none"><Audio src={staticFile("vo/gl2/news-b.mp3")} /></Sequence>
    <Sequence from={0} durationInFrames={na(T.built + 0.2)} layout="none"><SceneA /></Sequence>
    <Sequence from={na(T.built)} durationInFrames={na(T.part1 - 0.1) - na(T.built) + 6} layout="none"><Sequence from={-na(T.built)} layout="none"><SceneB /></Sequence></Sequence>
    <Sequence from={na(T.part1 - 0.1)} durationInFrames={na(T.part2 - 0.05) - na(T.part1 - 0.1)} layout="none"><Inside start={na(T.part1 - 0.1)} i={1} shots={STEP1} kicker="part one · plivo" title={["The", "trunk."]} side="left" /></Sequence>
    <Sequence from={na(T.part2 - 0.05)} durationInFrames={na(T.part3 - 0.05) - na(T.part2 - 0.05)} layout="none"><Inside start={na(T.part2 - 0.05)} i={2} shots={STEP2} kicker="part two · openai" title={["The", "webhook."]} side="right" /></Sequence>
    <Sequence from={na(T.part3 - 0.05)} durationInFrames={T_CALL - na(T.part3 - 0.05)} layout="none"><SceneE /></Sequence>
    <Sequence from={T_CALL} durationInFrames={T_CALL_END - T_CALL} layout="none"><SceneF /></Sequence>
    <Sequence from={TB} durationInFrames={GL_FILM_FRAMES - TB} layout="none"><SceneG /></Sequence>
  </AbsoluteFill>
);
