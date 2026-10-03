import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate, Easing } from "remotion";
import { PlivoLogoSvg } from "./PlivoLogoSvg";
import { MONO, SORA, INTER } from "./StyleFrames";
import { VpListBeat, VpPlatformBeat, VpUriBeat, VpLinkBeat, VpDoneBeat, VaImportBeat, VaAssistantBeat, VaLogsBeat, NUMBER } from "./cards/VapiBeats";

// ============================================================================
// Vapi video — "Let your callers reach your Vapi assistant." Own language: LEDGER.
// A light brand stage split by a thin vertical rail; the four screens are entries on the rail
// (two Plivo, two Vapi) that get ticked as they're done. Narration take A (57 s) runs after the
// cold-open call; take B after the closing call. Pacing per the Pipecat feedback: ~130 wpm, holds.
// ============================================================================
const GRAD = "linear-gradient(90deg, #cd3ef9 0%, #323dfe 100%)"; const Grad: React.FC<{ children: React.ReactNode }> = ({ children }) => <span style={{ backgroundImage: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>{children}</span>;
export const VapiMark: React.FC<{ width: number; color?: string }> = ({ width, color = "#0f1117" }) => <svg width={width} height={width * 33 / 101} viewBox="0 0 101 33" xmlns="http://www.w3.org/2000/svg"><path d="M17.991 13.3c1.999 1.025 4.273.502 5.72-1.215a104 104 0 0 0 2.692-3.358 4.62 4.62 0 0 1 3.65-1.81 4.52 4.52 0 0 1 4.194 2.833l6.5 16.157c.085.212-.156.41-.341.277-1.947-1.392-7.955-5.6-12.52-7.842-1.958-.96-4.165-.499-5.553 1.182-1.221 1.48-2.56 3.298-3.536 4.661a4.76 4.76 0 0 1-3.862 2.006 4.65 4.65 0 0 1-4.313-2.918l-8.54-21.3c-.09-.225.188-.426.368-.263 2.332 2.118 9.653 8.572 15.541 11.59m60.972-3.272a8.55 8.55 0 0 1 6.64-3.126c5.248 0 9.37 4.098 9.37 9.635s-4.088 9.616-9.336 9.616c-2.737 0-5.137-1.16-6.674-3.03V33H75.55V6.902h3.412zM65.98 6.902c4.785 0 7.724 2.895 7.724 7.407v11.827h-3.39V23.22c-1.206 1.73-3.43 2.932-5.765 2.933-4.07 0-6.67-2.181-6.67-5.49 0-3.61 3.052-6.053 8.629-6.053h3.73v-.602c0-2.632-1.62-4.249-4.333-4.249-2.298 0-4.22 1.504-4.37 3.61h-3.468c.189-3.76 3.505-6.467 7.913-6.467M48.696 21.633l5.727-14.731h3.74L50.38 26.136h-3.554L39.003 6.902h3.628zm51.53 4.503h-3.449V6.902h3.449zm-33.605-8.932c-3.466 0-5.35 1.166-5.35 3.384 0 1.692 1.28 2.857 3.541 2.857 3.128 0 5.501-2.519 5.501-5.677v-.564zm18.678-6.915c-3.562 0-6.336 2.582-6.336 6.324 0 3.628 2.774 6.285 6.336 6.285 3.486 0 6.261-2.769 6.261-6.285 0-3.63-2.775-6.324-6.261-6.324m14.927-5.198h-3.449V1.65h3.449z" fill={color} /></svg>;
const S = 30; const BG = "#f9fafb"; const INK = "#0f1117"; const BLUE = "#323dfe"; const PURPLE = "#cd3ef9"; const GRAY = "#6b7280"; const LINE = "rgba(15,17,23,0.10)";
const ease = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { easing: Easing.inOut(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const pop = (f: number, at: number): React.CSSProperties => { const p = interpolate(f, [at, at + 12], [0, 1], { easing: Easing.out(Easing.back(2)), extrapolateLeft: "clamp", extrapolateRight: "clamp" }); return { opacity: Math.min(1, ease(f, at, at + 6)), transform: `translateY(${(1 - p) * 18}px)` }; };
const GCard: React.FC<{ style?: React.CSSProperties; children: React.ReactNode }> = ({ style, children }) => <div style={{ borderRadius: 24, padding: 3, background: GRAD, ...style }}><div style={{ borderRadius: 21, background: "#fff", height: "100%", boxSizing: "border-box" }}>{children}</div></div>;
const Hi: React.FC<{ children: React.ReactNode }> = ({ children }) => <span style={{ color: BLUE }}>{children}</span>;

// ---- timeline ---------------------------------------------------------------------------------
const TA = 20; const na = (t: number) => TA + Math.round(t * S);
const T_REVEAL = na(11.94); const T_NEED = na(18.44); const T_PL = na(24.7); const T_VA = na(41.82); const T_VAIMPORT = na(46.62);
const TB = na(60.74) + 22; const nb = (t: number) => TB + Math.round(t * S); const T_CTA = nb(4.2);
export const VAPI_FRAMES = nb(6.1) + 70;

// ---- the ledger rail --------------------------------------------------------------------------
const ENTRIES: [string, string, string][] = [["01", "Plivo", "Inbound trunk"], ["02", "Plivo", "Link the number"], ["03", "Vapi", "Import the number"], ["04", "Vapi", "Pick the assistant"]];
const Ledger: React.FC<{ done: number; active: number }> = ({ done, active }) => { const f = useCurrentFrame(); return (
  <div style={{ position: "absolute", left: 80, top: 190, width: 300, fontFamily: INTER }}>
    <div style={{ position: "absolute", left: 17, top: 10, bottom: 10, width: 2, background: LINE }} />
    {ENTRIES.map(([n, side, label], i) => { const isDone = i < done, on = i === active; return (
      <div key={n} style={{ position: "relative", display: "flex", alignItems: "center", gap: 18, height: 96, ...pop(f, 6 + i * 5) }}>
        <span style={{ width: 40, height: 40, borderRadius: 20, padding: 3, background: on ? GRAD : isDone ? BLUE : "rgba(15,17,23,0.25)", flex: "none", display: "inline-flex" }}><span style={{ flex: 1, borderRadius: 17, background: isDone ? BLUE : on ? "#fff" : BG, color: isDone ? "#fff" : on ? INK : GRAY, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, fontFamily: MONO }}>{isDone ? "✓" : n}</span></span>
        <span><div style={{ fontFamily: MONO, fontSize: 12, letterSpacing: 2, color: side === "Plivo" ? BLUE : PURPLE }}>{side.toUpperCase()}</div><div style={{ fontSize: 22, fontWeight: 600, color: isDone || on ? INK : GRAY, letterSpacing: -0.4 }}>{label}</div></span>
      </div>); })}
  </div>); };
const Stage: React.FC<{ chip?: string; done?: number; active?: number; ledger?: boolean; children?: React.ReactNode }> = ({ chip, done = 0, active = -1, ledger = true, children }) => (
  <AbsoluteFill style={{ background: BG, fontFamily: SORA, color: INK, overflow: "hidden" }}>
    <AbsoluteFill style={{ backgroundImage: `linear-gradient(${LINE} 1px, transparent 1px)`, backgroundSize: "100% 96px", opacity: 0.6 }} />
    <div style={{ position: "absolute", top: 44, right: 72 }}><PlivoLogoSvg width={100} color={INK} /></div>
    {chip ? <div style={{ position: "absolute", top: 50, left: 80, fontFamily: MONO, fontSize: 13, letterSpacing: 3, color: GRAY }}>{chip}</div> : null}
    {ledger ? <Ledger done={done} active={active} /> : null}
    {children}
  </AbsoluteFill>
);
/** A kit screen on the right of the rail, with a one-line title above it. */
const Screen: React.FC<{ node: React.ReactNode; title: React.ReactNode; rings?: { at: number; x: number; y: number }[]; still?: boolean }> = ({ node, title, rings = [], still }) => {
  const f = useCurrentFrame(); const e = still ? 1 : ease(f, 0, 16); const k = 1400 / 1920;
  return (<>
    <div style={{ position: "absolute", left: 440, top: 150, fontSize: 40, fontWeight: 600, letterSpacing: -1.2, ...(still ? {} : pop(f, 0)) }}>{title}</div>
    <div style={{ position: "absolute", left: 440, top: 230, width: 1400, height: Math.round(1080 * k), borderRadius: 16, overflow: "hidden", background: "#fff", boxShadow: `0 30px 70px rgba(15,17,23,0.14)`, opacity: e, outline: "3px solid transparent", backgroundImage: `linear-gradient(#fff,#fff), ${GRAD}`, backgroundOrigin: "border-box", backgroundClip: "padding-box, border-box", border: "3px solid transparent" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${k})`, transformOrigin: "top left" }}>{node}
        {rings.map((r, i) => { const t = f - r.at; if (t < -6 || t > 40) return null; const rad = 18 + Math.max(0, t) * 3.2; return <React.Fragment key={i}><div style={{ position: "absolute", left: r.x - rad, top: r.y - rad, width: rad * 2, height: rad * 2, borderRadius: "50%", border: `4px solid ${BLUE}`, opacity: Math.max(0, 1 - Math.max(0, t) / 40) }} /><div style={{ position: "absolute", left: r.x - 9, top: r.y - 9, width: 18, height: 18, borderRadius: 9, background: BLUE, opacity: ease(f, r.at - 6, r.at) * (1 - Math.max(0, t - 26) / 14) }} /></React.Fragment>; })}
      </div>
    </div>
  </>);
};

// ---- hook: nobody can call it ------------------------------------------------------------------
const Hook: React.FC = () => {
  const f = useCurrentFrame(); const t = (s: number) => na(s);
  const ring = f >= t(2.54) && f < t(6.8); const plivo = f >= t(4.68); const link = ease(f, t(5.96), t(6.8)); const answered = f >= t(6.8); const why = f >= t(7.74);
  const shake = ring ? Math.sin(f * 1.6) * 3 : 0; const bob = Math.sin(f / 11) * 5;
  // a call travels along the trunk once it's drawn, then the assistant answers
  const trav = answered ? ((f - t(6.8)) / 26) % 1 : 0;
  const bars = (n: number, live: boolean, seed: number) => Array.from({ length: n }, (_, i) => live ? 6 + 30 * Math.abs(Math.sin(i * 0.7 + f * 0.28 + seed)) * (0.35 + 0.65 * Math.abs(Math.sin(i * 0.3 + seed))) : 6);
  const AX = 960, AY = 240; const LX = 520, LY = 690; const RX = 1400, RY = 690;
  return (
  <Stage ledger={false}>
    {/* trunk lines, drawn from Plivo down to both sides; a pulse rides them once the call connects */}
    <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080} fill="none">
      <defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stopColor="#cd3ef9" /><stop offset="1" stopColor="#323dfe" /></linearGradient></defs>
      {plivo ? <><path d={`M ${AX - 110} ${AY + 120} Q ${AX - 260} ${(AY + LY) / 2} ${LX + 60} ${LY - 150}`} stroke="url(#g)" strokeWidth="7" strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - link} /><path d={`M ${AX + 110} ${AY + 120} Q ${AX + 260} ${(AY + RY) / 2} ${RX - 60} ${RY - 150}`} stroke="url(#g)" strokeWidth="7" strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - link} /></> : null}
    </svg>
    {answered ? <div style={{ position: "absolute", left: RX - 60 - (RX - 60 - (AX + 110)) * trav - 10, top: RY - 150 - (RY - 150 - (AY + 120)) * trav - 10 + Math.sin(trav * Math.PI) * -40, width: 20, height: 20, borderRadius: 10, background: BLUE, boxShadow: "0 0 0 8px rgba(50,61,254,0.2)" }} /> : null}
    {answered ? <div style={{ position: "absolute", left: AX - 110 - (AX - 110 - (LX + 60)) * trav - 10, top: AY + 120 + (LY - 150 - (AY + 120)) * trav - 10 + Math.sin(trav * Math.PI) * -40, width: 20, height: 20, borderRadius: 10, background: PURPLE, boxShadow: "0 0 0 8px rgba(205,62,249,0.2)", opacity: trav > 0.05 ? 1 : 0 }} /> : null}

    {/* the assistant on Vapi: a talking card */}
    <div style={{ position: "absolute", left: LX - 240, top: LY - 150 + bob, width: 480, ...pop(f, t(0.24)) }}>
      <GCard><div style={{ padding: "30px 34px 26px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}><VapiMark width={130} /><span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 8, background: answered ? "#1a2a22" : "#f1f2f4", color: answered ? "#5fd38d" : GRAY, fontFamily: MONO, fontSize: 12, letterSpacing: 2, padding: "7px 12px", borderRadius: 999 }}><span style={{ width: 8, height: 8, borderRadius: 4, background: answered ? "#5fd38d" : "#c4c7d0" }} />{answered ? "ON A CALL" : "READY"}</span></div>
        <div style={{ marginTop: 18, fontSize: 26, fontWeight: 600, letterSpacing: -0.6 }}>{answered ? "Hi, thanks for calling. How can I help?" : "Your assistant."}</div>
        <div style={{ marginTop: 16, display: "flex", gap: 4, alignItems: "center", height: 36 }}>{bars(40, answered, 0).map((h, i) => <span key={i} style={{ width: 6, height: h, borderRadius: 3, backgroundImage: GRAD, opacity: answered ? 1 : 0.35 }} />)}</div>
      </div></GCard>
    </div>

    {/* the caller: a phone that rings, shakes, then connects */}
    <div style={{ position: "absolute", left: RX - 150, top: RY - 210 + bob * -1, width: 300, height: 560, borderRadius: 48, background: "linear-gradient(180deg,#1c2130,#0b0f24)", border: "9px solid #05070f", boxShadow: "0 50px 120px rgba(15,17,23,0.35)", color: "#fff", textAlign: "center", fontFamily: INTER, transform: `rotate(${-6 + shake}deg)`, ...pop(f, t(2.54)) }}>
      <div style={{ marginTop: 70, fontSize: 14, color: "rgba(255,255,255,0.6)" }}>{answered ? "connected" : ring ? "calling…" : ""}</div>
      <div style={{ marginTop: 6, fontFamily: MONO, fontSize: 22, letterSpacing: 0.5 }}>{NUMBER}</div>
      <div style={{ margin: "40px auto 0", position: "relative", width: 96, height: 96, borderRadius: 48, background: answered ? "#30a46c" : BLUE, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>☎{ring ? [0, 1].map((r) => { const q = ((f / 30 + r * 0.5) % 1); return <span key={r} style={{ position: "absolute", left: -q * 40, top: -q * 40, width: 96 + q * 80, height: 96 + q * 80, borderRadius: "50%", border: "3px solid rgba(255,255,255,0.7)", opacity: 1 - q }} />; }) : null}</div>
      <div style={{ marginTop: 36, display: "flex", justifyContent: "center", gap: 3, alignItems: "center", height: 30 }}>{bars(22, answered, 2).map((h, i) => <span key={i} style={{ width: 5, height: Math.min(h, 30), borderRadius: 3, background: "#fff", opacity: answered ? 0.9 : 0.25 }} />)}</div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 44, display: "flex", justifyContent: "center" }}><span style={{ width: 62, height: 62, borderRadius: 31, background: "#e5484d", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 26, transform: "rotate(135deg)" }}>☎</span></div>
    </div>

    {/* Plivo SIP Trunking lands at the top */}
    {plivo ? <div style={{ position: "absolute", left: AX - 240, top: AY - 100, width: 480, ...pop(f, t(4.68)) }}><GCard><div style={{ height: 200, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}><PlivoLogoSvg width={180} color={INK} /><span style={{ fontSize: 36, fontWeight: 700, letterSpacing: -1.2 }}><Hi>SIP Trunking</Hi></span></div></GCard></div> : null}
    {why ? <div style={{ position: "absolute", left: 0, right: 0, top: 960, display: "flex", justifyContent: "center", gap: 18 }}>{[["Global numbers", 7.74], ["Developer friendly", 8.98], ["Pay as you go", 10.34]].map(([a, at]) => <span key={String(a)} style={{ padding: "12px 24px", borderRadius: 999, border: `2px solid ${LINE}`, background: "#fff", fontSize: 26, fontWeight: 600, color: INK, ...pop(f, t(Number(at))) }}>{a}</span>)}</div> : null}
  </Stage>); };
// ---- typographic beats ------------------------------------------------------------------------
const Reveal: React.FC = () => { const f = useCurrentFrame(); const t = (s: number) => na(s) - T_REVEAL; return (
  <Stage ledger={false}>
    <div style={{ position: "absolute", left: 80, right: 80, top: 300, textAlign: "center" }}>
      <div style={{ fontSize: 100, fontWeight: 700, letterSpacing: -4, lineHeight: 1.04, ...pop(f, t(11.94)) }}>In this video,<br />the <Hi>whole setup.</Hi></div>
      <div style={{ marginTop: 60, display: "flex", justifyContent: "center", gap: 24 }}>{[["Two screens on Plivo", BLUE, 15.18], ["Two on Vapi", PURPLE, 16.86]].map(([a, c, at]) => <span key={String(a)} style={{ padding: "16px 30px", borderRadius: 999, border: `2.5px solid ${c}`, color: String(c), fontSize: 34, fontWeight: 600, ...pop(f, t(Number(at))) }}>{a}</span>)}</div>
    </div>
  </Stage>); };
const Needs: React.FC = () => { const f = useCurrentFrame(); const t = (s: number) => na(s) - T_NEED; return (
  <Stage ledger={false}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 200, textAlign: "center", fontSize: 84, fontWeight: 700, letterSpacing: -3, ...pop(f, t(18.44)) }}>You need two things.</div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 420, display: "flex", justifyContent: "center", gap: 40 }}>
      {[["01", "A Vapi assistant", "built in the Vapi dashboard", PURPLE, 20.02], ["02", "A Plivo account", "with a phone number", BLUE, 21.62]].map(([n, a, b, c, at]) => <div key={String(n)} style={{ width: 620, ...pop(f, t(Number(at))) }}><GCard style={{ boxShadow: "0 30px 70px rgba(15,17,23,0.12)" }}><div style={{ padding: "40px 44px" }}><div style={{ fontFamily: MONO, fontSize: 14, letterSpacing: 3, color: String(c) }}>{n}</div><div style={{ marginTop: 18, fontSize: 44, fontWeight: 700, letterSpacing: -1.4 }}>{a}</div><div style={{ marginTop: 8, fontSize: 26, color: GRAY, fontFamily: INTER }}>{b}</div></div></GCard></div>)}
    </div>
  </Stage>); };
const SideIntro: React.FC<{ side: "Plivo" | "Vapi"; line: React.ReactNode; done: number; active: number }> = ({ side, line, done, active }) => { const f = useCurrentFrame(); return (
  <Stage chip={side === "Plivo" ? "01 · PLIVO" : "02 · VAPI"} done={done} active={active}>
    <div style={{ position: "absolute", left: 440, top: 0, bottom: 0, width: 1400, display: "flex", flexDirection: "column", justifyContent: "center", ...pop(f, 0) }}>
      <div style={{ fontFamily: MONO, fontSize: 14, letterSpacing: 4, color: side === "Plivo" ? BLUE : PURPLE }}>{side.toUpperCase()}</div>
      <div style={{ marginTop: 22, fontSize: 96, fontWeight: 700, letterSpacing: -4, lineHeight: 1.04 }}>{line}</div>
    </div>
  </Stage>); };
const Closer: React.FC = () => { const f = useCurrentFrame(); const t = (s: number) => nb(s) - T_CTA; const bars = Array.from({ length: 44 }, (_, i) => 10 + 46 * Math.abs(Math.sin(i * 0.55 + f * 0.1)) * (0.35 + 0.65 * Math.abs(Math.sin(i * 0.21 + 1.3)))); return (
  <Stage ledger={false}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 330, textAlign: "center" }}>
      <div style={{ display: "inline-block", ...pop(f, t(4.2)) }}><PlivoLogoSvg width={420} color={INK} /></div>
      <div style={{ marginTop: 26, display: "flex", alignItems: "center", justifyContent: "center", gap: 4, height: 60 }}>{bars.map((h, i) => <span key={i} style={{ width: 7, height: h, borderRadius: 4, backgroundImage: GRAD, opacity: 0.35 + 0.65 * Math.abs(Math.sin(i * 0.3)) }} />)}</div>
      <div style={{ marginTop: 34, fontSize: 84, fontWeight: 700, letterSpacing: -3, ...pop(f, t(4.36)) }}>Start <Hi>building.</Hi></div>
      <div style={{ marginTop: 34, display: "inline-block", background: INK, color: "#fff", fontFamily: INTER, fontWeight: 600, fontSize: 28, padding: "16px 36px", borderRadius: 999, ...pop(f, t(5.46)) }}>cx.plivo.com</div>
    </div>
  </Stage>); };
// ---- shots on the kit (narration seconds of take A) --------------------------------------------
type Shot = { a: number; b: number; done: number; active: number; chip: string; title: React.ReactNode; node: React.ReactNode; rings?: { at: number; x: number; y: number }[]; still?: boolean };
const SHOTS: Shot[] = [
  { a: 26.28, b: 29.48, done: 0, active: 0, chip: "01 · PLIVO", title: <>Open SIP Trunking. <Hi>Create an inbound trunk.</Hi></>, node: <VpListBeat clickAt={40} /> },
  { a: 29.48, b: 31.72, done: 0, active: 0, chip: "01 · PLIVO", title: <>SIP platform: <Hi>Vapi.</Hi></>, node: <VpPlatformBeat openAt={6} hoverAt={22} pickAt={40} /> },
  { a: 31.72, b: 34.88, done: 0, active: 0, chip: "01 · PLIVO", title: <>Plivo fills in <Hi>Vapi's SIP address.</Hi></>, node: <VpUriBeat modalAt={0} nameFrom={4} nameUntil={26} createdAt={70} />, rings: [{ at: 30, x: 960, y: 471 }] },
  { a: 34.88, b: 37.5, done: 1, active: 1, chip: "01 · PLIVO", title: <>Link your number. <Hi>Create the trunk.</Hi></>, node: <VpLinkBeat openAt={6} pickAt={34} createAt={64} /> },
  { a: 37.5, b: 41.82, done: 2, active: -1, chip: "01 · PLIVO", title: <>Plivo done. <Hi>Calls now go to Vapi.</Hi></>, node: <VpDoneBeat /> },
  { a: 46.62, b: 54.58, done: 2, active: 2, chip: "02 · VAPI", title: <>Phone Numbers: <Hi>BYO SIP Trunk Number.</Hi></>, node: <VaImportBeat dialogAt={26} typeFrom={56} typeUntil={92} credOpenAt={144} credPickAt={166} importAt={208} />, rings: [{ at: 24, x: 545, y: 175 }, { at: 208, x: 1470, y: 855 }] },
  { a: 54.58, b: 58.8, done: 3, active: 3, chip: "02 · VAPI", title: <>On the number, <Hi>pick the assistant.</Hi></>, node: <VaAssistantBeat openAt={30} hoverAt={48} pickAt={66} saveAt={104} />, rings: [{ at: 30, x: 1050, y: 620 }, { at: 104, x: 1830, y: 40 }] },
  { a: 58.8, b: 60.74 + 0.74, done: 4, active: -1, chip: "02 · VAPI", title: <>That's it. <Hi>Two screens each side.</Hi></>, node: <VaAssistantBeat openAt={9999} hoverAt={9999} pickAt={0} saveAt={0} />, still: true },
];

export const VapiAgent: React.FC = () => (
  <AbsoluteFill style={{ background: BG }}>
    <Sequence from={TA} layout="none"><Audio src={staticFile("vo/vapi/narr-a5.mp3")} /></Sequence>
    <Sequence from={TB} layout="none"><Audio src={staticFile("vo/vapi/narr-b5.mp3")} /></Sequence>
    <Sequence from={0} durationInFrames={T_REVEAL} layout="none"><Hook /></Sequence>
    <Sequence from={T_REVEAL} durationInFrames={T_NEED - T_REVEAL} layout="none"><Reveal /></Sequence>
    <Sequence from={T_NEED} durationInFrames={T_PL - T_NEED} layout="none"><Needs /></Sequence>
    <Sequence from={T_PL} durationInFrames={na(26.28) - T_PL} layout="none"><SideIntro side="Plivo" line={<>Start on Plivo.</>} done={0} active={0} /></Sequence>
    {SHOTS.map((s, i) => <Sequence key={i} from={na(s.a)} durationInFrames={na(s.b) - na(s.a)} layout="none"><Stage chip={s.chip} done={s.done} active={s.active}><Screen node={s.node} title={s.title} rings={s.rings} still={s.still} /></Stage></Sequence>)}
    <Sequence from={T_VA} durationInFrames={T_VAIMPORT - T_VA} layout="none"><SideIntro side="Vapi" line={<>Now Vapi needs to know two things.<br /><span style={{ color: PURPLE }}>Which number. Who answers.</span></>} done={2} active={2} /></Sequence>
    <Sequence from={TB} durationInFrames={T_CTA - TB} layout="none"><Stage chip="03 · LIVE" done={4} active={-1} ledger={false}><Screen node={<VaLogsBeat />} title={<>Every call to that number <Hi>reaches your assistant.</Hi></>} rings={[{ at: 20, x: 1100, y: 395 }]} /></Stage></Sequence>
    <Sequence from={T_CTA} durationInFrames={VAPI_FRAMES - T_CTA} layout="none"><Closer /></Sequence>
  </AbsoluteFill>
);
