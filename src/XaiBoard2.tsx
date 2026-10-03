import React from "react";
import { AbsoluteFill, Audio, Freeze, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { PlivoLogoSvg } from "./PlivoLogoSvg";
import { MONO, SORA, INTER } from "./StyleFrames";
import { REAL_CALL_ENV } from "./xaiRealCallEnv";
import { Board, Fly, NodeState, NODES, BG, INK, DIM, P, GREEN, ease, pop } from "./XaiBoard";
import { PlListBeat, PlPlatformBeat, PlNameBeat, PlUriBeat, PlLinkBeat, PlDoneBeat, XaAgentBeat, XaDeploymentBeat, XaNumberModalBeat } from "./cards/XaiBeats";

// ============================================================================
// XaiBoard2 — same board language, rebuilt against the final feedback:
//  * ONE continuous narration take per half (no sentence slicing, no gaps); every shot is pinned to a word
//  * footage is cleaned in place: the OpenAI trunk, the second Plivo number and xAI's provisioned number are masked out
//  * the mistaken open/close at the start of the xAI recording is skipped; typing runs fast, cursor moves stay 1x
//  * the real call is a marked hold until the recording arrives
// ============================================================================
const FILE = "xai-demo.mp4"; const CROP_TOP = 140, CROP_BOTTOM = 90; const SCALE = 1920 / 1728; const VIS_H = Math.round((1080 - CROP_TOP - CROP_BOTTOM) * SCALE); const TOP = Math.round((1080 - VIS_H) / 2);
const S = 30; const sx = (x: number) => x * SCALE; const sy = (y: number) => (y - CROP_TOP) * SCALE + TOP; // source px -> output px

// ---- masks & rings live in SOURCE pixels (1728x1080) --------------------------------------
type Mask = { x: number; y: number; w: number; h: number; c: string; text?: string; tc?: string; win?: [number, number] /* source seconds */; patch?: number /* copy the same frame from this many source px BELOW the rect (matches any dim state) */ };
type Ring = { at: number /* frame in shot */; x: number; y: number };
const WHITE = "#fdfdfd", DIM1 = "DIM1", DIM2 = "DIM2", DIM3 = "DIM3", XBG = "XBG";
// measured in the ENCODED output: PNG hold stills come out one shade darker than the decoded video, so tokens resolve per source
const TOK: Record<string, [string, string]> = { XBG: ["#060606", "#000000"], DIM1: ["#4a4a4a", "#404040"], DIM2: ["#141414", "#070707"], DIM3: ["#484848", "#3e3e3e"] }; // [video, still]
const col = (c: string, still: boolean) => (TOK[c] ? TOK[c][still ? 1 : 0] : c);
const M = {
  plRowNoDrawer: { x: 316, y: 466, w: 1384, h: 76, c: WHITE, patch: 76 } as Mask, // OpenAI trunk row: covered with the blank strip below it
  plRowDrawer: { x: 316, y: 466, w: 734, h: 76, c: DIM1, patch: 76 } as Mask,     // same, page dimmed by the drawer (patch carries the dim)
  plRowModal: { x: 316, y: 466, w: 278, h: 76, c: DIM2, patch: 76 } as Mask,      // same, left of the URI modal
  plUriPlaceholder: { x: 1097, y: 566, w: 220, h: 28, c: WHITE, text: "Select Primary URI", tc: "#8f8f8f" } as Mask,
  plUriModal: { x: 1130, y: 566, w: 190, h: 28, c: DIM3 } as Mask,
  plUriXai: { x: 1097, y: 566, w: 220, h: 28, c: WHITE, text: "xAI", tc: "#1b1b1b" } as Mask,
  plNum806: { x: 1080, y: 845, w: 600, h: 43, c: WHITE, win: [293.4, 295.5] } as Mask,
  plList2: { x: 316, y: 541, w: 1384, h: 72, c: WHITE } as Mask,                 // OpenAI row in the final list
  plListUri: { x: 598, y: 479, w: 130, h: 28, c: WHITE, text: "xAI", tc: "#1b1b1b" } as Mask,
  xDepRow258: { x: 413, y: 556, w: 1247, h: 66, c: XBG } as Mask,
  xModalL1: { x: 413, y: 512, w: 96, h: 74, c: XBG } as Mask, xModalR1: { x: 1222, y: 512, w: 440, h: 74, c: XBG } as Mask,
  xModalL2: { x: 413, y: 638, w: 96, h: 70, c: XBG } as Mask, xModalR2: { x: 1222, y: 638, w: 440, h: 70, c: XBG } as Mask,
  xResBanner: { x: 413, y: 512, w: 1247, h: 74, c: XBG } as Mask, xResRow2: { x: 413, y: 706, w: 1247, h: 64, c: XBG } as Mask,
};

const FreezeIf: React.FC<{ on: boolean; frame: number; children?: React.ReactNode }> = ({ on, frame, children }) => on ? <Freeze frame={frame}>{children}</Freeze> : <>{children}</>;
// ---- a shot: the recording (or a hold still), masks, rings, caption ----------------------------
type Shot = { node?: React.ReactNode; src?: number; still?: string; rate?: number; cont?: boolean; hold?: number /* freeze the footage after this many frames (narration runs long) */; masks?: Mask[]; rings?: Ring[]; n: string; badge: string; kicker: string; cap: React.ReactNode; dark?: boolean };
const Footage: React.FC<Shot & { len: number }> = ({ node, src, still, rate = 1, masks = [], rings = [], n, badge, kicker, cap, dark, len, cont, hold }) => {
  const f = useCurrentFrame();
  if (node) return <KitShot node={node} n={n} badge={badge} kicker={kicker} cap={cap} cont={cont} rings={rings} />; const fv = hold !== undefined ? Math.min(f, hold - 1) : f; const srcSec = src !== undefined ? src + (fv / S) * rate : -1;
  return (
    <AbsoluteFill style={{ background: BG, fontFamily: SORA }}>
      <div style={{ position: "absolute", top: TOP, left: 0, width: 1920, height: VIS_H, overflow: "hidden", background: dark ? XBG : WHITE }}>
        <FreezeIf on={hold !== undefined && f >= hold} frame={hold !== undefined ? hold - 1 : 0}>
        {still ? <Img src={staticFile(`xai-stills/${still}.png`)} style={{ width: 1920, height: Math.round(1080 * SCALE), marginTop: -Math.round(CROP_TOP * SCALE), display: "block" }} />
          : <OffthreadVideo src={staticFile(FILE)} trimBefore={Math.round((src as number) * S)} trimAfter={Math.round((src as number) * S) + Math.ceil(len * rate * S) + 2} playbackRate={rate} muted style={{ width: 1920, height: Math.round(1080 * SCALE), marginTop: -Math.round(CROP_TOP * SCALE), display: "block" }} />}
        {masks.map((m, i) => { if (m.win && (srcSec < m.win[0] || srcSec > m.win[1])) return null; const X = sx(m.x), Y = sy(m.y) - TOP, Wd = m.w * SCALE, Ht = m.h * SCALE; if (m.patch) { const media = { position: "absolute" as const, left: -X, top: -Y - m.patch * SCALE - Math.round(CROP_TOP * SCALE), width: 1920, height: Math.round(1080 * SCALE), display: "block" as const }; return <div key={i} style={{ position: "absolute", left: X, top: Y, width: Wd, height: Ht, overflow: "hidden" }}>{still ? <Img src={staticFile(`xai-stills/${still}.png`)} style={media} /> : <OffthreadVideo src={staticFile(FILE)} trimBefore={Math.round((src as number) * S)} trimAfter={Math.round((src as number) * S) + Math.ceil(len * rate * S) + 2} playbackRate={rate} muted style={media} />}</div>; } return <div key={i} style={{ position: "absolute", left: X, top: Y, width: Wd, height: Ht, background: col(m.c, !!still), fontFamily: INTER, fontSize: 19 * SCALE, color: m.tc, display: "flex", alignItems: "center", paddingLeft: 6 }}>{m.text}</div>; })}
        </FreezeIf>
      </div>
      {rings.map((r, i) => { const t = f - r.at; if (t < -6 || t > 40) return null; const rad = 18 + Math.max(0, t) * 3.2; const x = sx(r.x), y = sy(r.y); return <React.Fragment key={i}><div style={{ position: "absolute", left: x - rad, top: y - rad, width: rad * 2, height: rad * 2, borderRadius: "50%", border: `3px solid ${P}`, opacity: Math.max(0, 1 - Math.max(0, t) / 40), pointerEvents: "none" }} /><div style={{ position: "absolute", left: x - 8, top: y - 8, width: 16, height: 16, borderRadius: 8, background: P, boxShadow: "0 0 0 6px rgba(205,62,249,0.35)", opacity: ease(f, r.at - 6, r.at) * (1 - Math.max(0, t - 26) / 14) }} /></React.Fragment>; })}
      <div style={{ position: "absolute", top: 40, left: 60, display: "flex", alignItems: "center", gap: 14, background: "rgba(10,12,18,0.88)", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 999, padding: "10px 18px 10px 12px" }}><span style={{ fontFamily: MONO, fontSize: 13, background: P, color: "#fff", padding: "6px 10px", borderRadius: 999 }}>{n}</span><span style={{ fontSize: 20, fontWeight: 600, color: "#fff" }}>{badge}</span>{rate > 1 ? <span style={{ fontFamily: MONO, fontSize: 13, color: DIM }}>· typing {rate}×</span> : null}</div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "70px 72px 44px", background: "linear-gradient(180deg, rgba(10,12,18,0) 0%, rgba(10,12,18,0.94) 55%)" }}><div style={{ fontFamily: MONO, fontSize: 14, letterSpacing: 3, color: P, ...(cont ? {} : pop(f, 0)) }}>{kicker}</div><div style={{ marginTop: 8, fontSize: 40, fontWeight: 600, color: "#fff", letterSpacing: -1.2, lineHeight: 1.15, ...(cont ? {} : pop(f, 2)) }}>{cap}</div></div>
    </AbsoluteFill>
  );
};


// ---- a recreated screen, full frame: centred badge on top, centred caption below ------------
const KitShot: React.FC<{ node: React.ReactNode; n: string; badge: string; kicker: string; cap: React.ReactNode; cont?: boolean; rings?: Ring[] }> = ({ node, n, badge, kicker, cap, cont, rings = [] }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: BG, fontFamily: SORA }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>{node}</div>
      {rings.map((r, i) => { const t = f - r.at; if (t < -6 || t > 40) return null; const rad = 18 + Math.max(0, t) * 3.2; return <React.Fragment key={i}><div style={{ position: "absolute", left: r.x - rad, top: r.y - rad, width: rad * 2, height: rad * 2, borderRadius: "50%", border: `3px solid ${P}`, opacity: Math.max(0, 1 - Math.max(0, t) / 40), pointerEvents: "none" }} /><div style={{ position: "absolute", left: r.x - 8, top: r.y - 8, width: 16, height: 16, borderRadius: 8, background: P, boxShadow: "0 0 0 6px rgba(205,62,249,0.35)", opacity: ease(f, r.at - 6, r.at) * (1 - Math.max(0, t - 26) / 14) }} /></React.Fragment>; })}
      <div style={{ position: "absolute", top: 28, left: 0, right: 0, display: "flex", justifyContent: "center" }}><div style={{ display: "flex", alignItems: "center", gap: 14, background: "rgba(10,12,18,0.88)", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 999, padding: "10px 18px 10px 12px" }}><span style={{ fontFamily: MONO, fontSize: 13, background: P, color: "#fff", padding: "6px 10px", borderRadius: 999 }}>{n}</span><span style={{ fontSize: 20, fontWeight: 600, color: "#fff" }}>{badge}</span></div></div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "80px 160px 40px", textAlign: "center", background: "linear-gradient(180deg, rgba(10,12,18,0) 0%, rgba(10,12,18,0.94) 60%)" }}><div style={{ fontFamily: MONO, fontSize: 14, letterSpacing: 3, color: P, ...(cont ? {} : pop(f, 0)) }}>{kicker}</div><div style={{ marginTop: 8, fontSize: 40, fontWeight: 600, color: "#fff", letterSpacing: -1.2, lineHeight: 1.15, ...(cont ? {} : pop(f, 2)) }}>{cap}</div></div>
    </AbsoluteFill>
  );
};

// ---- the real call: Plivo number -> xAI, recorded on Plivo (public/vo/xai2/real-call-2.mp3) --------------
const CALL_TRIM_END = 9.05; const CALL_LEN = Math.round(CALL_TRIM_END * S);
const LINES: [number, number, "AGENT" | "YOU", string][] = [
  [0.0, 1.9, "AGENT", "Hi, thanks for calling Athena Pottery! How can I help you today?"],
  [3.24, 6.1, "YOU", "Hi there, yes. I'd like to book an appointment for a custom order."],
  [6.92, 8.75, "AGENT", "I'd be happy to help you set that up."],
];
const RealCall: React.FC = () => {
  const f = useCurrentFrame(); const t = f / S; const secs = Math.floor(t);
  const cur = LINES.findIndex(([a, b]) => t >= a && t < b + 0.3); const lvl = REAL_CALL_ENV[f] ?? 0;
  return (
    <Board states={{ caller: "on", plivo: "on", xai: "on", agent: "active" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, background: BG }} />
      <div style={{ position: "absolute", top: 48, left: 72, display: "flex", alignItems: "center", gap: 16 }}><PlivoLogoSvg width={100} color={INK} /><span style={{ fontFamily: MONO, fontSize: 14, letterSpacing: 3, color: DIM }}>× XAI VOICE AGENTS</span></div>
      <div style={{ position: "absolute", left: 72, top: 150, display: "flex", alignItems: "center", gap: 18 }}><span style={{ width: 14, height: 14, borderRadius: 7, background: GREEN, boxShadow: "0 0 0 8px rgba(61,220,132,0.2)" }} /><span style={{ fontFamily: MONO, fontSize: 16, letterSpacing: 3, color: INK }}>LIVE · +1 701 719 8695 → ATHENA POTTERY SUPPORT · 00:{String(secs).padStart(2, "0")}</span><span style={{ marginLeft: 20, fontFamily: MONO, fontSize: 12, letterSpacing: 2, color: GREEN, border: "1px solid rgba(61,220,132,0.5)", padding: "5px 10px", borderRadius: 999 }}>REAL CALL · RECORDED ON PLIVO</span></div>
      <div style={{ position: "absolute", left: 72, top: 230, width: 1180, display: "flex", flexDirection: "column", gap: 22 }}>
        {LINES.map(([a, b, w, txt], i) => { if (t < a - 0.1) return null; const on = i === cur; const n = Math.floor(Math.max(0, (t - a) / (b - a)) * txt.length); return (
          <div key={i} style={{ display: "flex", gap: 22, alignItems: "flex-start", opacity: i < cur ? (w === "YOU" ? 0.55 : 0.8) : 1 }}>
            <span style={{ fontFamily: MONO, fontSize: 13, letterSpacing: 2, color: w === "YOU" ? GREEN : P, width: 70, paddingTop: 12 }}>{w}</span>
            <div style={{ fontSize: w === "YOU" ? 30 : 34, fontWeight: w === "YOU" ? 500 : 600, color: w === "YOU" ? DIM : "#fff", lineHeight: 1.3, maxWidth: 1060 }}>{txt.slice(0, n)}{on && n < txt.length ? <span style={{ opacity: Math.round(f / 6) % 2 }}>▍</span> : null}</div>
          </div>); })}
        <div style={{ display: "flex", gap: 22, alignItems: "center", height: 40 }}><span style={{ fontFamily: MONO, fontSize: 13, letterSpacing: 2, color: cur >= 0 ? (LINES[cur][2] === "YOU" ? GREEN : P) : DIM, width: 70 }}>{cur >= 0 ? LINES[cur][2] : "···"}</span><div style={{ display: "flex", gap: 5, alignItems: "center", height: 40 }}>{Array.from({ length: 28 }, (_, i) => <span key={i} style={{ width: 6, height: 6 + 34 * lvl * (0.4 + 0.6 * Math.abs(Math.sin(i * 0.8 + f * 0.3))), borderRadius: 3, background: cur >= 0 && LINES[cur][2] === "YOU" ? GREEN : P }} />)}</div></div>
      </div>
      <div style={{ position: "absolute", right: 72, top: 230, width: 500, borderRadius: 24, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)", padding: "26px 28px" }}>
        <div style={{ fontFamily: MONO, fontSize: 13, letterSpacing: 3, color: DIM }}>THE PATH</div>
        {[["Caller", "dials the Plivo number"], ["Plivo", "inbound trunk → sip.voice.x.ai"], ["xAI", "Athena Pottery Support answers"]].map(([a, b], i) => <div key={a} style={{ marginTop: 16, display: "flex", gap: 14, alignItems: "baseline", opacity: f >= 10 + i * 12 ? 1 : 0.3 }}><span style={{ fontFamily: MONO, fontSize: 13, color: GREEN, width: 64 }}>{a}</span><span style={{ fontFamily: INTER, fontSize: 20, color: "#fff" }}>{b}</span></div>)}
      </div>
      <Audio src={staticFile("vo/xai2/real-call-3-tight.mp3")} trimAfter={CALL_LEN} volume={(fr) => 1.15 * Math.min(1, (CALL_LEN - fr) / 12)} />
    </Board>
  );
};


// ---- purple opener: xAI mark, Plivo logo, what you need ------------------------------------------
const XaiMark: React.FC<{ width: number; color?: string }> = ({ width, color = "#fff" }) => (
  // official xAI mark (Wikimedia Commons, XAI-Logo.svg), four polygons
  <svg width={width} viewBox="0 0 466.04 516.93" style={{ display: "block" }} fill={color}>
    <polygon points="0.12 182.71 234.14 516.92 338.15 516.92 104.13 182.71 0.12 182.71" /><polygon points="0 516.92 104.08 516.92 156.08 442.67 104.04 368.34 0 516.92" /><polygon points="466.04 0 361.96 0 182.1 256.86 234.15 331.18 466.04 0" /><polygon points="380.78 516.92 466.04 516.92 466.04 37.16 380.78 158.92 380.78 516.92" />
  </svg>
);
const OPEN_BG = "linear-gradient(105deg, #cd3ef9 0%, #7a3efc 32%, #323dfe 100%)"; // official Plivo gradient (plivo.com/brand: #cd3ef9 → #323dfe), blue-dominant
const slide = (f: number, at: number, from = 40) => ({ opacity: ease(f, at, at + 14), transform: `translateY(${(1 - ease(f, at, at + 18)) * from}px)` });
const Card: React.FC<{ at: number; k: string; t: string; s: string }> = ({ at, k, t, s }) => { const f = useCurrentFrame(); if (f < at) return null; return <div style={{ width: 520, borderRadius: 26, background: "#fff", color: "#1a0a22", padding: "30px 34px", textAlign: "center", ...pop(f, at) }}><div style={{ fontFamily: MONO, fontSize: 13, letterSpacing: 3, color: "#2d3fa6" }}>{k}</div><div style={{ marginTop: 10, fontSize: 40, fontWeight: 600, letterSpacing: -1.2, lineHeight: 1.1 }}>{t}</div><div style={{ marginTop: 8, fontFamily: INTER, fontSize: 22, color: "rgba(26,10,34,0.6)" }}>{s}</div></div>; };
const Opener2: React.FC = () => {
  const f = useCurrentFrame(); const t1 = na(3.18), t2 = na(7.65);
  const logos = f < t1 ? 0 : 1; // 0: xAI alone, 1: xAI + Plivo
  const center: React.CSSProperties = { position: "absolute", left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" };
  return (
    <AbsoluteFill style={{ background: OPEN_BG, fontFamily: SORA, color: "#fff", overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "radial-gradient(70% 60% at 30% 20%, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 70%)" }} />
      {f < t2 ? <>
        <div style={{ ...center, top: 250 }}><div style={{ display: "flex", alignItems: "center", gap: 44 }}>
          <div style={{ ...pop(f, 4) }}><XaiMark width={200} /></div>
          {logos ? <div style={{ display: "flex", alignItems: "center", gap: 44, ...slide(f, t1, 0) }}><span style={{ fontSize: 120, fontWeight: 300, lineHeight: 1, marginTop: -10 }}>+</span><div style={{ transform: "translateY(6px)" }}><PlivoLogoSvg width={330} color="#fff" /></div></div> : null}
        </div></div>
        <div style={{ ...center, top: 540 }}>
          {logos === 0 ? <div style={{ fontSize: 112, fontWeight: 600, letterSpacing: -4, lineHeight: 1.0, ...slide(f, na(0.93)) }}>Grok released<br />Voice Agents.</div>
            : <div style={{ fontSize: 100, fontWeight: 600, letterSpacing: -3.6, lineHeight: 1.02, ...slide(f, t1 + 4) }}>Let's put one on a<br />real phone number.</div>}
        </div>
      </> : <>
        <div style={{ ...center, top: 110 }}><div style={{ display: "flex", alignItems: "center", gap: 28, ...slide(f, t2, 20) }}><XaiMark width={100} /><span style={{ fontSize: 44, fontWeight: 300 }}>+</span><PlivoLogoSvg width={130} color="#fff" /></div></div>
        <div style={{ ...center, top: 300, fontSize: 96, fontWeight: 600, letterSpacing: -3.4, lineHeight: 1.0, ...slide(f, t2 + 6) }}>What you need.</div>
        <div style={{ ...center, top: 520 }}><div style={{ display: "flex", gap: 40 }}><Card at={na(9.64)} k="01 · XAI" t="An xAI account" s="with Voice Agents" /><Card at={na(12.32)} k="02 · PLIVO" t="A Plivo account" s="with a phone number" /></div></div>
      </>}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 70, textAlign: "center", fontFamily: MONO, fontSize: 14, letterSpacing: 3, opacity: 0.8 }}>PLIVO × XAI VOICE AGENTS</div>
    </AbsoluteFill>
  );
};
const WipeIn: React.FC = () => { const f = useCurrentFrame(); return <AbsoluteFill style={{ background: OPEN_BG, transform: `translateY(${(1 - ease(f, 0, FLY)) * 1080}px)` }} />; };
const Wipe: React.FC = () => { const f = useCurrentFrame(); return <AbsoluteFill style={{ background: OPEN_BG, transform: `translateY(${-ease(f, 0, FLY) * 1080}px)` }} />; };
const Closer2: React.FC = () => {
  const f = useCurrentFrame(); const center: React.CSSProperties = { position: "absolute", left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" };
  return (
    <AbsoluteFill style={{ background: OPEN_BG, fontFamily: SORA, color: "#fff", overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "radial-gradient(70% 60% at 30% 20%, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 70%)" }} />
      <div style={{ ...center, top: 200 }}><div style={{ display: "flex", alignItems: "center", gap: 40, ...pop(f, 2) }}><XaiMark width={170} /><span style={{ fontSize: 90, fontWeight: 300, lineHeight: 1 }}>+</span><PlivoLogoSvg width={250} color="#fff" /></div></div>
      <div style={{ ...center, top: 440, fontSize: 100, fontWeight: 600, letterSpacing: -3.6, lineHeight: 1.02, ...slide(f, 8) }}>Need your xAI agent<br />on a telephone?</div>
      <div style={{ ...center, top: 720, fontSize: 64, fontWeight: 600, letterSpacing: -2, ...slide(f, 46) }}>Connect it with Plivo.</div>
      <div style={{ ...center, top: 830, fontFamily: INTER, fontSize: 30, ...slide(f, 100) }}>Links in the description.</div>
    </AbsoluteFill>
  );
};

// ---- timeline: narration take A runs continuously from TA; every shot is placed on a word ------------
const TA = 27; const na = (t: number) => TA + Math.round(t * S); const FLY = 22;
const T_FLY1 = na(14.62); const T_PL = T_FLY1 + FLY;
const T_PL_END = na(43.40); const T_FLY2 = na(45.10); const T_XA = T_FLY2 + FLY; const T_XA_END = na(71.64); const T_CALL = na(73.24); const T_CALL_END = T_CALL + CALL_LEN;
const TB = T_CALL_END + 15; const nb = (t: number) => TB + Math.round(t * S); const T_CLOSE = nb(3.24);
export const XAI_BOARD2_FRAMES = nb(9.04) + 90;

const off: Record<keyof typeof NODES, NodeState> = { caller: "off", plivo: "off", xai: "off", agent: "off" };
const s1 = { ...off, caller: "on" as NodeState, plivo: "active" as NodeState }; const s2 = { ...off, caller: "on" as NodeState, plivo: "on" as NodeState }; const s3 = { ...s2, xai: "active" as NodeState }; const s4 = { ...s2, xai: "on" as NodeState, agent: "on" as NodeState }; const s5 = { ...s4, agent: "active" as NodeState };
const cap = (kicker: string, t: React.ReactNode) => ({ kicker, cap: t });
const hi = (t: string) => <span style={{ color: P }}>{t}</span>;

// Plivo shots [start narration-sec, end narration-sec, shot]
const PL: [number, number, Shot][] = [
  [14.62, 19.52, { node: <PlListBeat clickAt={83} />, n: "02", badge: "Plivo · SIP Trunking", ...cap("STEP 1 · PLIVO", <>Open SIP Trunking, and {hi("create an inbound trunk.")}</>) }],
  [19.52, 23.10, { node: <PlPlatformBeat openAt={12} hoverAt={40} pickAt={78} />, n: "02", badge: "Plivo · Create Trunk", ...cap("SIP PLATFORM", <>Under SIP platform, {hi("pick xAI.")}</>) }],
  [23.10, 24.96, { node: <PlNameBeat typeFrom={6} typeUntil={30} />, n: "02", badge: "Plivo · Create Trunk", ...cap("TRUNK NAME", <>Then {hi("give the trunk a name.")}</>) }],
  [24.96, 28.50, { node: <PlUriBeat modalAt={50} />, n: "02", badge: "Plivo · Create Trunk", ...cap("PRIMARY URI", <>For the primary URI, {hi("create a new one.")}</>) }],
  [28.50, 33.02, { node: <PlUriBeat modalAt={0} />, cont: true, rings: [{ at: 36, x: 960, y: 471 }, { at: 99, x: 650, y: 528 }], n: "02", badge: "Plivo · new xAI SIP URI", ...cap("PRE-FILLED", <>Plivo fills in {hi("xAI's SIP address")} for you, with TLS already set.</>) }],
  [33.02, 36.66, { node: <PlUriBeat modalAt={0} typeFrom={4} typeUntil={28} createdAt={58} />, rings: [{ at: 52, x: 1250, y: 645 }], n: "02", badge: "Plivo · new xAI SIP URI", ...cap("PRE-FILLED", <>Just {hi("name it, and create it.")}</>) }],
  [36.66, 40.28, { node: <PlLinkBeat openAt={10} pickAt={62} createAt={92} />, n: "02", badge: "Plivo · Create Trunk", ...cap("LINK YOUR NUMBER", <>Now {hi("link your phone number,")} and create the trunk.</>) }],
  [40.28, 43.40 + FLY / S, { node: <PlDoneBeat />, n: "02", badge: "Plivo · SIP Trunking", ...cap("DONE ON PLIVO", <>Your number now {hi("rings straight into xAI.")}</>) }],
];
// xAI shots
const XA: [number, number, Shot][] = [
  [45.10, 50.89, { node: <XaAgentBeat />, rings: [{ at: 30, x: 307, y: 105 }], n: "03", badge: "xAI console · Athena Pottery Support", ...cap("STEP 2 · XAI", <>For this, we created {hi("a custom pottery agent")} in the xAI console.</>) }],
  [50.89, 52.78, { node: <XaAgentBeat />, rings: [{ at: 20, x: 693, y: 273 }], n: "03", badge: "xAI console · Athena Pottery Support", ...cap("CONNECT IT TO THE NUMBER", <>Open Deployment, and {hi("add a phone number.")}</>) }],
  [52.78, 54.58, { node: <XaDeploymentBeat />, rings: [{ at: 26, x: 1820, y: 330 }], cont: true, n: "03", badge: "xAI console · Deployment", ...cap("CONNECT IT TO THE NUMBER", <>Open Deployment, and {hi("add a phone number.")}</>) }],
  [54.58, 57.38, { node: <XaNumberModalBeat tabAt={8} nameFrom={22} nameUntil={50} numFrom={9999} numUntil={9999} />, rings: [{ at: 8, x: 745, y: 296 }], n: "03", badge: "xAI console · New phone number", ...cap("DIRECT SIP", <>Choose {hi("Direct SIP.")}</>) }],
  [57.38, 60.79, { node: <XaNumberModalBeat tabAt={0} nameFrom={0} nameUntil={0} numFrom={4} numUntil={40} />, rings: [{ at: 92, x: 1160, y: 855 }], n: "03", badge: "xAI console · New phone number", ...cap("DIRECT SIP", <>Enter {hi("the Plivo number,")} and xAI ties it to the agent.</>) }],
  [60.79, 63.68, { node: <XaAgentBeat voice />, rings: [{ at: 54, x: 720, y: 445 }], n: "03", badge: "xAI console · Configuration", ...cap("WANT TO CHANGE SOMETHING?", <>The voice, {hi("the welcome message,")} it's all under Configuration.</>) }],
  [63.68, 68.40, { node: <XaAgentBeat />, rings: [{ at: 30, x: 540, y: 273 }], cont: true, n: "03", badge: "xAI console · Configuration", ...cap("WANT TO CHANGE SOMETHING?", <>Edit it, and {hi("the next call picks it up.")}</>) }],
  [68.40, 71.64 + FLY / S, { node: <XaDeploymentBeat rows toast />, n: "03", badge: "xAI console · Deployment", ...cap("CONNECTED", <>{hi("One number, on both sides.")} Let's call it.</>) }],
];
const Shots: React.FC<{ list: [number, number, Shot][]; at: (t: number) => number }> = ({ list, at }) => <>{list.map(([a, b, s], i) => <Sequence key={i} from={at(a)} durationInFrames={at(b) - at(a)} layout="none"><Footage {...s} len={(at(b) - at(a)) / S} /></Sequence>)}</>;

export const XaiBoard2: React.FC = () => (
  <AbsoluteFill style={{ background: BG }}>
    <Sequence from={TA} layout="none"><Audio src={staticFile("vo/xai2/narr-a7f.mp3")} /></Sequence>
    <Sequence from={TB} layout="none"><Audio src={staticFile("vo/xai2/narr-b-v4f.mp3")} /></Sequence>

    {/* 1 — purple opener: Grok released Voice Agents → + Plivo → what you need */}
    <Sequence from={0} durationInFrames={T_FLY1} layout="none"><Opener2 /></Sequence>
    {/* 2 — Plivo */}
    <Shots list={PL} at={na} />
    <Sequence from={T_PL_END + FLY} durationInFrames={T_FLY2 - T_PL_END - FLY} layout="none"><Sequence from={-60} layout="none"><Board states={s3} title={<>Over <span style={{ color: P }}>to xAI.</span></>} sub="Plivo is done. Now the agent." step="STEP 2 OF 3" /></Sequence></Sequence>
    {/* 3 — xAI */}
    <Shots list={XA} at={na} />
    <Sequence from={T_XA_END + FLY} durationInFrames={T_CALL - T_XA_END - FLY} layout="none"><Sequence from={-60} layout="none"><Board states={s5} title={<>Let's <span style={{ color: P }}>call it.</span></>} sub="Every box is lit. Dial the Plivo number." step="STEP 3 OF 3" /></Sequence></Sequence>
    {/* 4 — the real call */}
    <Sequence from={T_CALL} durationInFrames={CALL_LEN} layout="none"><RealCall /></Sequence>
    <Sequence from={T_CALL_END} durationInFrames={T_CLOSE - T_CALL_END} layout="none"><Board states={s4} title={<>That's the agent,<br /><span style={{ color: P }}>on a real phone line.</span></>} sub="Dialled from any phone. Answered by xAI, through Plivo." step="LIVE" /></Sequence>
    {/* 6 — close */}
    <Sequence from={T_CLOSE} durationInFrames={XAI_BOARD2_FRAMES - T_CLOSE} layout="none"><Closer2 /></Sequence>
    {/* fly transitions on top */}
    <Sequence from={T_FLY1} durationInFrames={FLY} layout="none"><Wipe /></Sequence>
    <Sequence from={T_PL_END} durationInFrames={FLY} layout="none"><Fly states={s2} to="plivo" out title={<>Over <span style={{ color: P }}>to xAI.</span></>} sub="Plivo is done. Now the agent." step="STEP 2 OF 3" /></Sequence>
    <Sequence from={T_FLY2} durationInFrames={FLY} layout="none"><Fly states={s3} to="xai" title={<>Over <span style={{ color: P }}>to xAI.</span></>} sub="Plivo is done. Now the agent." step="STEP 2 OF 3" /></Sequence>
    <Sequence from={T_XA_END} durationInFrames={FLY} layout="none"><Fly states={s4} to="xai" out title={<>Let's <span style={{ color: P }}>call it.</span></>} sub="Every box is lit. Dial the Plivo number." step="STEP 3 OF 3" /></Sequence>
        <Sequence from={T_CLOSE - FLY} durationInFrames={FLY} layout="none"><WipeIn /></Sequence>
  </AbsoluteFill>
);
// "what you need" pills, on the words
const Needs2: React.FC = () => {
  const f = useCurrentFrame();
  const pill = (x: number, y: number, t: string, a: number) => f < a ? null : <div style={{ position: "absolute", left: x, top: y, fontFamily: MONO, fontSize: 14, color: "#fff", background: "rgba(205,62,249,0.18)", border: `1px solid ${P}`, padding: "8px 12px", borderRadius: 999, ...pop(f, a) }}>{t}</div>;
  return <>{pill(1660, 190, "◉ account with Voice Agents", na(8.57))}{pill(1240, 190, "☎ account with a phone number", na(10.67))}</>;
};
