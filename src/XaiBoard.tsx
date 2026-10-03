import React from "react";
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile, useCurrentFrame, interpolate, Easing } from "remotion";
import { MUSIC } from "./promoConfig";
import { PlivoLogoSvg } from "./PlivoLogoSvg";
import { MONO, SORA, INTER } from "./StyleFrames";
import { CALL_ENV } from "./xaiCallEnv";

// ============================================================================
// XaiBoard — the xAI video on the BOARD language (see StyleXai.tsx): a dark map of
// four nodes is the spine; we fly into a node, the recording plays FULL FRAME at
// REAL SPEED with rings on the real clicks and a caption strip, then fly back out
// and the node lights green. Narration sentences are placed on the moments they
// describe (sliced from the single take by word timestamps).
// ============================================================================
export const BG = "#0a0c12"; export const INK = "#f2f3f7"; export const DIM = "rgba(242,243,247,0.45)"; export const P = "#cd3ef9"; export const GREEN = "#3ddc84";
const FILE = "xai-demo.mp4"; const CROP_TOP = 140, CROP_BOTTOM = 90; const SCALE = 1920 / 1728; const VIS_H = Math.round((1080 - CROP_TOP - CROP_BOTTOM) * SCALE); const TOP = Math.round((1080 - VIS_H) / 2);
export const ease = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { easing: Easing.inOut(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
export const pop = (f: number, at: number) => { const p = interpolate(f, [at, at + 12], [0, 1], { easing: Easing.out(Easing.back(2)), extrapolateLeft: "clamp", extrapolateRight: "clamp" }); return { opacity: Math.min(1, interpolate(f, [at, at + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })), transform: `scale(${0.7 + 0.3 * p})` }; };
// narration word anchors (frames in the take)
const W = { hook: 0, need: 184, plivo: 444, open: 507, platform: 598, uri: 656, name: 733, whole: 794, rings: 849, agentto: 940, xai: 1007, support: 1118, asks: 1198, writes: 1357, athena: 1438, deploy: 1520, enter: 1612, two: 1738, call: 1822, after: 1853, knobs: 1951, back: 1985, instr: 2043, voice: 2066, welcome: 2083, tools: 2106, change: 2137, never: 2206, close: 2262, describe: 2342, links: 2441, end: 2462 };
const Narr: React.FC<{ at: number; from: number; to: number }> = ({ at, from, to }) => <Sequence from={at} durationInFrames={to - from} layout="none"><Audio src={staticFile("vo/xai/narr.mp3")} trimBefore={from} trimAfter={to} /></Sequence>;

// ---- board ------------------------------------------------------------------------
export type NodeState = "off" | "on" | "active";
export const NODES = { caller: { x: 300, y: 560, w: 300 }, plivo: { x: 690, y: 560, w: 360 }, xai: { x: 1140, y: 560, w: 260 }, agent: { x: 1490, y: 560, w: 520 } };
export const Board: React.FC<{ states: Record<keyof typeof NODES, NodeState>; title?: React.ReactNode; sub?: React.ReactNode; step?: string; zoomTo?: keyof typeof NODES; zoom?: number; children?: React.ReactNode }> = ({ states, title, sub, step, zoomTo, zoom = 1, children }) => {
  const f = useCurrentFrame(); const z = zoomTo ? NODES[zoomTo] : null; const origin = z ? `${z.x + z.w / 2}px ${z.y + 70}px` : "50% 50%";
  const Node: React.FC<{ k: keyof typeof NODES; n: string; t: string; s: string; at: number }> = ({ k, n, t, s, at }) => { const st = states[k]; const g = NODES[k]; return (
    <div style={{ position: "absolute", left: g.x, top: g.y, width: g.w, borderRadius: 22, padding: "22px 26px", background: st === "active" ? P : "rgba(255,255,255,0.04)", border: `1px solid ${st === "off" ? "rgba(255,255,255,0.14)" : st === "on" ? GREEN : P}`, boxShadow: st === "active" ? "0 30px 80px rgba(205,62,249,0.45)" : "none", ...pop(f, at) }}>
      <div style={{ display: "flex", alignItems: "center" }}><span style={{ fontFamily: MONO, fontSize: 13, letterSpacing: 2, color: st === "active" ? "#fff" : DIM }}>{n}</span>{st === "on" ? <span style={{ marginLeft: "auto", fontFamily: MONO, fontSize: 12, color: GREEN }}>● DONE</span> : null}</div>
      <div style={{ marginTop: 10, fontSize: 28, fontWeight: 600, color: "#fff", whiteSpace: "nowrap" }}>{t}</div>
      <div style={{ marginTop: 6, fontFamily: MONO, fontSize: 13, color: st === "active" ? "rgba(255,255,255,0.85)" : DIM }}>{s}</div>
    </div>); };
  const edge = (x1: number, y1: number, x2: number, y2: number, on: boolean, at: number) => <path d={`M ${x1} ${y1} C ${(x1 + x2) / 2} ${y1}, ${(x1 + x2) / 2} ${y2}, ${x2} ${y2}`} fill="none" stroke={on ? P : "rgba(255,255,255,0.2)"} strokeWidth={on ? 4 : 2} strokeDasharray={on ? undefined : "8 10"} opacity={ease(f, at, at + 14)} />;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(90% 70% at 50% 40%, #131728 0%, ${BG} 70%)`, fontFamily: SORA, color: INK, overflow: "hidden" }}>
      <AbsoluteFill style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: origin }}>
        <div style={{ position: "absolute", top: 48, left: 72, display: "flex", alignItems: "center", gap: 16 }}><PlivoLogoSvg width={100} color={INK} /><span style={{ fontFamily: MONO, fontSize: 14, letterSpacing: 3, color: DIM }}>× XAI VOICE AGENTS</span></div>
        {title ? <div style={{ position: "absolute", left: 0, right: 0, top: 170, textAlign: "center", padding: "0 200px" }}><div style={{ fontSize: 72, fontWeight: 600, letterSpacing: -2.4, lineHeight: 1.04 }}>{title}</div>{sub ? <div style={{ marginTop: 22, fontSize: 24, color: DIM, fontFamily: INTER, lineHeight: 1.5 }}>{sub}</div> : null}</div> : null}
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
          {edge(600, 640, 690, 640, states.caller === "on", 30)}{edge(1050, 640, 1140, 640, states.plivo === "on", 40)}{edge(1400, 640, 1490, 640, states.xai === "on", 50)}
        </svg>
        <Node k="caller" n="01" t="Caller" s="any phone, anywhere" at={20} /><Node k="plivo" n="02" t="Plivo" s="number + inbound trunk" at={30} /><Node k="xai" n="03" t="xAI" s="sip.voice.x.ai · TLS" at={40} /><Node k="agent" n="04" t="Athena Pottery Support" s="the Grok voice agent" at={50} />
        {step ? <div style={{ position: "absolute", right: 72, bottom: 60, fontFamily: MONO, fontSize: 14, color: DIM, letterSpacing: 2 }}>{step}</div> : null}
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---- inside a node: the recording, full frame, real speed, rings + caption strip ------------
type Ring = { at: number; x: number; y: number }; type Cap = { at: number; kicker: string; text: React.ReactNode };
const Footage: React.FC<{ src: [number, number]; badge: string; n: string; rings?: Ring[]; caps?: Cap[]; children?: React.ReactNode }> = ({ src, badge, n, rings = [], caps = [], children }) => {
  const f = useCurrentFrame(); const cap = [...caps].reverse().find((c) => f >= c.at);
  return (
    <AbsoluteFill style={{ background: BG, fontFamily: SORA }}>
      <div style={{ position: "absolute", top: TOP, left: 0, width: 1920, height: VIS_H, overflow: "hidden" }}>
        <OffthreadVideo src={staticFile(FILE)} trimBefore={Math.round(src[0] * 30)} muted style={{ width: 1920, height: Math.round(1080 * SCALE), marginTop: -Math.round(CROP_TOP * SCALE), display: "block" }} />
      </div>
      {rings.map((r, i) => { const t = f - r.at; if (t < -6 || t > 40) return null; const rad = 18 + Math.max(0, t) * 3.2; return <React.Fragment key={i}><div style={{ position: "absolute", left: r.x - rad, top: r.y - rad, width: rad * 2, height: rad * 2, borderRadius: "50%", border: `3px solid ${P}`, opacity: Math.max(0, 1 - Math.max(0, t) / 40), pointerEvents: "none" }} /><div style={{ position: "absolute", left: r.x - 8, top: r.y - 8, width: 16, height: 16, borderRadius: 8, background: P, boxShadow: "0 0 0 6px rgba(205,62,249,0.35)", opacity: ease(f, r.at - 6, r.at) * (1 - Math.max(0, t - 26) / 14) }} /></React.Fragment>; })}
      <div style={{ position: "absolute", top: 40, left: 60, display: "flex", alignItems: "center", gap: 14, background: "rgba(10,12,18,0.88)", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 999, padding: "10px 18px 10px 12px" }}><span style={{ fontFamily: MONO, fontSize: 13, background: P, color: "#fff", padding: "6px 10px", borderRadius: 999 }}>{n}</span><span style={{ fontSize: 20, fontWeight: 600, color: "#fff" }}>{badge}</span><span style={{ fontFamily: MONO, fontSize: 13, color: DIM }}>· real time</span></div>
      {cap ? <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "70px 72px 44px", background: "linear-gradient(180deg, rgba(10,12,18,0) 0%, rgba(10,12,18,0.94) 55%)" }}><div style={{ fontFamily: MONO, fontSize: 14, letterSpacing: 3, color: P, ...pop(f, cap.at) }}>{cap.kicker}</div><div style={{ marginTop: 8, fontSize: 42, fontWeight: 600, color: "#fff", letterSpacing: -1.2, lineHeight: 1.15, ...pop(f, cap.at + 2) }}>{cap.text}</div></div> : null}
      {children}
    </AbsoluteFill>
  );
};
// the builder: chat on the left (real speed), the agent taking shape on the right
const Builder: React.FC<{ src: [number, number]; rows: [string, string, number][]; kicker: string; title: React.ReactNode }> = ({ src, rows, kicker, title }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: BG, fontFamily: SORA }}>
      <div style={{ position: "absolute", left: 0, top: TOP, width: 1120, height: VIS_H, overflow: "hidden" }}>
        <OffthreadVideo src={staticFile(FILE)} trimBefore={Math.round(src[0] * 30)} muted style={{ width: 1920, height: Math.round(1080 * SCALE), marginLeft: -330, marginTop: -Math.round(CROP_TOP * SCALE), display: "block" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(10,12,18,0) 78%, rgba(10,12,18,1) 100%)" }} />
      </div>
      <div style={{ position: "absolute", left: 1150, top: 0, width: 700, height: 1080, display: "flex", flexDirection: "column", justifyContent: "center", gap: 16 }}>
        <div style={{ fontFamily: MONO, fontSize: 14, letterSpacing: 3, color: P }}>{kicker}</div>
        <div style={{ fontSize: 52, fontWeight: 600, color: "#fff", letterSpacing: -1.6, lineHeight: 1.05, marginBottom: 10 }}>{title}</div>
        {rows.map(([k, v, at], i) => { const on = f >= at; return <div key={k} style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 18px", borderRadius: 14, background: "rgba(255,255,255,0.04)", border: `1px solid ${on ? "rgba(61,220,132,0.55)" : "rgba(255,255,255,0.1)"}`, opacity: on ? 1 : 0.4, transform: `translateX(${on ? 0 : 8}px)` }}><span style={{ fontFamily: MONO, fontSize: 13, color: on ? GREEN : DIM, width: 22 }}>{on ? "✓" : String(i + 1)}</span><span style={{ fontFamily: INTER, fontSize: 18, color: DIM, width: 190 }}>{k}</span><span style={{ fontFamily: INTER, fontSize: 20, color: "#fff" }}>{on ? v : "…"}</span></div>; })}
      </div>
    </AbsoluteFill>
  );
};
// the call: a live transcript thread
const CALL: [string, "AGENT" | "YOU", string][] = [["greet", "AGENT", "Hi, thanks for calling Athena Pottery! How can I help you today?"], ["q1", "YOU", "Hi. I'd like to book an appointment for a custom order."], ["a1", "AGENT", "Happy to help with that. We take custom order appointments Monday to Friday, eight to five Central. What day works for you?"], ["q2", "YOU", "Thursday afternoon, if you have it."], ["a2", "AGENT", "Thursday afternoon works. Can I get your name and the best number to call you back on?"]];
const L = (k: string) => CALL_ENV[k].length; const CALL_AT: number[] = []; { let t = 30; for (const [k] of CALL) { CALL_AT.push(t); t += L(k) + 14; } }
const CALL_LEN = CALL_AT[CALL_AT.length - 1] + L(CALL[CALL.length - 1][0]) + 30;
const Transcript: React.FC = () => {
  const f = useCurrentFrame(); const live = f >= 30; const secs = Math.max(0, Math.floor((f - 30) / 30));
  const cur = CALL.findIndex(([k], i) => f >= CALL_AT[i] && f < CALL_AT[i] + L(k)); const lvl = cur >= 0 ? (CALL_ENV[CALL[cur][0]][f - CALL_AT[cur]] ?? 0) : 0;
  return (
    <Board states={{ caller: "on", plivo: "on", xai: "on", agent: "active" }} zoom={1}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, background: BG }} />
      <div style={{ position: "absolute", top: 48, left: 72, display: "flex", alignItems: "center", gap: 16 }}><PlivoLogoSvg width={100} color={INK} /><span style={{ fontFamily: MONO, fontSize: 14, letterSpacing: 3, color: DIM }}>× XAI VOICE AGENTS</span></div>
      <div style={{ position: "absolute", left: 72, top: 150, display: "flex", alignItems: "center", gap: 18 }}><span style={{ width: 14, height: 14, borderRadius: 7, background: live ? GREEN : "#fbbf24", boxShadow: `0 0 0 8px ${live ? "rgba(61,220,132,0.2)" : "rgba(251,191,36,0.2)"}` }} /><span style={{ fontFamily: MONO, fontSize: 16, letterSpacing: 3, color: INK }}>{live ? "LIVE" : "CONNECTING"} · +1 701 719 8695 → ATHENA POTTERY SUPPORT · 00:{String(secs).padStart(2, "0")}</span><span style={{ marginLeft: 20, fontFamily: MONO, fontSize: 12, letterSpacing: 2, color: "#fbbf24", border: "1px solid rgba(251,191,36,0.5)", padding: "5px 10px", borderRadius: 999 }}>DEMO AUDIO</span></div>
      <div style={{ position: "absolute", left: 72, top: 230, width: 1100, display: "flex", flexDirection: "column", gap: 22 }}>
        {CALL.map(([k, w, t], i) => { if (f < CALL_AT[i] - 4) return null; const on = i === cur; const n = Math.floor(Math.max(0, f - CALL_AT[i]) * (t.length / Math.max(1, L(k)))); return (
          <div key={k} style={{ display: "flex", gap: 22, alignItems: "flex-start", opacity: i < cur ? (w === "YOU" ? 0.55 : 0.8) : 1 }}>
            <span style={{ fontFamily: MONO, fontSize: 13, letterSpacing: 2, color: w === "YOU" ? GREEN : P, width: 70, paddingTop: 12 }}>{w}</span>
            <div style={{ fontSize: w === "YOU" ? 30 : 34, fontWeight: w === "YOU" ? 500 : 600, color: w === "YOU" ? DIM : "#fff", lineHeight: 1.3, maxWidth: 980 }}>{t.slice(0, n)}{on && n < t.length ? <span style={{ opacity: Math.round(f / 6) % 2 }}>▍</span> : null}</div>
          </div>); })}
        {cur >= 0 ? <div style={{ display: "flex", gap: 22, alignItems: "center" }}><span style={{ fontFamily: MONO, fontSize: 13, letterSpacing: 2, color: CALL[cur][1] === "YOU" ? GREEN : P, width: 70 }}>{CALL[cur][1]}</span><div style={{ display: "flex", gap: 5, alignItems: "center", height: 40 }}>{Array.from({ length: 28 }, (_, i) => <span key={i} style={{ width: 6, height: 6 + 34 * lvl * (0.4 + 0.6 * Math.abs(Math.sin(i * 0.8 + f * 0.3))), borderRadius: 3, background: CALL[cur][1] === "YOU" ? GREEN : P }} />)}</div></div> : null}
      </div>
      <div style={{ position: "absolute", right: 72, top: 230, width: 560, borderRadius: 24, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)", padding: "26px 28px" }}>
        <div style={{ fontFamily: MONO, fontSize: 13, letterSpacing: 3, color: DIM }}>WHAT'S HAPPENING</div>
        {[["Caller", "dials the Plivo number", 30], ["Plivo", "inbound trunk → sip.voice.x.ai over TLS", 40], ["xAI", "answers with Athena Pottery Support", 50], ["Agent", "greets, books, takes a message", CALL_AT[0] + 20]].map(([a, b, at]) => <div key={String(a)} style={{ marginTop: 16, display: "flex", gap: 14, alignItems: "baseline", opacity: f >= (at as number) ? 1 : 0.3 }}><span style={{ fontFamily: MONO, fontSize: 13, color: f >= (at as number) ? GREEN : DIM, width: 64 }}>{a}</span><span style={{ fontFamily: INTER, fontSize: 20, color: "#fff" }}>{b}</span></div>)}
      </div>
      {CALL.map(([k], i) => <Sequence key={k} from={CALL_AT[i]} durationInFrames={L(k)} layout="none"><Audio src={staticFile(`vo/xai/call-${k}.mp3`)} volume={0.9} /></Sequence>)}
    </Board>
  );
};

// ---- fly transitions: the board zooms toward the node, the footage fades in ----------------
export const Fly: React.FC<{ states: Record<keyof typeof NODES, NodeState>; to: keyof typeof NODES; out?: boolean; title?: React.ReactNode; sub?: React.ReactNode; step?: string }> = ({ states, to, out, title, sub, step }) => { const f = useCurrentFrame(); const t = out ? 1 - ease(f, 0, 22) : ease(f, 0, 22); const op = out ? ease(f, 0, 14) : 1 - ease(f, 8, 22); return <AbsoluteFill style={{ opacity: op }}><Sequence from={-600} layout="none"><Board states={states} zoomTo={to} zoom={1 + t * 2.2} title={title} sub={sub} step={step} /></Sequence></AbsoluteFill>; }; // Sequence from -600: the board is already settled (no node pop) so the fly matches the board beneath it

// ---- timeline ----------------------------------------------------------------------------
const S = 30; // fps
// board intro (hook + needs)
const T0 = 0, T_NEED = 200, T_FLY1 = 470;
// Plivo: four real-time segments with jump cuts over idle stretches
const PL = [{ src: [261.5, 267.2] as [number, number] }, { src: [282, 290] as [number, number] }, { src: [290, 300.0] as [number, number] }, { src: [300.0, 301.1] as [number, number] }]; // 302s+ is the x.ai website: never reached (last segment + fly ends at 301.8)
const dur = (s: [number, number]) => Math.round((s[1] - s[0]) * S);
const FLY = 22; const T_PL = T_FLY1; const PL_AT = [T_PL, T_PL + dur(PL[0].src), T_PL + dur(PL[0].src) + dur(PL[1].src), T_PL + dur(PL[0].src) + dur(PL[1].src) + dur(PL[2].src)]; const T_PL_END = PL_AT[3] + dur(PL[3].src) + FLY;
const T_BOARD2 = T_PL_END; const T_FLY2 = T_BOARD2 + 30 + (W.agentto - W.rings) + 40;
// xAI: builder segments
const XA = [{ src: [2, 9] as [number, number] }, { src: [9, 26] as [number, number] }, { src: [44, 62] as [number, number] }, { src: [160, 182.5] as [number, number] }];
const T_XA = T_FLY2; const XA_AT = [T_XA, T_XA + dur(XA[0].src), T_XA + dur(XA[0].src) + dur(XA[1].src), T_XA + dur(XA[0].src) + dur(XA[1].src) + dur(XA[2].src)]; const T_XA_END = XA_AT[3] + dur(XA[3].src);
const DP = [{ src: [196, 203.5] as [number, number] }, { src: [218, 236] as [number, number] }]; const DP_AT = [T_XA_END, T_XA_END + dur(DP[0].src)]; const T_DP_END = DP_AT[1] + dur(DP[1].src) + FLY;
const T_BOARD3 = T_DP_END; const T_CALL = T_BOARD3 + 40 + (W.after - W.call) + 20; const T_AFTER = T_CALL + CALL_LEN; const T_FLY4 = T_AFTER + (W.knobs - W.after) + 10;
const KN: [number, number] = [178, 190]; const T_KN = T_FLY4; const T_KN_END = T_KN + dur(KN) + FLY; const T_CLOSE = T_KN_END;
export const XAI_BOARD_FRAMES = T_CLOSE + (W.end - W.close) + 120;

export const XaiBoard: React.FC = () => {
  const off: Record<keyof typeof NODES, NodeState> = { caller: "off", plivo: "off", xai: "off", agent: "off" };
  const s1 = { ...off, caller: "on" as NodeState, plivo: "active" as NodeState }; const s2 = { ...off, caller: "on" as NodeState, plivo: "on" as NodeState }; const s3 = { ...s2, xai: "active" as NodeState }; const s4 = { ...s2, xai: "on" as NodeState, agent: "on" as NodeState }; const s5 = { ...s4, agent: "active" as NodeState };
  return (
    <AbsoluteFill style={{ background: BG }}>
      <Audio src={staticFile(MUSIC.src)} loop volume={(f) => 0.06 * (f >= T_CALL && f < T_AFTER ? 0.25 : 1)} />
      {/* narration, sentence by sentence, on the moment it describes */}
      <Narr at={T0 + 10} from={W.hook} to={W.need} /><Narr at={T_NEED} from={W.need} to={W.plivo} />
      <Narr at={T_PL} from={W.plivo} to={W.open} /><Narr at={T_PL + 60} from={W.open} to={W.platform} /><Narr at={T_PL + 135} from={W.platform} to={W.uri} /><Narr at={PL_AT[1] + 20} from={W.uri} to={W.name} /><Narr at={PL_AT[2] + 10} from={W.name} to={W.whole} /><Narr at={PL_AT[3]} from={W.whole} to={W.rings} />
      <Narr at={T_BOARD2 + 30} from={W.rings} to={W.xai} />
      <Narr at={XA_AT[0] + 10} from={W.xai} to={W.support} /><Narr at={XA_AT[1] + 10} from={W.support} to={W.asks} /><Narr at={XA_AT[2] + 10} from={W.asks} to={W.writes} /><Narr at={XA_AT[3] + 10} from={W.writes} to={W.athena} /><Narr at={XA_AT[3] + 16 * S} from={W.athena} to={W.deploy} />
      <Narr at={DP_AT[0] + 10} from={W.deploy} to={W.enter} /><Narr at={DP_AT[1] + 10} from={W.enter} to={W.two} /><Narr at={DP_AT[1] + 13 * S} from={W.two} to={W.call} />
      <Narr at={T_BOARD3 + 40} from={W.call} to={W.after} /><Narr at={T_AFTER} from={W.after} to={W.knobs} /><Narr at={T_KN} from={W.knobs} to={W.close} />
      <Narr at={T_CLOSE + 20} from={W.close} to={W.end} />

      {/* 1 — the board: hook, then what you need */}
      <Sequence from={T0} durationInFrames={T_FLY1 - T0} layout="none">
        <Board states={off} title={<>Four boxes.<br />Two consoles.<br /><span style={{ color: P }}>One phone number.</span></>} sub="A Grok voice agent you describe in the xAI console, answering on a Plivo number." step="THE MAP">
          <BoardNeeds at={T_NEED} />
        </Board>
      </Sequence>

      {/* 2 — Plivo, real time */}
      {PL.map((p, i) => <Sequence key={i} from={PL_AT[i]} durationInFrames={dur(p.src) + (i === 3 ? FLY : 0)} layout="none">
        <Footage src={p.src} n="02" badge="Plivo · inbound trunk"
          rings={[{ at: Math.round((262.3 - p.src[0]) * S), x: 1788, y: 340 }, { at: Math.round((264.2 - p.src[0]) * S), x: 1527, y: 336 }, { at: Math.round((265.7 - p.src[0]) * S), x: 1304, y: 612 }, { at: Math.round((288.4 - p.src[0]) * S), x: 782, y: 786 }, { at: Math.round((293.2 - p.src[0]) * S), x: 1520, y: 941 }, { at: Math.round((296.6 - p.src[0]) * S), x: 1278, y: 968 }, { at: Math.round((298.7 - p.src[0]) * S), x: 1800, y: 1040 }].filter((r) => r.at >= 0 && r.at < dur(p.src))}
          caps={[{ at: 0, kicker: i === 0 ? "SIP TRUNKING" : i === 1 ? "PRIMARY URI" : i === 2 ? "LINK YOUR NUMBER" : "DONE", text: i === 0 ? <>Create an inbound trunk. Under platform, <span style={{ color: P }}>pick xAI</span>.</> : i === 1 ? <>Create the URI. <span style={{ color: P }}>It's pre-filled.</span> sip.voice.x.ai over TLS.</> : i === 2 ? <>Name it, <span style={{ color: P }}>link the number you already own</span>, create.</> : <>That's the whole connection <span style={{ color: P }}>on Plivo's side.</span></> }]} />
      </Sequence>)}
      <Sequence from={T_BOARD2} durationInFrames={T_FLY2 - T_BOARD2} layout="none"><Board states={s2} title={<>Your number now rings<br /><span style={{ color: P }}>straight into xAI.</span></>} sub="Now let's give it an agent to reach." step="STEP 2 OF 4 · DONE" /></Sequence>

      {/* 3 — xAI: build the agent (real time) */}
      <Sequence from={XA_AT[0]} durationInFrames={dur(XA[0].src)} layout="none"><Footage src={XA[0].src} n="03" badge="xAI console · Voice Agents" caps={[{ at: 0, kicker: "VOICE AGENTS", text: <>Open Voice Agents and <span style={{ color: P }}>just say what you want.</span></> }]} /></Sequence>
      <Sequence from={XA_AT[1]} durationInFrames={dur(XA[1].src)} layout="none"><Builder src={XA[1].src} kicker="03 · THE AGENT, AS IT TAKES SHAPE" title={<>You describe it.</>} rows={[["Use case", "customer support", 60], ["Business", "Athena Pottery, custom orders", 300], ["Hours", "…", 9999], ["If it can't help", "…", 9999], ["Name", "…", 9999]]} /></Sequence>
      <Sequence from={XA_AT[2]} durationInFrames={dur(XA[2].src)} layout="none"><Builder src={XA[2].src} kicker="03 · THE AGENT, AS IT TAKES SHAPE" title={<>It asks. You answer.</>} rows={[["Use case", "customer support", 0], ["Business", "Athena Pottery, custom orders", 0], ["Calendar", "none · take a message", 200], ["Hours", "Mon–Fri · 8 AM–5 PM CST", 420], ["Name", "…", 9999]]} /></Sequence>
      <Sequence from={XA_AT[3]} durationInFrames={dur(XA[3].src)} layout="none"><Builder src={XA[3].src} kicker="03 · THE AGENT, AS IT TAKES SHAPE" title={<>It writes. <span style={{ color: P }}>It creates.</span></>} rows={[["Use case", "customer support", 0], ["Business", "Athena Pottery, custom orders", 0], ["Hours", "Mon–Fri · 8 AM–5 PM CST", 0], ["If it can't help", "take a message + callback", 0], ["Name", "Athena Pottery Support", 15 * S]]} /></Sequence>

      {/* 4 — xAI: attach the number (real time) */}
      {DP.map((p, i) => <Sequence key={i} from={DP_AT[i]} durationInFrames={dur(p.src) + (i === 1 ? FLY : 0)} layout="none">
        <Footage src={p.src} n="04" badge="xAI console · Deployment"
          rings={[{ at: Math.round((197.0 - p.src[0]) * S), x: 779, y: 359 }, { at: Math.round((199.4 - p.src[0]) * S), x: 1769, y: 438 }, { at: Math.round((205.3 - p.src[0]) * S), x: 884, y: 367 }, { at: Math.round((230.4 - p.src[0]) * S), x: 1255, y: 911 }].filter((r) => r.at >= 0 && r.at < dur(p.src))}
          caps={i === 0 ? [{ at: 0, kicker: "DEPLOYMENT", text: <>Add a phone number. <span style={{ color: P }}>Choose Direct SIP.</span></> }] : [{ at: 0, kicker: "DIRECT SIP", text: <>Enter your Plivo number. <span style={{ color: P }}>xAI ties it to the agent</span>, over TLS.</> }, { at: 13 * S, kicker: "CONNECTED", text: <>Two consoles, one number. <span style={{ color: P }}>Done.</span></> }]} />
      </Sequence>)}

      {/* 5 — the call */}
      <Sequence from={T_BOARD3} durationInFrames={T_CALL - T_BOARD3} layout="none"><Board states={s4} title={<>Let's <span style={{ color: P }}>call it.</span></>} sub="Every box is lit. Dial the Plivo number." step="STEP 4 OF 4" /></Sequence>
      <Sequence from={T_CALL} durationInFrames={T_FLY4 - T_CALL} layout="none"><Transcript /></Sequence>

      {/* 6 — change things (real time on the configuration page) */}
      <Sequence from={T_KN} durationInFrames={dur(KN) + FLY} layout="none"><Footage src={KN} n="04" badge="xAI console · Configuration" rings={[{ at: (W.instr - W.knobs), x: 1090, y: 470 }, { at: (W.voice - W.knobs), x: 1560, y: 805 }, { at: (W.welcome - W.knobs), x: 1090, y: 930 }]} caps={[{ at: 0, kicker: "WANT IT DIFFERENT?", text: <>Back in the xAI console: <span style={{ color: P }}>instructions, voice, welcome message, tools.</span> Plivo never changes.</> }]} /></Sequence>

      {/* 7 — close */}
      <Sequence from={T_CLOSE} durationInFrames={XAI_BOARD_FRAMES - T_CLOSE} layout="none"><Board states={s4} title={<>A Grok voice agent,<br /><span style={{ color: P }}>on a real phone number.</span></>} sub="Describe it. Pick the platform. Plug in your number. Make the call. Links in the description." step="DONE" /></Sequence>
      {/* fly transitions, on top of everything */}
      <Sequence from={T_FLY1} durationInFrames={FLY} layout="none"><Fly states={s1} to="plivo" /></Sequence>
      <Sequence from={T_PL_END - FLY} durationInFrames={FLY} layout="none"><Fly states={s2} to="plivo" out /></Sequence>
      <Sequence from={T_FLY2} durationInFrames={FLY} layout="none"><Fly states={s3} to="xai" /></Sequence>
      <Sequence from={T_DP_END - FLY} durationInFrames={FLY} layout="none"><Fly states={s4} to="xai" out /></Sequence>
      <Sequence from={T_FLY4} durationInFrames={FLY} layout="none"><Fly states={s5} to="agent" /></Sequence>
      <Sequence from={T_KN_END - FLY} durationInFrames={FLY} layout="none"><Fly states={s4} to="agent" out /></Sequence>
    </AbsoluteFill>
  );
};
// "what you need" annotations on the board
export const BoardNeeds: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame(); if (f < at) return null;
  const pill = (x: number, y: number, t: string, a: number) => <div style={{ position: "absolute", left: x, top: y, fontFamily: MONO, fontSize: 14, color: "#fff", background: "rgba(205,62,249,0.18)", border: `1px solid ${P}`, padding: "8px 12px", borderRadius: 999, ...pop(f, a) }}>{t}</div>;
  return <>{pill(1660, 190, "◉ account with Voice Agents", at + 34)}{pill(1240, 190, "☎ account with a phone number", at + 80)}{pill(1060, 560, "✓ no backend · xAI hosts the agent", at + 150)}</>;
};
